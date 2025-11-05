import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investissement } from './schemas/investissement.schema';
import { CreateInvestissementDto } from './dto/create-investissement.dto';
import { Projet } from '../projets/schemas/projet.schema';

@Injectable()
export class InvestissementsService {
  constructor(
    @InjectModel(Investissement.name) private readonly investissementModel: Model<Investissement>,
    @InjectModel(Projet.name) private readonly projetModel: Model<Projet>,
  ) {}

  async create(dto: CreateInvestissementDto, investisseurId: string) {
    const projet = await this.projetModel.findById(dto.projetId);

    if (!projet) throw new NotFoundException('Projet non trouvé');
    if (projet.statut !== 'en_cours')
      throw new BadRequestException('Impossible d’investir sur un projet terminé ou financé');

    // Calcule la date de fin prévue basée sur la durée du projet
    const dateInvestissement = new Date();
    const dateFinPrevue = new Date(dateInvestissement);
    dateFinPrevue.setMonth(dateFinPrevue.getMonth() + projet.duree);

    // Crée l'investissement avec toutes les informations nécessaires
    const investissement = new this.investissementModel({
      ...dto,
      investisseurId,
      promoteurId: projet.promoteurId,
      dateInvestissement,
      rendementInvestissement: projet.rendement,
      dureeInvestissement: projet.duree,
      dateFinPrevue,
      statut: 'en_cours'
    });
    await investissement.save();

    // Met à jour le montant collecté du projet
    projet.montantCollecte += dto.montantInvesti;
    if (projet.montantCollecte >= projet.montantTotal) projet.statut = 'financé';
    await projet.save();

    return investissement;
  }

  async findByUser(investisseurId: string) {
    return this.investissementModel
      .find({ investisseurId })
      .populate('projetId', 'titre typeProjet statut montantTotal');
  }

  async findAll() {
    return this.investissementModel
      .find()
      .populate('investisseurId', 'nom prenom email')
      .populate('projetId', 'titre typeProjet statut');
  }
}
