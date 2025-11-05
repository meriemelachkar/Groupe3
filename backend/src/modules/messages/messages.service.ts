import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async create(dto: CreateMessageDto, expediteurId: string) {
    const message = new this.messageModel({ ...dto, expediteurId });
    return message.save();
  }

  async findByUser(userId: string) {
    // Récupère les messages envoyés et reçus
    return this.messageModel
      .find({
        $or: [{ expediteurId: userId }, { destinataireId: userId }],
      })
      .populate('expediteurId', 'nom prenom email')
      .populate('destinataireId', 'nom prenom email')
      .sort({ createdAt: -1 });
  }

  async findConversation(user1: string, user2: string) {
    // Récupère les messages entre deux utilisateurs
    return this.messageModel
      .find({
        $or: [
          { expediteurId: user1, destinataireId: user2 },
          { expediteurId: user2, destinataireId: user1 },
        ],
      })
      .sort({ createdAt: 1 });
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message introuvable');
    if (message.destinataireId.toString() !== userId)
      throw new ForbiddenException('Vous ne pouvez pas modifier ce message');

    message.lu = true;
    return message.save();
  }

  async remove(messageId: string, userId: string, isAdmin = false) {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message introuvable');
    if (!isAdmin && message.expediteurId.toString() !== userId)
      throw new ForbiddenException('Suppression interdite');

    await this.messageModel.findByIdAndDelete(messageId);
    return { message: 'Message supprimé avec succès' };
  }
}
