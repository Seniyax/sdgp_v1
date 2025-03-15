import { useEffect } from 'react';
import io from 'socket.io-client';
import useReservationStore from '../store/reservationStore';

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const useReservationsSocket = () => {
  const { addReservation, updateReservation, deleteReservation } = useReservationStore();

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('Connected to reservations socket');
    });

    socket.on('reservationAdded', (reservation) => {
      addReservation(reservation);
    });

    socket.on('reservationUpdated', (reservation) => {
      updateReservation(reservation);
    });

    socket.on('reservationDeleted', (reservationId) => {
      deleteReservation(reservationId);
    });

    return () => {
      socket.disconnect();
    };
  }, [addReservation, updateReservation, deleteReservation]);
};

export default useReservationsSocket;
