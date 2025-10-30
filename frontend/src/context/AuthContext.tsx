import React, { createContext, useContext, useEffect, useState } from 'react';
import { registerUser, loginUser } from '../api/authApi';


export interface Profile {
    id: string; // L'ID utilisateur
    prenom: string;
    nom: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: { token: string; userId: string } | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (data: {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        password: string;
    }) => Promise<void>;
    signIn: (data: { email: string; motDePasse: string }) => Promise<string>;
    signOut: () => void;
}
// ---------------------------------------------------


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ token: string; userId: string } | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Charger les infos depuis localStorage au démarrage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const storedProfile = localStorage.getItem('profile');
        if (token && userId) {
            setUser({ token, userId });
            if (storedProfile) {
                setProfile(JSON.parse(storedProfile));
            } else {
                // Tenter de recharger le profil si seulement le token/userId est là
                // Note : Pour une application réelle, vous voudriez peut-être appeler loadProfile ici
                // si le profil n'est pas dans localStorage, mais ça pourrait être coûteux au démarrage.
            }
        }
        setLoading(false);
    }, []);

    // Fonction pour charger le profil depuis le backend
    const loadProfile = async (userId: string, token: string) => {
        try {
            // Assurez-vous que l'URL est correcte et pointe vers un endpoint qui retourne le profil complet
            const res = await fetch(`http://localhost:3000/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Impossible de charger le profil');
            const data = await res.json();

            const profileData: Profile = {
                // 💡 ASSUREZ-VOUS QUE data._id EST DE TYPE string
                id: data._id as string, 
                prenom: data.prenom as string,
                nom: data.nom as string,
                email: data.email as string,
                role: data.role as string,
            };

            setProfile(profileData);
            localStorage.setItem('profile', JSON.stringify(profileData));
        } catch (err) {
            console.error('Erreur chargement profile:', err);
            setProfile(null);
            localStorage.removeItem('profile');
        }
    };

    const signUp = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        password: string;
    }) => {
        try {
            const res = await registerUser(data);
            console.log('Inscription réussie:', res);
        } catch (err) {
            console.error('Erreur inscription:', err);
            throw err;
        }
    };

    
    const signIn = async (data: { email: string; motDePasse: string }): Promise<string> => { // Changement du type de retour
        try {
            const res = await loginUser(data);
            console.log('Connexion réussie:', res);

            const token: string = res.token;
            // 💡 Récupération de l'ID depuis la réponse du backend
            const userId: string = res.user._id; 
            console.log('User reçu du backend:', res.user);

            // Mise à jour de l'état (asynchrone)
            setUser({ token, userId });

            // Sauvegarder dans localStorage (synchrone et immédiat)
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            // Je supprime localStorage.setItem('userName', userName) car 'profile' contient le nom complet

            // Chargement et sauvegarde du profil
            await loadProfile(userId, token);
            
            // Retourne l'ID pour une utilisation immédiate dans le composant appelant
            return userId; 

        } catch (err) {
            console.error('Erreur connexion:', err);
            throw err;
        }
    };


    const signOut = () => {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('profile');
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};