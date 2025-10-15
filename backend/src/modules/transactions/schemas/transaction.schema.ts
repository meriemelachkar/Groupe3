import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  acheteurId: string;

  @Prop({ type: Types.ObjectId, ref: 'BienImmobilier', required: true })
  bienId: string;

  @Prop({ required: true })
  montant: number;

  @Prop({ default: Date.now })
  dateTransaction: Date;

  @Prop({ enum: ['en_cours', 'terminée'], default: 'en_cours' })
  statut: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
