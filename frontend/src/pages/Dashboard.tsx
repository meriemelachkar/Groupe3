import React, { useEffect, useState } from 'react';
import { TrendingUp, Building2, Home, DollarSign, Target } from 'lucide-react';
import api from '../api/api';
import type { Bien as BienType } from '../api/propertiesApi';
import { cancelReservation } from '../api/reservationsApi';
import { useAuth } from '../context/AuthContext';
import NavBar from "../components/Navbar";
import PropertyReservations from '../components/PropertyReservations';
import { ProjectDashboard } from '../components/ProjectDashboard';

export const Dashboard: React.FC = () => {
    const { profile, user } = useAuth();
    const [investments, setInvestments] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [biens, setBiens] = useState<BienType[]>([]);
    const [selectedBien, setSelectedBien] = useState<BienType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user, profile?.role]);

    const loadDashboardData = async () => {
        try {
            // Fetch data from our backend. We call endpoints that exist and fall back
            // to empty arrays on error. The api instance adds the token header.
            try {
                if (profile?.role === 'investisseur') {
                    const res = await api.get('/investissements/me');
                    setInvestments(res.data || []);
                }
            } catch (err) {
                console.warn('Impossible de charger les investissements:', err);
                setInvestments([]);
            }

            try {
                if (profile?.role === 'acheteur') {
                    // Backend might not expose /reservations/me; try and fallback to []
                    const res = await api.get('/reservations/me');
                    setReservations(res.data || []);
                }
            } catch (err) {
                console.warn('Impossible de charger les réservations (endpoint peut être absent):', err);
                setReservations([]);
            }

            try {
                if (profile?.role === 'promoteur') {
                    // Use backend dashboard module which returns biens + reservations summary
                    try {
                        const dash = await api.get('/dashboard/promoteur');
                        const data = dash.data || {};
                        setBiens(data.biens || []);
                        setReservations(data.reservations || []);
                        // keep projects fetched separately (projects endpoint still used)
                        try {
                            const res = await api.get('/projets/me');
                            setProjects(res.data || []);
                        } catch (err) {
                            console.warn('Impossible de charger les projets du promoteur:', err);
                            setProjects([]);
                        }
                    } catch (err) {
                        console.warn('Impossible de charger le tableau de bord promoteur:', err);
                        setBiens([]);
                        setReservations([]);
                        setProjects([]);
                    }
                }
            } catch (err) {
                console.warn('Impossible de charger les projets:', err);
                setProjects([]);
            }
        } catch (error) {
                console.error('Erreur lors du chargement des données du tableau de bord :', error);
        } finally {
            setLoading(false);
        }
    };

    const computeMonthlyPayment = (loanSimulation: any) => {
        if (!loanSimulation) return null;
        const principal = Number(loanSimulation.loanAmount || 0);
        const annualRate = Number(loanSimulation.interestRate || 0) / 100;
        const years = Number(loanSimulation.duration || 0);
        if (!principal || !annualRate || !years) return null;

        const monthlyRate = annualRate / 12;
        const n = years * 12;
        // annuity formula: A = r * P / (1 - (1 + r)^-n)
        const A = monthlyRate === 0 ? principal / n : (monthlyRate * principal) / (1 - Math.pow(1 + monthlyRate, -n));
        const total = A * n;
        const totalInterest = total - principal;
        return {
            monthly: A,
            total,
            totalInterest,
        };
    };

    const toNum = (v: any) => {
        const n = Number(v ?? 0);
        return Number.isFinite(n) ? n : 0;
    };

    // Helper to produce a localized badge for project status (supports French and older English keys)
    const getProjectStatusBadge = (status: string) => {
        const s = (status || '').toString();
        const map: Record<string, { label: string; cls: string }> = {
            en_cours: { label: 'En financement', cls: 'bg-emerald-100 text-emerald-800' },
            financé: { label: 'Financé', cls: 'bg-slate-100 text-slate-800' },
            terminé: { label: 'Terminé', cls: 'bg-slate-200 text-slate-800' },
            // older English values
            funding: { label: 'En financement', cls: 'bg-emerald-100 text-emerald-800' },
            funded: { label: 'Financé', cls: 'bg-slate-100 text-slate-800' },
            approved: { label: 'Approuvé', cls: 'bg-blue-100 text-blue-800' },
        };
        return map[s] || map['en_cours'];
    };

    const handleCancel = async (reservationId: string) => {
        if (!reservationId) return;
        if (!confirm('Voulez-vous annuler cette réservation ?')) return;
        try {
            await cancelReservation(reservationId);
            // remove from state
            setReservations((prev) => prev.filter((r) => (r._id || r.id) !== reservationId));
            alert('Réservation annulée');
        } catch (err: any) {
            console.error('Erreur annulation réservation:', err);
            alert(err?.response?.data?.message || err?.message || 'Erreur lors de l\'annulation');
        }
    };

    const calculateTotalInvested = () => {
        return investments.reduce((sum, inv) => sum + (inv?.montantInvesti ?? 0), 0);
    };

    const calculateExpectedReturns = () => {
        return investments.reduce((sum, inv) => {
            const amt = toNum(inv?.montantInvesti);
            const rate = toNum(inv?.rendementInvestissement);
            if (amt && rate) return sum + (amt * rate) / 100;
            return sum;
        }, 0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord</h1>
                        <p className="text-slate-600 mt-2">
                            {/* Bienvenue, {profile?.full_name} ({profile?.role}) */}
                        </p>
                    </div>

                    {profile?.role === 'investisseur' && (
                        <>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <DollarSign className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Total Investi</div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        {calculateTotalInvested().toLocaleString('fr-FR')} €
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <TrendingUp className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Rendements Attendus</div>
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-600">
                                        +{calculateExpectedReturns().toLocaleString('fr-FR')} €
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <Building2 className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Projets</div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        {new Set(investments.map(inv => inv.projetId?._id)).size}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-slate-200">
                                    <h2 className="text-xl font-bold text-slate-900">Mes Investissements</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                                                    Projet
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                                                    Montant
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                                                    Rendement
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                                                    Gain Attendu
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                                                    Statut
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {investments.map((investment) => (
                                                <tr key={investment._id || investment.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-900">
                                                            {investment.projetId?.titre || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-slate-600">
                                                            Durée : {investment.dureeInvestissement} mois
                                                            <br />
                                                            Fin prévue : {new Date(investment.dateFinPrevue).toLocaleDateString('fr-FR')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                                        {(investment.montantInvesti ?? 0).toLocaleString('fr-FR')} €
                                                    </td>
                                                    <td className="px-6 py-4 text-emerald-600">
                                                        {investment.rendementInvestissement || 0}%
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-emerald-600">
                                                            +{((toNum(investment.montantInvesti) * toNum(investment.rendementInvestissement)) / 100).toLocaleString('fr-FR')} €
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {new Date(investment.dateInvestissement).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                            investment.statut === 'termine' 
                                                                ? 'bg-slate-100 text-slate-800'
                                                                : 'bg-emerald-100 text-emerald-800'
                                                        }`}>
                                                            {investment.statut === 'termine' ? 'Terminé' : 'En cours'}
                                                        </span>
                                                        {investment.statut === 'termine' && (
                                                            <div className="mt-2 text-sm">
                                                                <span className="text-slate-600">Rendement réel :</span>
                                                                <span className="ml-2 font-semibold text-emerald-600">{investment.rendementReel}%</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {investments.length === 0 && (
                                        <div className="p-12 text-center">
                                            <TrendingUp className="mx-auto text-slate-400 mb-4" size={48} />
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                                Aucun investissement
                                            </h3>
                                            <p className="text-slate-600">Commencez à investir dans des projets immobiliers</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {profile?.role === 'acheteur' && (
                        <>
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <Home className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Réservations</div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">{reservations.length}</div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <DollarSign className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Valeur Totale</div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        {reservations
                                            .reduce((sum, res) => sum + (res.propertyId?.prix ?? 0), 0)
                                            .toLocaleString('fr-FR')}{' '}
                                        €
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-slate-200">
                                    <h2 className="text-xl font-bold text-slate-900">Mes Réservations</h2>
                                </div>
                                <div className="divide-y divide-slate-200">
                                    {reservations.map((reservation: any) => (
                                        <div key={reservation._id || reservation.id} className="p-6 hover:bg-slate-50">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-lg">
                                                        {reservation.propertyId?.titre}
                                                    </h3>
                                                    <p className="text-slate-600">{reservation.propertyId?.adresse}</p>
                                                </div>
                                                {(() => {
                                                    // adapter les statuts côté client aux nouveaux valeurs françaises
                                                    const s = reservation.status;
                                                    const label = s === 'en_attente' ? 'En attente' : s === 'accepte' ? 'Acceptée' : 'Rejetée';
                                                    const cls = s === 'accepte' ? 'bg-emerald-100 text-emerald-800' : s === 'en_attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
                                                    return (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
                                                            {label}
                                                        </span>
                                                    );
                                                })()}
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div>
                                                    <div className="text-sm text-slate-600">Prix</div>
                                                    <div className="font-semibold text-slate-900">
                                                        {(reservation.propertyId?.prix || 0).toLocaleString('fr-FR')} €
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-sm text-slate-600">Date de réservation</div>
                                                    <div className="font-semibold text-slate-900">
                                                        {reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString('fr-FR') : '—'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-sm text-slate-600">Type</div>
                                                    <div className="font-semibold text-slate-900">
                                                        {reservation.propertyId?.typeBien}
                                                    </div>
                                                </div>
                                            </div>

                                            {reservation.loanSimulation && (
                                                <div className="mt-4 bg-slate-50 p-4 rounded">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-sm text-slate-600 font-medium">Simulation de prêt</div>
                                                        <button
                                                            className="text-sm text-red-600 hover:underline"
                                                            onClick={() => handleCancel(reservation._id || reservation.id)}
                                                        >
                                                            Annuler la réservation
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 text-sm text-slate-700">
                                                        <div>
                                                            <div className="text-xs text-slate-500">Montant emprunté</div>
                                                            <div className="font-semibold">{(reservation.loanSimulation.loanAmount || 0).toLocaleString('fr-FR')} €</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-slate-500">Taux</div>
                                                            <div className="font-semibold">{reservation.loanSimulation.interestRate}%</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-slate-500">Durée</div>
                                                            <div className="font-semibold">{reservation.loanSimulation.duration} ans</div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 text-sm text-slate-700">
                                                        {(() => {
                                                            const calc = computeMonthlyPayment(reservation.loanSimulation);
                                                            if (!calc) return <div>Simulation incomplète</div>;
                                                            return (
                                                                <div className="grid grid-cols-3 gap-4">
                                                                    <div>
                                                                        <div className="text-xs text-slate-500">Mensualité</div>
                                                                        <div className="font-semibold">{calc.monthly.toFixed(2).toString().replace('.', ',')} €</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-slate-500">Coût total</div>
                                                                        <div className="font-semibold">{calc.total.toFixed(2).toString().replace('.', ',')} €</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-slate-500">Intérêts</div>
                                                                        <div className="font-semibold">{calc.totalInterest.toFixed(2).toString().replace('.', ',')} €</div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {reservations.length === 0 && (
                                        <div className="p-12 text-center">
                                            <Home className="mx-auto text-slate-400 mb-4" size={48} />
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune réservation</h3>
                                            <p className="text-slate-600">Découvrez nos biens disponibles</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {profile?.role === 'promoteur' && (
                        <>
                            <ProjectDashboard />

                            {/* Mes Biens (pour promoteur) */}
                            <div className="grid md:grid-cols-3 gap-6 my-8">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <Building2 className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Biens</div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">{biens.length}</div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <Home className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Disponibles</div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">{biens.filter(b => b.statut === 'disponible').length}</div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <DollarSign className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Valeur Totale</div>
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-600">
                                        {biens.reduce((sum, b) => sum + (b.prix || 0), 0).toLocaleString('fr-FR')} €
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                                <div className="p-6 border-b border-slate-200">
                                    <h2 className="text-xl font-bold text-slate-900">Mes Biens</h2>
                                </div>
                                <div className="divide-y divide-slate-200">
                                    {biens.map((b) => (
                                        <div key={b._id} className="p-6 hover:bg-slate-50 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{b.titre}</h3>
                                                <p className="text-slate-600 text-sm">{b.adresse}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-sm text-slate-600">Prix</div>
                                                    <div className="font-semibold text-slate-900">{(b.prix || 0).toLocaleString('fr-FR')} €</div>
                                                </div>
                                                <div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.statut === 'disponible' ? 'bg-emerald-100 text-emerald-800' : b.statut === 'réservé' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'}`}>
                                                        {b.statut}
                                                    </span>
                                                </div>
                                                <button onClick={() => setSelectedBien(b)} className="px-4 py-2 bg-emerald-600 text-white rounded">Voir</button>
                                            </div>
                                        </div>
                                    ))}
                                    {biens.length === 0 && (
                                        <div className="p-12 text-center">
                                            <Home className="mx-auto text-slate-400 mb-4" size={48} />
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun bien</h3>
                                            <p className="text-slate-600">Ajoutez des biens depuis la page Propriétés</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {selectedBien && (
                                <PropertyReservations
                                    propertyId={selectedBien._id}
                                    onClose={() => setSelectedBien(null)}
                                    onUpdated={() => loadDashboardData()}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
