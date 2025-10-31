import React, { useState } from 'react';
import { ArrowLeft, MapPin, Home, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchBienById, deleteBien } from '../api/propertiesApi';
import ReservationModal from '../components/ReservationModal';
import LoanSimulator from '../components/LoanSimulator';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Proprietaire {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
}

export interface Bien {
    _id: string;
    titre: string;
    description: string;
    prix: number;
    typeBien: string;
    adresse: string;
    statut: string;
    projetAssocieId?: string;
    proprietaireId?: Proprietaire | string;
    createdAt?: string;
    updatedAt?: string;
}

interface PropertyDetailsProps {
    property: Bien;
    onBack?: () => void;
}

const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        appartement: 'Appartement',
        maison: 'Maison',
        bureau: 'Bureau',
    };
    return labels[type] || type;
};

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onBack }) => {
    const [showReservation, setShowReservation] = useState(false);
    const { profile } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => onBack && onBack()}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
                    >
                        <ArrowLeft size={20} />
                        Retour aux biens
                    </button>

                    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                        <div className="h-64 bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                            <Home className="text-white" size={72} />
                        </div>

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{property.titre}</h1>
                                    <div className="flex items-center text-slate-600">
                                        <MapPin size={16} className="mr-2" />
                                        <span className="text-sm">{property.adresse}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-600 mb-1">Prix</div>
                                    <div className="text-2xl font-bold text-emerald-600">
                                        {property.prix.toLocaleString('fr-FR')} €
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium">
                                    {getPropertyTypeLabel(property.typeBien)}
                                </span>
                                <span className="ml-3 inline-block px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                                    {property.statut}
                                </span>
                                {profile?.role === 'admin' && (
                                    <button
                                        onClick={async () => {
                                            if (!confirm('Voulez-vous supprimer ce bien ?')) return;
                                            try {
                                                await deleteBien(property._id!);
                                                alert('Bien supprimé');
                                                navigate('/properties');
                                            } catch (err: any) {
                                                console.error('Erreur suppression bien :', err);
                                                alert(err?.response?.data?.message || err?.message || 'Erreur lors de la suppression');
                                            }
                                        }}
                                        className="ml-3 inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-700"
                                    >
                                        <Trash2 size={14} /> Supprimer
                                    </button>
                                )}
                            </div>

                            <div className="mb-6 text-slate-700 whitespace-pre-line">{property.description}</div>

                            {profile?.role === 'acheteur' && property.statut === 'disponible' && (
                                <>
                                    <button
                                        onClick={() => setShowReservation(true)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition mb-4"
                                    >
                                        Réserver ce bien
                                    </button>
                                    <LoanSimulator propertyPrice={property.prix} />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {showReservation && (
                    <ReservationModal
                        property={property}
                        onClose={() => setShowReservation(false)}
                        onSuccess={() => {
                            setShowReservation(false);
                            // optionally refresh or navigate back
                            window.location.reload();
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default PropertyDetails;

// Page wrapper qui supporte la route /properties/:id
export const PropertyDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [bien, setBien] = React.useState<PropertyDetailsProps['property'] | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!id) return setError('ID manquant');
            try {
                setLoading(true);
                const data = await fetchBienById(id);
                setBien(data as any);
            } catch (err: any) {
                console.error('Erreur chargement bien:', err);
                setError(err?.message || 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error || !bien) {
        return (
            <div className="max-w-3xl mx-auto p-8">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Erreur</h3>
                    <p className="text-sm text-slate-600 mb-4">{error || 'Bien introuvable'}</p>
                    <div className="flex justify-center">
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded" onClick={() => navigate('/properties')}>Retour</button>
                    </div>
                </div>
            </div>
        );
    }

    return <PropertyDetails property={bien} onBack={() => navigate('/properties')} />;
};
