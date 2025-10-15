import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Investissement extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  investisseurId: string;

  @Prop({ type: Types.ObjectId, ref: 'Projet', required: true })
  projetId: string;

  @Prop({ required: true })
  montantInvesti: number;

  @Prop({ default: Date.now })
  dateInvestissement: Date;

  @Prop({ default: 0 })
  rendementAttendu: number;

  @Prop({ default: 0 })
  rendementReel: number;
}

export const InvestissementSchema = SchemaFactory.createForClass(Investissement);
