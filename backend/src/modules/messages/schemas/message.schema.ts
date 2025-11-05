import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  expediteurId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  destinataireId: string;

  @Prop({ required: true })
  contenu: string;

  @Prop({ default: false })
  lu: boolean; // indique si le message a été lu
}

export const MessageSchema = SchemaFactory.createForClass(Message);
