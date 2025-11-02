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
  imageUrl?: string;
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
  if (!id) throw new Error('ID du bien manquant (fetchBienById)');
  const res = await api.get(`/biens/${id}`);
  return res.data;
};

export const uploadImage = async (image: File) => {
  console.log('Uploading image:', image);
  const formData = new FormData();
  formData.append('image', image);
  const res = await api.post('/biens/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('Upload response:', res.data);
  return res.data;
};

export const createBien = async (data: Partial<Bien>, image?: File): Promise<Bien> => {
  let imageUrl;
  if (image) {
    console.log('Starting image upload process');
    const uploadResult = await uploadImage(image);
    imageUrl = uploadResult.url;
    console.log('Image uploaded, URL:', imageUrl);
  }
  
  const payload = {
    ...data,
    ...(imageUrl && { imageUrl }),
  };
  
  console.log('Creating bien with payload:', payload);
  const res = await api.post('/biens', payload);
  return res.data;
};

export const updateBien = async (id: string, data: Partial<Bien>): Promise<Bien> => {
  if (!id) throw new Error('ID du bien manquant (updateBien)');
  const res = await api.patch(`/biens/${id}`, data);
  return res.data;
};

export const createReservation = async (propertyId: string, loanSimulation?: any) => {
  const res = await api.post('/reservations', { propertyId, loanSimulation });
  return res.data;
};

export const deleteBien = async (id: string) => {
  if (!id) throw new Error('ID du bien manquant (deleteBien)');
  const res = await api.delete(`/biens/${id}`);
  return res.data;
};
