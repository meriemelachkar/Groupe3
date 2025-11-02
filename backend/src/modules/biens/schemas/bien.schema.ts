import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BienImmobilier extends Document {
  @Prop({ required: true })
  titre: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  prix: number;

  @Prop({ enum: ['appartement', 'maison', 'bureau'], required: true })
  typeBien: string;

  @Prop()
  adresse: string;

  @Prop({ enum: ['disponible', 'réservé', 'vendu'], default: 'disponible' })
  statut: string;

  @Prop({ type: Types.ObjectId, ref: 'Projet' })
  projetAssocieId?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  proprietaireId: string;

  @Prop()
  imageUrl?: string;
}

export const BienImmobilierSchema = SchemaFactory.createForClass(BienImmobilier);
