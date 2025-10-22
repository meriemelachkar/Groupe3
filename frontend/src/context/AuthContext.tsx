import React, { createContext, useContext, useEffect, useState } from 'react';
import { registerUser, loginUser } from '../api/authApi';

export interface Profile {
    id: string;
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
    signIn: (data: { email: string; motDePasse: string }) => Promise<void>;
    signOut: () => void;
}

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
            }
        }
        setLoading(false);
    }, []);

    // Fonction pour charger le profil depuis le backend
    const loadProfile = async (userId: string, token: string) => {
        try {
            const res = await fetch(`http://localhost:3000/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Impossible de charger le profil');
            const data = await res.json();

            const profileData: Profile = {
                id: data._id,
                prenom: data.prenom,
                nom: data.nom,
                email: data.email,
                role: data.role,
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

    const signIn = async (data: { email: string; motDePasse: string }) => {
        try {
            const res = await loginUser(data);
            console.log('Connexion réussie:', res);

            const token = res.token;
            const userId = res.user._id;
            const userName = res.user.nom; 
            setUser({ token, userId });

            // Sauvegarder dans localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', userName);

            
            await loadProfile(userId, token);
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
