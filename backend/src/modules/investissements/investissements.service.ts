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

    // Simule un rendement de 10 % par défaut
    const rendementAttendu = dto.montantInvesti * 0.1;

    // Enregistre l’investissement
    const investissement = new this.investissementModel({
      ...dto,
      investisseurId,
      rendementAttendu,
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
