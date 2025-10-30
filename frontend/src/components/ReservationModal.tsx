import React, { useState } from 'react';
import { X, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createReservation } from '../api/propertiesApi';
import LoanSimulator from './LoanSimulator';

interface ReservationModalProps {
  // Accept a Bien-like object from either pages or API shapes
  property: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ property, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loanSimulation, setLoanSimulation] = useState({
    loanAmount: (property.prix || 0) * 0.8,
    interestRate: 3.5,
    duration: 20,
  });
  const { profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profile || profile.role !== 'acheteur') {
      setError("Seuls les acheteurs peuvent réserver un bien.");
      return;
    }

    setLoading(true);
    try {
      // Call reservations endpoint which will create reservation and set bien statut to 'réservé'
      await createReservation(property._id, loanSimulation);
      onSuccess();
    } catch (err: any) {
      console.error('Erreur réservation:', err);
      setError(err?.response?.data || err?.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Réserver le bien</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-2">{property.titre}</h3>
          <p className="text-sm text-slate-600">{property.adresse}</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {property.prix.toLocaleString('fr-FR')} €
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Simulation de prêt (optionnel)</h3>
            <LoanSimulator
              propertyPrice={property.prix}
              onChange={(s: { loanAmount: number; interestRate: number; duration: number }) => setLoanSimulation(s)}
              initialState={loanSimulation}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex gap-2">
              <Home className="text-blue-600 flex-shrink-0" size={20} />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Confirmation de réservation</p>
                <p>
                  Votre réservation sera soumise au promoteur pour validation. Vous serez contacté
                  dans les plus brefs délais pour finaliser votre acquisition.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:bg-emerald-400"
            >
              {loading ? 'En cours...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
