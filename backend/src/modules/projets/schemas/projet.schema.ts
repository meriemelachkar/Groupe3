import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Projet extends Document {
  @Prop({ required: true })
  titre: string;

  @Prop()
  description: string;

  @Prop({ enum: ['construction', 'rénovation'], required: true })
  typeProjet: string;

  @Prop({ required: true })
  montantTotal: number;

  @Prop({ default: 0 })
  montantCollecte: number;

  @Prop({ enum: ['en_cours', 'financé', 'terminé'], default: 'en_cours' })
  statut: string;

  @Prop()
  localisation: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  promoteurId: string;
}

export const ProjetSchema = SchemaFactory.createForClass(Projet);
