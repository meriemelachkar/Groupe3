import api from "./api";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
}

export const registerUser = async (data: RegisterData | FormData) => {
  let payload: any;
  
  if (data instanceof FormData) {
    // Les données sont déjà dans le bon format pour l'envoi
    payload = data;
  } else {
    // Mapper les noms de champs du frontend vers ceux du backend
    payload = {
      nom: data.lastName,
      prenom: data.firstName,
      email: data.email,
      motDePasse: data.password,
      role: data.role.toLowerCase(), // pour correspondre à l'enum Mongoose
    };
  }

  const res = await api.post("/auth/register", payload, {
    headers: data instanceof FormData ? {
      'Content-Type': 'multipart/form-data',
    } : undefined,
  });
  return res.data;
};


export interface LoginData {
  email: string;
  motDePasse: string;
}

export const loginUser = async (data: LoginData) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    console.error("Erreur API login:", error);
    throw error;
  }
};
