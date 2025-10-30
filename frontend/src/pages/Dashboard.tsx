import React, { useEffect, useState } from 'react';
import { TrendingUp, Building2, Home, DollarSign, Target } from 'lucide-react';
import api from '../api/api';
import { cancelReservation } from '../api/reservationsApi';
import { useAuth } from '../context/AuthContext';
import NavBar from "../components/Navbar";

export const Dashboard: React.FC = () => {
    const { profile, user } = useAuth();
    const [investments, setInvestments] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
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
                    const res = await api.get('/projets');
                    const all = res.data || [];
                    // filter projects by promoteurId if present
                    const mine = all.filter((p: any) => String(p.promoteurId) === String(user?.userId));
                    setProjects(mine);
                }
            } catch (err) {
                console.warn('Impossible de charger les projets:', err);
                setProjects([]);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
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
        return investments.reduce((sum, inv) => sum + inv.amount, 0);
    };

    const calculateExpectedReturns = () => {
        return investments.reduce((sum, inv) => {
            if (inv.project) {
                return sum + (inv.amount * inv.project.expected_return) / 100;
            }
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
                                    <div className="text-3xl font-bold text-slate-900">{investments.length}</div>
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
                                                <tr key={investment.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-900">
                                                            {investment.project?.title || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-slate-600">
                                                            {investment.project?.location || ''}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                                        {investment.amount.toLocaleString('fr-FR')} €
                                                    </td>
                                                    <td className="px-6 py-4 text-emerald-600">
                                                        {investment.project?.expected_return || 0}%
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-emerald-600">
                                                        +{((investment.amount * (investment.project?.expected_return || 0)) / 100).toLocaleString('fr-FR')} €
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {new Date(investment.investment_date).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">
                                                            {investment.status}
                                                        </span>
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
                                            .reduce((sum, res) => sum + (res.propertyId?.prix || 0), 0)
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
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${reservation.status === 'accepted' || reservation.status === 'confirmed'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : reservation.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {reservation.status}
                                                </span>
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
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <Building2 className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Projets</div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">{projects.length}</div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <Target className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Objectif Total</div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        {projects
                                            .reduce((sum, p) => sum + p.target_amount, 0)
                                            .toLocaleString('fr-FR')}{' '}
                                        €
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-emerald-100 p-2 rounded">
                                            <DollarSign className="text-emerald-600" size={24} />
                                        </div>
                                        <div className="text-sm text-slate-600">Fonds Levés</div>
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-600">
                                        {projects
                                            .reduce((sum, p) => sum + p.raised_amount, 0)
                                            .toLocaleString('fr-FR')}{' '}
                                        €
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-slate-200">
                                    <h2 className="text-xl font-bold text-slate-900">Mes Projets</h2>
                                </div>
                                <div className="divide-y divide-slate-200">
                                    {projects.map((project) => {
                                        const progress = Math.min(
                                            (project.raised_amount / project.target_amount) * 100,
                                            100
                                        );
                                        return (
                                            <div key={project.id} className="p-6 hover:bg-slate-50">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 text-lg">{project.title}</h3>
                                                        <p className="text-slate-600">{project.location}</p>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'funding'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : 'bg-slate-100 text-slate-800'
                                                            }`}
                                                    >
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-slate-600">Progression</span>
                                                        <span className="font-semibold text-emerald-600">
                                                            {progress.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                                        <div
                                                            className="bg-emerald-600 h-2 rounded-full transition-all"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-4 gap-4">
                                                    <div>
                                                        <div className="text-sm text-slate-600">Objectif</div>
                                                        <div className="font-semibold text-slate-900">
                                                            {project.target_amount.toLocaleString('fr-FR')} €
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-slate-600">Collecté</div>
                                                        <div className="font-semibold text-emerald-600">
                                                            {project.raised_amount.toLocaleString('fr-FR')} €
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-slate-600">Rendement</div>
                                                        <div className="font-semibold text-slate-900">
                                                            {project.expected_return}%
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-slate-600">Durée</div>
                                                        <div className="font-semibold text-slate-900">
                                                            {project.duration_months} mois
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {projects.length === 0 && (
                                        <div className="p-12 text-center">
                                            <Building2 className="mx-auto text-slate-400 mb-4" size={48} />
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun projet</h3>
                                            <p className="text-slate-600">Créez votre premier projet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
