import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, TrendingUp, Calendar, Target, DollarSign } from 'lucide-react';
import api from '../api/api';
import NavBar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import InvestmentModal from './InvestmentModal';

import type { Projet } from '../types/projet';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [project, setProject] = useState<Projet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvestModal, setShowInvestModal] = useState(false);

  useEffect(() => {
    if (id) loadProject(id);
  }, [id]);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/projets/${projectId}`);
      setProject(res.data || null);
    } catch (err) {
      console.error('Erreur chargement projet:', err);
      setProject(null);
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

  if (!project) {
    return (
      <>
        <NavBar />
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Projet introuvable</h3>
              <p className="text-slate-600">Le projet demandé est introuvable ou a été supprimé.</p>
              <div className="mt-4">
                <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-emerald-600 text-white rounded">Retour</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const montantTotal = project.montantTotal ?? (project as any).target_amount ?? 0;
  const montantCollecte = project.montantCollecte ?? (project as any).raised_amount ?? 0;
  const progress = Math.min((montantCollecte / (montantTotal || 1)) * 100, 100);

  return (
    <>
      <NavBar />
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
          >
            <ArrowLeft size={20} />
            Retour aux projets
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.titre} className="w-full h-full object-cover" />
              ) : (
                <Target className="text-white" size={96} />
              )}
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">{project.titre}</h1>
                  <div className="flex items-center text-slate-600">
                    <MapPin size={20} className="mr-2" />
                    <span className="text-lg">{project.localisation}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 mb-1">Type de projet</div>
                  <div className="text-lg font-semibold text-slate-900">{(project as any).typeProjet || '—'}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-emerald-600" />
                    <span className="text-sm text-slate-600">Objectif</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{montantTotal.toLocaleString('fr-FR')} €</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-emerald-600" />
                    <span className="text-sm text-slate-600">Collecté</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">{montantCollecte.toLocaleString('fr-FR')} €</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-emerald-600" />
                    <span className="text-sm text-slate-600">Rendement</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{(project.expected_return ?? (project as any).rendement) || '—'}%</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={20} className="text-emerald-600" />
                    <span className="text-sm text-slate-600">Durée</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{(project.duree ?? (project as any).duree) || '—'} mois</div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Progression du financement</span>
                  <span className="font-semibold text-emerald-600">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div className="bg-emerald-600 h-4 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-600">Investissement minimum : {(project.min_investment ?? (project as any).minInvestissement ?? 0).toLocaleString('fr-FR')} €</span>
                  <span className="text-slate-600">Restant : {(montantTotal - montantCollecte).toLocaleString('fr-FR')} €</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Description du projet</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{project.description}</p>
              </div>

              {project.start_date && project.end_date && (
                <div className="mb-8 bg-slate-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Calendrier</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Date de début</div>
                      <div className="font-semibold text-slate-900">{new Date(project.start_date).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Date de fin prévue</div>
                      <div className="font-semibold text-slate-900">{new Date(project.end_date).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                </div>
              )}

              {profile?.role === 'investisseur' && project.statut === 'en_cours' && (
                <button onClick={() => setShowInvestModal(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-medium text-lg transition">Investir dans ce projet</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInvestModal && (
        <InvestmentModal
          project={project}
          onClose={() => setShowInvestModal(false)}
          onSuccess={() => {
            setShowInvestModal(false);
            // reload project data to reflect new collecte
            if (project._id) loadProject(project._id);
          }}
        />
      )}
    </>
  );
};

export default ProjectDetailsPage;
