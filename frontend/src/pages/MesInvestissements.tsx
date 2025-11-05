import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import api from '../api/api';
import type { Investissement } from '../types/investissement';

interface InvestissementDetails extends Omit<Investissement, 'projetId'> {
  projetId: {
    _id: string;
    titre: string;
    typeProjet: string;
    statut: string;
  };
}

const MesInvestissements: React.FC = () => {
  const [investissements, setInvestissements] = useState<InvestissementDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvestissements = async () => {
      try {
        const { data } = await api.get('/investissements/me');
        setInvestissements(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Erreur lors du chargement des investissements');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestissements();
  }, []);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes Investissements</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {investissements.map((inv) => (
          <div key={inv._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1">{inv.projetId.titre}</h3>
              <span className="text-sm text-slate-500 capitalize">{inv.projetId.typeProjet}</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Montant investi</span>
                <span className="font-semibold">{inv.montantInvesti.toLocaleString('fr-FR')} €</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Rendement fixé</span>
                <span className="font-semibold text-emerald-600">{inv.rendementInvestissement}%</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Durée</span>
                <span className="font-semibold">{inv.dureeInvestissement} mois</span>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-600">Date d'investissement</span>
                  <span className="font-semibold">
                    {new Date(inv.dateInvestissement).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Date de fin prévue</span>
                  <span className="font-semibold">
                    {new Date(inv.dateFinPrevue).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Statut</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    inv.statut === 'termine' 
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {inv.statut === 'termine' ? 'Terminé' : 'En cours'}
                  </span>
                </div>
              </div>

              {inv.statut === 'termine' && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Rendement réel</span>
                    <span className="font-bold text-emerald-600">
                      {inv.rendementReel}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {investissements.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun investissement</h3>
          <p className="text-slate-500">Vous n'avez pas encore effectué d'investissement.</p>
        </div>
      )}
    </div>
  );
};

export default MesInvestissements;