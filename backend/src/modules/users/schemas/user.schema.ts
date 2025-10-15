import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true }) nom: string;
  @Prop({ required: true }) prenom: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) motDePasse: string;
  @Prop({ enum: ['investisseur', 'promoteur', 'acheteur', 'admin'], default: 'acheteur' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
