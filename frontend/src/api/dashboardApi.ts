import api from './api';

export interface ProjectDashboardStats {
    totalProjets: number;
    totalMontantCible: number;
    totalMontantCollecte: number;
    totalInvestisseurs: number;
    projetsDetails: Array<{
        _id: string;
        titre: string;
        description: string;
        typeProjet: string;
        montantTotal: number;
        montantCollecte: number;
        statut: string;
        localisation: string;
        promoteurId: string;
        rendement: number;
        duree: number;
        createdAt: string;
        updatedAt: string;
        progression: number;
        nombreInvestisseurs: number;
        investissements: Array<{
            _id: string;
            montantInvesti: number;
            dateInvestissement: string;
            investisseurId: {
                _id: string;
                nom: string;
                prenom: string;
                email: string;
            };
        }>;
    }>;
}

export interface ProjectDetails {
    projet: {
        _id: string;
        titre: string;
        description: string;
        typeProjet: string;
        montantTotal: number;
        montantCollecte: number;
        statut: string;
        localisation: string;
        promoteurId: string;
        rendement: number;
        duree: number;
        createdAt: string;
        updatedAt: string;
    };
    stats: {
        montantCollecte: number;
        nombreInvestisseurs: number;
        moyenneInvestissement: number;
        progression: number;
    };
    historique: {
        [key: string]: {
            montantTotal: number;
            nombreInvestissements: number;
        };
    };
    investissements: Array<{
        _id: string;
        montantInvesti: number;
        dateInvestissement: string;
        rendementInvestissement: number;
        dureeInvestissement: number;
        dateFinPrevue: string;
        rendementReel: number;
        statut: string;
        investisseurId: {
            _id: string;
            nom: string;
            prenom: string;
            email: string;
        };
    }>;
}

export const getDashboardProjectStats = () => {
    return api.get<ProjectDashboardStats>('/dashboard/promoteur/projets/stats');
};

export const getProjectDetails = (projetId: string) => {
    return api.get<ProjectDetails>(`/dashboard/promoteur/projet/${projetId}`);
};