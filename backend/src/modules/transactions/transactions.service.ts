import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BienImmobilier } from '../biens/schemas/bien.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(BienImmobilier.name) private bienModel: Model<BienImmobilier>,
  ) {}

  async create(dto: CreateTransactionDto, acheteurId: string) {
    const bien = await this.bienModel.findById(dto.bienId);

    if (!bien) throw new NotFoundException('Bien immobilier introuvable');
    if (bien.statut !== 'disponible')
      throw new BadRequestException('Ce bien n’est plus disponible à la vente');

    // (optionnel)
    // if (dto.montant !== bien.prix)
    //   throw new BadRequestException('Le montant doit correspondre au prix du bien');

    const transaction = new this.transactionModel({
      ...dto,
      acheteurId,
      statut: 'en_cours',
    });
    await transaction.save();

    bien.statut = 'réservé';
    await bien.save();

    return await transaction.populate('bienId', 'titre prix statut');
  }

 async confirmer(id: string) {
  const transaction = await this.transactionModel.findById(id);
  if (!transaction) throw new NotFoundException('Transaction introuvable');

  transaction.statut = 'terminée';
  await transaction.save();

  const bien = await this.bienModel.findById(transaction.bienId);
  if (!bien) throw new NotFoundException('Bien introuvable');

  bien.statut = 'vendu';
  await bien.save();

  return transaction;
}

  async findAll() {
    return this.transactionModel
      .find()
      .populate('acheteurId', 'nom prenom email')
      .populate('bienId', 'titre prix statut');
  }

  async findByAcheteur(acheteurId: string) {
    return this.transactionModel
      .find({ acheteurId })
      .populate('bienId', 'titre prix statut');
  }
}
