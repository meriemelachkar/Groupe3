import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BienImmobilier } from '../biens/schemas/bien.schema';
import { Reservation } from '../reservations/schemas/reservation.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(BienImmobilier.name)
    private bienModel: Model<BienImmobilier>,
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getPromoteurDashboard(promoteurId: string) {
    // 1️⃣ Récupérer tous les biens du promoteur
    const biens = await this.bienModel.find({ proprietaireId: promoteurId });

    // 2️⃣ Récupérer les réservations liées à ses biens
    const reservations = await this.reservationModel
      .find({ promoteurId })
      .populate('propertyId', 'titre prix statut')
      .populate('buyerId', 'nom prenom email');

    // 3️⃣ Retourner un résumé complet
    return {
      totalBiens: biens.length,
      totalReservations: reservations.length,
      biens,
      reservations,
    };
  }

  async getBienDetails(bienId: string, promoteurId: string) {
  // Vérifier que le bien appartient au promoteur
  const bien = await this.bienModel.findOne({ _id: bienId, proprietaireId: promoteurId }).lean();
  if (!bien) {
    throw new NotFoundException('Bien introuvable ou non autorisé');
  }

  // Vérifier s’il y a une réservation pour ce bien
  const reservation = await this.reservationModel
    .findOne({ propertyId: bienId })
    .populate('buyerId', 'nom prenom email')
    .lean();

  return {
    bien,
    reservation: reservation || null,
  };
}

}
