import api from "./api";

export interface Bien {
  _id: string;
  titre: string;
  description: string;
  prix: number;
  adresse: string;
  typeBien: string;
  statut: string;
  projetAssocieId: string;
}

/**
 * Récupère la liste des biens. Le token est obligatoire : la fonction lèvera
 * une erreur si aucun token n'est fourni. Le backend exige le header
 * Authorization: Bearer <token> pour identifier l'utilisateur.
 */
export const fetchBiens = async (): Promise<Bien[]> => {
  // L'instance axios (`api`) possède un intercepteur qui ajoute le token
  // automatiquement depuis localStorage si présent. Ici, on délègue la
  // responsabilité de l'injection du header à cet intercepteur.
  const res = await api.get("/biens");
  return res.data;
};

export const fetchBienById = async (id: string): Promise<Bien> => {
  if (!id) throw new Error('fetchBienById: id manquant');
  const res = await api.get(`/biens/${id}`);
  return res.data;
};

export const createBien = async (data: Partial<Bien>): Promise<Bien> => {
  const res = await api.post('/biens', data);
  return res.data;
};

export const updateBien = async (id: string, data: Partial<Bien>): Promise<Bien> => {
  if (!id) throw new Error('updateBien: id manquant');
  const res = await api.patch(`/biens/${id}`, data);
  return res.data;
};

export const createReservation = async (propertyId: string, loanSimulation?: any) => {
  const res = await api.post('/reservations', { propertyId, loanSimulation });
  return res.data;
};
