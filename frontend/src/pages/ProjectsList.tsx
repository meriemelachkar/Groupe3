import React, { useEffect, useState } from 'react';
import { MapPin, TrendingUp, Calendar, Building2 } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Projet } from '../types/projet';
import NavBar from '../components/Navbar';

interface ProjectsListProps {
    onSelectProject?: (project: Projet) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ onSelectProject }) => {
    const [projects, setProjects] = useState<Projet[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        titre: '',
        localisation: '',
        typeProjet: '',
        statut: '',
        minMontant: '',
        maxMontant: '',
    });
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newProject, setNewProject] = useState<Partial<Projet>>({
        titre: '',
        description: '',
        typeProjet: 'construction',
        montantTotal: 0,
        localisation: '',
        rendement: 0,
        duree: 12,
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await api.get('/projets');
            // backend returns an array of Projet objects
            setProjects(res.data || []);
        } catch (error) {
              console.error('Erreur lors du chargement des projets :', error);
        } finally {
            setLoading(false);
        }
    };

    const getProgressPercentage = (project: Projet) => {
        // Utilise la même logique de fallback que dans l'affichage
        const raised = Number(project.montantCollecte ?? project.raised_amount ?? project.raised ?? 0);
        const target = Number(project.montantTotal ?? project.target_amount ?? project.target ?? 1);
        return Math.min((raised / target) * 100, 100);
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { label: string; class: string }> = {
            en_cours: { label: 'En financement', class: 'bg-emerald-100 text-emerald-800' },
            financé: { label: 'Financé', class: 'bg-slate-100 text-slate-800' },
            terminé: { label: 'Terminé', class: 'bg-slate-200 text-slate-800' },
        };
        // support older English states if present
        if (status === 'approved') return { label: 'Approuvé', class: 'bg-blue-100 text-blue-800' };
        if (status === 'funding') return badges.en_cours;
        if (status === 'funded') return badges.financé;
        return badges[status] || badges.en_cours;
    };

    // Filtrage côté client basé sur les critères sélectionnés
    const filteredProjects = projects.filter((project) => {
        // titre
        if (filters.titre && !(project.titre || '').toLowerCase().includes(filters.titre.toLowerCase())) return false;
        // localisation
        if (filters.localisation && !(project.localisation || '').toLowerCase().includes(filters.localisation.toLowerCase())) return false;
        // type de projet
        if (filters.typeProjet && (project.typeProjet || '') !== filters.typeProjet) return false;
        // statut
        if (filters.statut) {
            const s = (project.statut || (project as any).status || '').toString();
            if (s !== filters.statut) return false;
        }
        // montant min
        if (filters.minMontant && Number(project.montantTotal || 0) < Number(filters.minMontant)) return false;
        // montant max
        if (filters.maxMontant && Number(project.montantTotal || 0) > Number(filters.maxMontant)) return false;
        return true;
    });

    const resetFilters = () => setFilters({ titre: '', localisation: '', typeProjet: '', statut: '', minMontant: '', maxMontant: '' });

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
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Projets de Crowdfunding</h1>
                            <p className="text-slate-600 mt-2">
                                Investissez dans des projets immobiliers vérifiés et suivez vos rendements
                            </p>
                        </div>
                        {profile?.role === 'promoteur' && (
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowCreateModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition">
                                    Créer un Projet
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Filtres pour les projets */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtres</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                                <input value={filters.titre} onChange={(e) => setFilters({ ...filters, titre: e.target.value })} placeholder="Rechercher par titre..." className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Localisation</label>
                                <input value={filters.localisation} onChange={(e) => setFilters({ ...filters, localisation: e.target.value })} placeholder="Ville ou quartier..." className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                <select value={filters.typeProjet} onChange={(e) => setFilters({ ...filters, typeProjet: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                    <option value="">Tous</option>
                                    <option value="construction">Construction</option>
                                    <option value="rénovation">Rénovation</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                                <select value={filters.statut} onChange={(e) => setFilters({ ...filters, statut: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                    <option value="">Tous</option>
                                    <option value="en_cours">En financement</option>
                                    <option value="financé">Financé</option>
                                    <option value="terminé">Terminé</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Montant min (€)</label>
                                <input type="number" value={filters.minMontant} onChange={(e) => setFilters({ ...filters, minMontant: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Montant max (€)</label>
                                <input type="number" value={filters.maxMontant} onChange={(e) => setFilters({ ...filters, maxMontant: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3 justify-end">
                            <button onClick={resetFilters} className="px-4 py-2 border rounded">Réinitialiser</button>
                            <div className="text-sm text-slate-600">{filteredProjects.length} projet(s) correspondant(s)</div>
                        </div>
                    </div>

                    {projects.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <Building2 className="mx-auto text-slate-400 mb-4" size={48} />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun projet disponible</h3>
                            <p className="text-slate-600">Les nouveaux projets apparaîtront ici</p>
                        </div>
                    ) : (
                        filteredProjects.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-12 text-center">
                                <Building2 className="mx-auto text-slate-400 mb-4" size={48} />
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun projet trouvé</h3>
                                <p className="text-slate-600">Essayez d'élargir vos critères de filtrage</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProjects.map((project) => {
                                const progress = getProgressPercentage(project);
                                const statusBadge = getStatusBadge(project.statut || (project as any).status || 'en_cours');

                                return (
                                    <div
                                        key={project._id || (project as any).id}
                                        onClick={() => {
                                            if (onSelectProject) return onSelectProject(project);
                                            const pid = project._id || (project as any).id;
                                            if (pid) navigate(`/projects/${pid}`);
                                        }}
                                        className="bg-white rounded-lg shadow hover:shadow-xl transition cursor-pointer overflow-hidden"
                                    >
                                        <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                            {project.images && project.images.length > 0 ? (
                                                <img src={project.images[0]} alt={project.titre} className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="text-white" size={64} />
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-xl font-bold text-slate-900 flex-1">{project.titre}</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.class}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </div>

                                            <div className="flex items-center text-slate-600 mb-4">
                                                <MapPin size={16} className="mr-1" />
                                                <span className="text-sm">{project.localisation || (project as any).location}</span>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Objectif</span>
                                                    <span className="font-semibold text-slate-900">
                                                        {(project.montantTotal || (project as any).target_amount || 0).toLocaleString('fr-FR')} €
                                                    </span>
                                                </div>
                                                <div>
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
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp size={16} className="text-emerald-600" />
                                                    <div>
                                                        <div className="text-xs text-slate-600">Rendement</div>
                                                        <div className="font-semibold text-slate-900">{((project.expected_return ?? (project as any).rendement) || '—')}%</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-emerald-600" />
                                                    <div>
                                                        <div className="text-xs text-slate-600">Durée</div>
                                                        <div className="font-semibold text-slate-900">{(project.duree ?? (project as any).duree ?? '—')} mois</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition">
                                                Voir le projet
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    {/* Create project modal (promoteur) */}
                    {showCreateModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                            <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Créer un nouveau projet</h3>
                                    <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Titre</label>
                                        <input value={newProject.titre || ''} onChange={(e) => setNewProject({ ...newProject, titre: e.target.value })} className="w-full border px-3 py-2 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Type de projet</label>
                                        <select value={newProject.typeProjet} onChange={(e) => setNewProject({ ...newProject, typeProjet: e.target.value as any })} className="w-full border px-3 py-2 rounded">
                                            <option value="construction">Construction</option>
                                            <option value="rénovation">Rénovation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Montant total (€)</label>
                                        <input type="number" value={newProject.montantTotal ?? 0} onChange={(e) => setNewProject({ ...newProject, montantTotal: Number(e.target.value) })} className="w-full border px-3 py-2 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Localisation</label>
                                        <input value={newProject.localisation || ''} onChange={(e) => setNewProject({ ...newProject, localisation: e.target.value })} className="w-full border px-3 py-2 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Rendement attendu (%)</label>
                                        <input type="number" min="0" max="100" value={newProject.rendement ?? 0} onChange={(e) => setNewProject({ ...newProject, rendement: Number(e.target.value) })} className="w-full border px-3 py-2 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Durée (mois)</label>
                                        <input type="number" min="1" value={newProject.duree ?? 12} onChange={(e) => setNewProject({ ...newProject, duree: Number(e.target.value) })} className="w-full border px-3 py-2 rounded" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-slate-600 mb-1">Description</label>
                                        <textarea value={newProject.description || ''} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full border px-3 py-2 rounded h-28" />
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded">Annuler</button>
                                    <button disabled={creating} onClick={async () => {
                                        // minimal client validation respecting backend CreateProjetDto
                                        if (!newProject.titre || !newProject.typeProjet || !newProject.montantTotal || !newProject.localisation || newProject.rendement === undefined || !newProject.duree) {
                                            alert('Veuillez remplir tous les champs obligatoires (titre, type, montant, localisation, rendement, durée)');
                                            return;
                                        }
                                        if (newProject.rendement < 0 || newProject.rendement > 100) {
                                            alert('Le rendement doit être compris entre 0 et 100%');
                                            return;
                                        }
                                        if (newProject.duree < 1) {
                                            alert('La durée doit être d\'au moins 1 mois');
                                            return;
                                        }
                                        try {
                                            setCreating(true);
                                            // Convert numeric fields explicitly to ensure they are numbers
                                            const payload = {
                                                titre: String(newProject.titre || '').trim(),
                                                description: String(newProject.description || '').trim(),
                                                typeProjet: newProject.typeProjet,
                                                montantTotal: Number(newProject.montantTotal || 0),
                                                localisation: String(newProject.localisation || '').trim(),
                                                rendement: Number(newProject.rendement || 0),
                                                duree: Number(newProject.duree || 12),
                                            };
                                            await api.post('/projets', payload);
                                            setShowCreateModal(false);
                                            // reset and reload
                                            setNewProject({ titre: '', description: '', typeProjet: 'construction', montantTotal: 0, localisation: '' });
                                            loadProjects();
                                        } catch (err: any) {
                                            console.error('Erreur création projet:', err);
                                            alert(err?.response?.data?.message || err?.message || 'Erreur lors de la création');
                                        } finally {
                                            setCreating(false);
                                        }
                                    }} className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-60">{creating ? 'Création...' : 'Créer le projet'}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
