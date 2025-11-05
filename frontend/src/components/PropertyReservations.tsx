import React, { useEffect, useState } from 'react';
import api from '../api/api';

interface Props {
  propertyId: string;
  onClose: () => void;
  onUpdated?: () => void; // called when reservation status changes to refresh parent
}

const PropertyReservations: React.FC<Props> = ({ propertyId, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);


  const load = async () => {
    setLoading(true);
    try {
      // use dashboard endpoint to fetch bien details and its reservation 
      const res = await api.get(`/dashboard/promoteur/${propertyId}`);
      const data = res.data || {};
      const reservation = data.reservation ? [data.reservation] : [];
      setReservations(reservation);
      setError(null);
    } catch (err: any) {
      console.error('Impossible de charger les réservations:', err);
      setError(err?.response?.data?.message || err.message || 'Erreur chargement');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [propertyId]);

  const setStatus = async (reservationId: string, status: 'accepte' | 'rejete') => {
    if (!confirm(`Confirmer : mettre la réservation à "${status}" ?`)) return;
    try {
      await api.patch(`/reservations/${reservationId}/status`, { status });
      // update local list
      setReservations(prev => prev.map(r => r._id === reservationId ? { ...r, status } : r));
      if (onUpdated) onUpdated();
      alert('Statut mis à jour');
    } catch (err: any) {
      console.error('Erreur mise à jour statut:', err);
      alert(err?.response?.data?.message || err.message || 'Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Détails du bien et réservations</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1 border rounded">Fermer</button>
          </div>
        </div>

        <div className="p-4">
          {loading && <div>Chargement...</div>}
          {error && <div className="text-red-600">{error}</div>}

          {!loading && reservations.length === 0 && (
            <div className="p-6 text-center text-slate-600">Aucune réservation pour ce bien</div>
          )}

          {!loading && reservations.map((r) => (
            <div key={r._id} className="p-4 border rounded mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-slate-600">Demandeur</div>
                  <div className="font-semibold">{r.buyerId?.nom || r.buyerId?.prenom ? `${r.buyerId?.nom || ''} ${r.buyerId?.prenom || ''}`.trim() : (r.buyerId?.email || '—')}</div>
                  <div className="text-sm text-slate-600">{r.buyerId?.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Date</div>
                  <div className="font-semibold">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}</div>
                </div>
              </div>

              <div className="mt-3 grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Statut</div>
                  <div className="font-semibold">{r.status}</div>
                </div>
                <div className="text-right">
                  {r.status === 'en_attente' && (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setStatus(r._id, 'accepte')} className="px-3 py-1 bg-emerald-600 text-white rounded">Accepter</button>
                      <button onClick={() => setStatus(r._id, 'rejete')} className="px-3 py-1 bg-red-600 text-white rounded">Rejeter</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyReservations;
