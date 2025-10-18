import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Projet } from '../projets/schemas/projet.schema';
import { Investissement } from '../investissements/schemas/investissement.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { Message } from '../messages/schemas/message.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Projet.name) private readonly projetModel: Model<Projet>,
    @InjectModel(Investissement.name) private readonly investissementModel: Model<Investissement>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  // 👥 USERS
  async getAllUsers() {
    return this.userModel.find().select('-motDePasse');
  }

  async deleteUser(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Utilisateur introuvable');
    return { message: 'Utilisateur supprimé' };
  }

  async changeRole(id: string, role: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  // 🏗️ PROJETS
  async getAllProjets() {
    return this.projetModel.find().populate('promoteurId', 'nom prenom email');
  }

  async updateProjetStatut(id: string, statut: string) {
    const projet = await this.projetModel.findByIdAndUpdate(id, { statut }, { new: true });
    if (!projet) throw new NotFoundException('Projet introuvable');
    return projet;
  }

  async deleteProjet(id: string) {
    const res = await this.projetModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Projet introuvable');
    return { message: 'Projet supprimé' };
  }

  // 💸 INVESTISSEMENTS
  async getAllInvestissements() {
    return this.investissementModel.find()
      .populate('investisseurId', 'nom prenom email')
      .populate('projetId', 'titre typeProjet');
  }

  // 💳 TRANSACTIONS
  async getAllTransactions() {
    return this.transactionModel.find()
      .populate('acheteurId', 'nom prenom email')
      .populate('bienId', 'titre prix statut');
  }

  // 💬 MESSAGES
  async getAllMessages() {
    return this.messageModel.find()
      .populate('expediteurId', 'nom prenom email')
      .populate('destinataireId', 'nom prenom email')
      .sort({ createdAt: -1 });
  }

  async deleteMessage(id: string) {
    const res = await this.messageModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Message introuvable');
    return { message: 'Message supprimé' };
  }
}
