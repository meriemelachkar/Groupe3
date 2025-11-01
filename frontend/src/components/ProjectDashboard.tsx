import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    Building2,
    DollarSign,
    Target,
    Users,
} from 'lucide-react';
import {
    getDashboardProjectStats,
    type ProjectDashboardStats,
} from '../api/dashboardApi';
import { ProjectDetailsModal } from './ProjectDetailsModal';



export const ProjectDashboard: React.FC = () => {
    const [stats, setStats] = useState<ProjectDashboardStats | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const response = await getDashboardProjectStats();
            setStats(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center text-slate-600 py-12">
                Impossible de charger les statistiques
            </div>
        );
    }

    return (
        <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-100 p-2 rounded">
                            <Building2 className="text-emerald-600" size={24} />
                        </div>
                        <div className="text-sm text-slate-600">Total Projets</div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {stats?.totalProjets ?? 0}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-100 p-2 rounded">
                            <Target className="text-emerald-600" size={24} />
                        </div>
                        <div className="text-sm text-slate-600">Objectif Total</div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {(stats?.totalMontantCible ?? 0).toLocaleString('fr-FR')} €
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-100 p-2 rounded">
                            <DollarSign className="text-emerald-600" size={24} />
                        </div>
                        <div className="text-sm text-slate-600">Montant Collecté</div>
                    </div>
                    <div className="text-3xl font-bold text-emerald-600">
                        {(stats?.totalMontantCollecte ?? 0).toLocaleString('fr-FR')} €
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-100 p-2 rounded">
                            <Users className="text-emerald-600" size={24} />
                        </div>
                        <div className="text-sm text-slate-600">Total Investisseurs</div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {stats?.totalInvestisseurs ?? 0}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Mes Projets</h2>
                </div>
                <div className="divide-y divide-slate-200">
                    {(stats?.projetsDetails ?? []).map((project) => (
                        <div key={project._id} className="p-6 hover:bg-slate-50">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-lg">
                                        {project?.titre ?? 'Sans titre'}
                                    </h3>
                                    <p className="text-slate-600 mt-1">{project?.description}</p>
                                    <div className="flex items-center gap-6 mt-2">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="text-emerald-600" size={16} />
                                            <span className="text-slate-600">
                                                {(project?.montantCollecte ?? 0).toLocaleString('fr-FR')} € / {(project?.montantTotal ?? 0).toLocaleString('fr-FR')} €
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="text-slate-600" size={16} />
                                            <span className="text-slate-600">
                                                {project?.nombreInvestisseurs ?? 0} investisseurs
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(project._id)}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                                >
                                    Détails
                                </button>
                            </div>

                            <div className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Progression</span>
                                    <span className="font-semibold text-emerald-600">
                                        {(project?.progression ?? 0).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-emerald-600 h-2 rounded-full transition-all"
                                        style={{ width: `${project?.progression ?? 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(stats.projetsDetails?.length ?? 0) === 0 && (
                        <div className="p-12 text-center">
                            <BarChart3 className="mx-auto text-slate-400 mb-4" size={48} />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Aucun projet
                            </h3>
                            <p className="text-slate-600">
                                Commencez par créer votre premier projet
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedProject && (
                <ProjectDetailsModal
                    projetId={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </>
    );
};