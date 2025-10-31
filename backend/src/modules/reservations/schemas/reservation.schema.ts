import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reservation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'BienImmobilier', required: true })
  propertyId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyerId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  promoteurId?: string;

  @Prop({ enum: ['en_attente', 'accepte', 'rejete'], default: 'en_attente' })
  status: string;

  @Prop({ type: Object })
  loanSimulation?: any;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
