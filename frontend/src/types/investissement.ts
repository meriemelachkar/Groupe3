// Type definition aligning with backend Mongoose schema for Investissement
export interface Investissement {
  _id: string;
  investisseurId: string;
  promoteurId: string;
  projetId: string;
  montantInvesti: number;
  dateInvestissement: Date;
  rendementInvestissement: number;
  dureeInvestissement: number;
  dateFinPrevue: Date;
  rendementReel: number;
  statut: 'en_cours' | 'termine';
  createdAt?: Date;
  updatedAt?: Date;
}