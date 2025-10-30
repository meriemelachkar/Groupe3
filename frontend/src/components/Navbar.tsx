import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, User, LayoutDashboard } from 'lucide-react';


interface NavbarProps {
    currentPage?: string;
}

export default function Navbar({ currentPage = "" }: NavbarProps) {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

    const onNavigate = (path: string) => {
        navigate(`/${path}`);
    };

    return (
        <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => onNavigate("")}
                            className="flex items-center gap-2 font-bold text-xl hover:text-emerald-400 transition"
                        >
                            <Building2 size={28} />
                            BuildWealth
                        </button>

                        {user && (
                            <div className="hidden md:flex items-center gap-6">
                                <button
                                    onClick={() => onNavigate('projects')}
                                    className={`hover:text-emerald-400 transition ${currentPage === 'projects' ? 'text-emerald-400' : ''}`}
                                >
                                    Projets
                                </button>
                                <button
                                    onClick={() => onNavigate('properties')}
                                    className={`hover:text-emerald-400 transition ${currentPage === 'properties' ? 'text-emerald-400' : ''}`}
                                >
                                    Biens à Vendre
                                </button>
                                <button
                                    onClick={() => onNavigate('dashboard')}
                                    className={`hover:text-emerald-400 transition ${currentPage === 'dashboard' ? 'text-emerald-400' : ''}`}
                                >
                                    Tableau de Bord
                                </button>
                                <button
                                    onClick={() => onNavigate('messages')}
                                    className={`hover:text-emerald-400 transition ${currentPage === 'messages' ? 'text-emerald-400' : ''}`}
                                >
                                    Messages
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user && profile ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    <span className="text-sm">{profile.prenom} {profile.nom}</span>
                                    <span className="text-xs bg-emerald-600 px-2 py-1 rounded">{profile.role}</span>
                                </div>
                               
                                <button
                                    onClick={() => onNavigate('dashboard')}
                                    className="p-2 hover:bg-slate-800 rounded transition"
                                    title="Tableau de bord"
                                >
                                    <LayoutDashboard size={20} />
                                </button>
                                <button
                                    onClick={signOut}
                                    className="p-2 hover:bg-slate-800 rounded transition"
                                    title="Déconnexion"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onNavigate('login')}
                                    className="px-4 py-2 hover:bg-slate-800 rounded transition"
                                >
                                    Connexion
                                </button>
                                <button
                                    onClick={() => onNavigate('signup')}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded transition"
                                >
                                    Inscription
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
