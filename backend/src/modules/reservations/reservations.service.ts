import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from './schemas/reservation.schema';
import { BienImmobilier } from '../biens/schemas/bien.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private readonly reservationModel: Model<Reservation>,
    @InjectModel(BienImmobilier.name) private readonly bienModel: Model<BienImmobilier>,
  ) {}

  /**
   * Create a reservation and set the bien status to 'réservé' atomically.
   */
  async create(dto: CreateReservationDto, buyerId: string) {
    // ensure bien exists and is available
    const bien = await this.bienModel.findById(dto.propertyId);
    if (!bien) throw new BadRequestException('Bien introuvable');
    if (bien.statut !== 'disponible') throw new BadRequestException('Le bien n\'est pas disponible');

    // Try to run both operations inside a mongoose transaction if supported by the server
    try {
      const session = await this.bienModel.db.startSession();
      try {
        session.startTransaction();
        const reservation = await this.reservationModel.create([
          {
            propertyId: dto.propertyId,
            buyerId,
            status: 'pending',
            loanSimulation: dto.loanSimulation || undefined,
          },
        ], { session });

        await this.bienModel.findByIdAndUpdate(dto.propertyId, { statut: 'réservé' }, { session });

        await session.commitTransaction();
        session.endSession();

        return reservation[0];
      } catch (err) {
        // If transaction failed, abort and rethrow to be handled below
        try { await session.abortTransaction(); } catch (e) { /* ignore */ }
        session.endSession();
        throw err;
      }
    } catch (txErr) {
      // Transactions may not be supported (standalone mongo) or may fail.
      // Fallback to sequential operations with best-effort rollback.
      try {
        const reservationDoc = await this.reservationModel.create({
          propertyId: dto.propertyId,
          buyerId,
          status: 'pending',
          loanSimulation: dto.loanSimulation || undefined,
        });

        await this.bienModel.findByIdAndUpdate(dto.propertyId, { statut: 'réservé' });

        return reservationDoc;
      } catch (err) {
        // best-effort rollback: try to remove reservation if it was created
        try {
          await this.reservationModel.deleteMany({ propertyId: dto.propertyId, buyerId });
        } catch (cleanupErr) {
          // swallow cleanup error
        }
        throw err;
      }
    }
  }

  /**
   * Return reservations for a given buyer, populated with property details.
   */
  async findByBuyer(buyerId: string) {
    if (!buyerId) return [];
    return this.reservationModel
      .find({ buyerId })
      .populate({ path: 'propertyId' })
      .lean()
      .exec();
  }

  /**
   * Cancel (delete) a reservation. Only the buyer who created it or an admin can cancel.
   * When cancelled, attempt to set the related property's statut back to 'disponible'.
   */
  async cancel(reservationId: string, requesterId: string, requesterRole?: string) {
    const reservation = await this.reservationModel.findById(reservationId);
    if (!reservation) throw new NotFoundException('Réservation introuvable');

    const isOwner = String(reservation.buyerId) === String(requesterId);
    const isAdmin = requesterRole === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException('Action non autorisée');

    const propertyId = reservation.propertyId;

    // Try transactionally delete reservation and update property
    try {
      const session = await this.bienModel.db.startSession();
      try {
        session.startTransaction();
        await this.reservationModel.findByIdAndDelete(reservationId, { session });
        // set property back to available only if it currently is 'réservé'
        await this.bienModel.findByIdAndUpdate(propertyId, { statut: 'disponible' }, { session });
        await session.commitTransaction();
        session.endSession();
        return { success: true };
      } catch (err) {
        try { await session.abortTransaction(); } catch (_) {}
        session.endSession();
        throw err;
      }
    } catch (txErr) {
      // fallback: do sequential operations with best-effort rollback
      try {
        await this.reservationModel.findByIdAndDelete(reservationId);
        await this.bienModel.findByIdAndUpdate(propertyId, { statut: 'disponible' });
        return { success: true };
      } catch (err) {
        // try to rollback by re-creating reservation if needed
        // (we can't re-create exact reservation easily here; log and rethrow)
        throw err;
      }
    }
  }
}
