import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';

export const Profile: React.FC = () => {
    const { profile } = useAuth();

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-slate-600">Chargement du profil...</div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-slate-900 text-white p-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-600 p-4 rounded-full">
                                <User size={32} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{profile.prenom} {profile.nom}</h1>
                                <span className="inline-block mt-2 bg-emerald-600 px-3 py-1 rounded-full text-sm">
                                    {profile.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Informations Personnelles</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="text-slate-400" size={20} />
                                        <div>
                                            <div className="text-sm text-slate-600">Email</div>
                                            <div className="text-slate-900">{profile.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Phone className="text-slate-400" size={20} />
                                        <div>
                                            <div className="text-sm text-slate-600">Téléphone</div>
                                            <div className="text-slate-900">{profile.telephone || 'Non renseigné'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-slate-400" size={20} />
                                        <div>
                                            <div className="text-sm text-slate-600">Adresse</div>
                                            <div className="text-slate-900">{profile.adresse || 'Non renseignée'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Shield className="text-slate-400" size={20} />
                                        <div>
                                            <div className="text-sm text-slate-600">Rôle</div>
                                            <div className="text-slate-900">{profile.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Statistiques</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <div className="text-sm text-slate-600">Investissements</div>
                                        <div className="text-2xl font-semibold text-slate-900">
                                            {profile.nombreInvestissements || 0}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <div className="text-sm text-slate-600">Montant Total</div>
                                        <div className="text-2xl font-semibold text-emerald-600">
                                            {(profile.montantTotalInvesti || 0).toLocaleString('fr-FR')} €
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};