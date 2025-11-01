import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { getProjectDetails, type ProjectDetails } from '../api/dashboardApi';

interface ProjectDetailsModalProps {
    projetId: string;
    onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
    projetId,
    onClose,
}) => {
    const [details, setDetails] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjectDetails();
    }, [projetId]);

    const loadProjectDetails = async () => {
        try {
            const response = await getProjectDetails(projetId);
            setDetails(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des détails du projet:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!details) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg w-full max-w-5xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 bg-white p-6 border-b border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {details.projet.titre}
                            </h2>
                            <p className="text-slate-600 mt-1">{details.projet.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-700 text-xl font-semibold"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-sm text-slate-600">Montant collecté</div>
                            <div className="text-lg font-semibold text-emerald-600">
                                {details.stats.montantCollecte.toLocaleString('fr-FR')} €
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-sm text-slate-600">Investisseurs</div>
                            <div className="text-lg font-semibold text-slate-900">
                                {details.stats.nombreInvestisseurs}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-sm text-slate-600">Moyenne/invest.</div>
                            <div className="text-lg font-semibold text-slate-900">
                                {details.stats.moyenneInvestissement.toLocaleString('fr-FR')} €
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-sm text-slate-600">Progression</div>
                            <div className="text-lg font-semibold text-emerald-600">
                                {details.stats.progression.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg mb-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div className="text-sm text-slate-600">Type de projet</div>
                                <div className="font-semibold text-slate-900">
                                    {details.projet.typeProjet}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-600">Localisation</div>
                                <div className="font-semibold text-slate-900">
                                    {details.projet.localisation}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-600">Durée</div>
                                <div className="font-semibold text-slate-900">
                                    {details.projet.duree} mois
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-600">Rendement</div>
                                <div className="font-semibold text-emerald-600">
                                    {details.projet.rendement}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Évolution des investissements
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={Object.entries(details.historique).map(([mois, data]) => ({
                                    mois,
                                    montant: data.montantTotal
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mois" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: any) =>
                                            `${Number(value).toLocaleString('fr-FR')} €`
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="montant"
                                        stroke="#059669"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Investissements
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-4 py-2 text-left text-sm text-slate-600">
                                            Investisseur
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm text-slate-600">
                                            Montant
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm text-slate-600">
                                            Date
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm text-slate-600">
                                            Rendement
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm text-slate-600">
                                            Statut
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {details.investissements.map((inv) => (
                                        <tr key={inv._id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900">
                                                    {inv.investisseurId.prenom} {inv.investisseurId.nom}
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    {inv.investisseurId.email}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                {inv.montantInvesti.toLocaleString('fr-FR')} €
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {new Date(inv.dateInvestissement).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-4 py-3 text-emerald-600 font-medium">
                                                {inv.rendementInvestissement}%
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                    inv.statut === 'en_cours' 
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                    {inv.statut === 'en_cours' ? 'En cours' : 'Terminé'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};