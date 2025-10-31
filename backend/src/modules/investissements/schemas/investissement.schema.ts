import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Investissement extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  investisseurId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  promoteurId: string;

  @Prop({ type: Types.ObjectId, ref: 'Projet', required: true })
  projetId: string;

  @Prop({ required: true })
  montantInvesti: number;

  @Prop({ required: true })
  dateInvestissement: Date;

  @Prop({ required: true })
  rendementInvestissement: number;  // Le rendement fixé au moment de l'investissement

  @Prop({ required: true })
  dureeInvestissement: number;  // La durée en mois fixée au moment de l'investissement

  @Prop({ required: true })
  dateFinPrevue: Date;  // Calculée à partir de dateInvestissement + dureeInvestissement

  @Prop({ default: 0 })
  rendementReel: number;  // Le rendement réel à la fin du projet

  @Prop({ default: 'en_cours', type: String, enum: ['en_cours', 'termine'] })
  statut: string;  // Statut de l'investissement
}

export const InvestissementSchema = SchemaFactory.createForClass(Investissement);
