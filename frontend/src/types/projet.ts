// Type definition aligning with backend NestJS Mongoose schema for Projet
export interface Projet {
  // required by backend schema
  _id: string;
  titre: string;
  typeProjet: 'construction' | 'rénovation';
  montantTotal: number;
  promoteurId: string;

  // optional according to backend schema
  description?: string;
  montantCollecte?: number; // default 0
  statut?: 'en_cours' | 'financé' | 'terminé';
  localisation?: string;
  start_date?: string;
  end_date?: string;

  // UI extras (not enforced by backend schema) — keep optional so frontend can use them
  images?: string[];
  expected_return?: number;
  duration_months?: number;
  min_investment?: number;
  [key: string]: any;
}

// Projet is exported via the 'export interface Projet' declaration above
