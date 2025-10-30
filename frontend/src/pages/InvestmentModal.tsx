import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import api from '../api/api';
import type { Projet } from '../types/projet';

interface InvestmentModalProps {
  project: Projet;
  onClose: () => void;
  onSuccess: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ project, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number>(project.min_investment ?? 100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // api instance injects the token; no client-side user checks required here

  const calculateReturn = () => {
    return (amount * (project.expected_return ?? 0)) / 100;
  };

  const calculateTotal = () => {
    return amount + calculateReturn();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const min = project.min_investment ?? 100;
    if (amount < min) {
      setError(`L'investissement minimum est de ${min.toLocaleString('fr-FR')} €`);
      return;
    }

    const remaining = (project.montantTotal ?? 0) - (project.montantCollecte ?? 0);
    if (amount > remaining) {
      setError('Le montant dépasse le financement restant');
      return;
    }

    setLoading(true);
    try {
      await api.post('/investissements', {
        projetId: project._id,
        montantInvesti: amount,
      });

      onSuccess();
    } catch (err: any) {
      console.error('Erreur investissement:', err);
      setError(err?.response?.data?.message || err?.message || 'Une erreur est survenue lors de l\'investissement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Investir dans le projet</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-2">{project.titre}</h3>
          <p className="text-sm text-slate-600">{project.localisation}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Montant de l'investissement</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={project.min_investment ?? 100}
                step={100}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-3 text-slate-600">€</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Minimum : {(project.min_investment ?? 100).toLocaleString('fr-FR')} €</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Investissement</span>
              <span className="font-semibold text-slate-900">{amount.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Rendement estimé ({project.expected_return ?? 0}%)</span>
              <span className="font-semibold text-emerald-600">+{calculateReturn().toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Durée</span>
              <span className="font-semibold text-slate-900">{project.duration_months ?? '—'} mois</span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total à recevoir</span>
                <span className="font-bold text-emerald-600 text-lg">{calculateTotal().toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex gap-2">
              <TrendingUp className="text-blue-600 flex-shrink-0" size={20} />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Information importante</p>
                <p>Tout investissement comporte des risques. Les rendements indiqués sont des estimations et ne sont pas garantis.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:bg-emerald-400">{loading ? 'En cours...' : 'Confirmer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;
