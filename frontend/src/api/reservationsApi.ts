import api from './api';

export const cancelReservation = async (reservationId: string) => {
  if (!reservationId) throw new Error('cancelReservation: reservationId manquant');
  const res = await api.delete(`/reservations/${reservationId}`);
  return res.data;
};

export default { cancelReservation };