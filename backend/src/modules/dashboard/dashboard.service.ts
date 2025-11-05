import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BienImmobilier } from '../biens/schemas/bien.schema';
import { Reservation } from '../reservations/schemas/reservation.schema';
import { User } from '../users/schemas/user.schema';
import { Projet } from '../projets/schemas/projet.schema';
import { Investissement } from '../investissements/schemas/investissement.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(BienImmobilier.name)
        private bienModel: Model<BienImmobilier>,
        @InjectModel(Reservation.name)
        private reservationModel: Model<Reservation>,
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(Projet.name)
        private projetModel: Model<Projet>,
        @InjectModel(Investissement.name)
        private investissementModel: Model<Investissement>,
    ) { }

    async getPromoteurDashboard(promoteurId: string) {
        // Récupérer tous les biens du promoteur
        const biens = await this.bienModel.find({ proprietaireId: promoteurId });

        // Récupérer les réservations liées à ses biens
        const reservations = await this.reservationModel
            .find({ promoteurId })
            .populate('propertyId', 'titre prix statut')
            .populate('buyerId', 'nom prenom email');

        // Retourner un résumé complet
        return {
            totalBiens: biens.length,
            totalReservations: reservations.length,
            biens,
            reservations,
        };
    }

    async getBienDetails(bienId: string, promoteurId: string) {
        // Vérifier que le bien appartient au promoteur
        const bien = await this.bienModel.findOne({ _id: bienId, proprietaireId: promoteurId }).lean();
        if (!bien) {
            throw new NotFoundException('Bien introuvable ou non autorisé');
        }

        // Vérifier s'il y a une réservation pour ce bien
        const reservation = await this.reservationModel
            .findOne({ propertyId: bienId })
            .populate('buyerId', 'nom prenom email')
            .lean();

        return {
            bien,
            reservation: reservation || null,
        };
    }

    async getPromoteurProjetsDashboard(promoteurId: string) {
        // 1. Récupérer tous les projets du promoteur
        const projets = await this.projetModel
            .find({ promoteurId })
            .lean();

        // 2. Récupérer tous les investissements liés à ces projets
        const projetsIds = projets.map(p => p._id.toString());
        const investissements = await this.investissementModel
            .find({ projetId: { $in: projetsIds } })
            .populate('investisseurId', 'nom prenom email')
            .lean();


        // 3. Calculer des statistiques
        const statsParProjet = projets.map(projet => {
            const investissementsProjet = investissements.filter(inv => inv.projetId.toString() === projet._id.toString());
            const montantTotal = projet.montantTotal;
            const montantCollecte = investissementsProjet.reduce((sum, inv) => sum + inv.montantInvesti, 0);
            const nombreInvestisseurs = new Set(investissementsProjet.map(inv => inv.investisseurId.toString())).size;

            return {
                ...projet,
                montantCollecte,
                progression: montantTotal ? (montantCollecte / montantTotal) * 100 : 0,
                nombreInvestisseurs,
                investissements: investissementsProjet,
            };
        });

        // 4. Statistiques globales
        const totalProjets = projets.length;
        const totalMontantCible = projets.reduce((sum, p) => sum + p.montantTotal, 0);
        const totalMontantCollecte = investissements.reduce((sum, inv) => sum + inv.montantInvesti, 0);
        const totalInvestisseurs = new Set(investissements.map(inv => inv.investisseurId.toString())).size;

        return {
            totalProjets,
            totalMontantCible,
            totalMontantCollecte,
            totalInvestisseurs,
            projetsDetails: statsParProjet,
        };
    }

    async getProjetDetails(projetId: string, promoteurId: string) {
        // 1. Vérifier que le projet appartient au promoteur
        const projet = await this.projetModel
            .findOne({ _id: projetId, promoteurId })
            .lean();

        if (!projet) {
            throw new NotFoundException('Projet introuvable ou non autorisé');
        }

        // 2. Récupérer tous les investissements pour ce projet
        const investissements = await this.investissementModel
            .find({ projetId })
            .populate('investisseurId', 'nom prenom email')
            .sort({ dateInvestissement: -1 })
            .lean();

        // 3. Calculer des statistiques détaillées
        const montantCollecte = investissements.reduce((sum, inv) => sum + inv.montantInvesti, 0);
        const nombreInvestisseurs = new Set(investissements.map(inv => inv.investisseurId.toString())).size;
        const moyenneInvestissement = investissements.length > 0 ? montantCollecte / investissements.length : 0;
        const progression = projet.montantTotal ? (montantCollecte / projet.montantTotal) * 100 : 0;

        // 4. Grouper les investissements par mois
        const investissementsParMois = investissements.reduce((acc, inv) => {
            const date = new Date(inv.dateInvestissement);
            const moisAnnee = `${date.getMonth() + 1}/${date.getFullYear()}`;
            if (!acc[moisAnnee]) {
                acc[moisAnnee] = {
                    montantTotal: 0,
                    nombreInvestissements: 0,
                };
            }
            acc[moisAnnee].montantTotal += inv.montantInvesti;
            acc[moisAnnee].nombreInvestissements += 1;
            return acc;
        }, {});

        return {
            projet,
            stats: {
                montantCollecte,
                nombreInvestisseurs,
                moyenneInvestissement,
                progression,
            },
            historique: investissementsParMois,
            investissements,
        };
    }
}
