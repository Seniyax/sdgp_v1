import { useEffect, useState } from "react";
import io from "socket.io-client";
import useReservationStore from "../store/reservationStore";

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const useReservationsSocket = (businessId) => {
  const {
    setReservations,
    addReservation,
    updateReservation,
    deleteReservation,
  } = useReservationStore();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to reservations socket");
      newSocket.emit("getReservations", { business_id: businessId });
    });

    newSocket.onAny((event, ...args) => {
      console.log(`Socket event received: ${event}`, args);
    });

    newSocket.on("reservationsData", (data) => {
      if (data.success) {
        setReservations(data.reservations);
      }
    });

    newSocket.on("reservationAdded", (reservation) => {
      console.log("Socket reservationAdded:", reservation);
      addReservation(reservation);
    });

    newSocket.on("reservationUpdated", (reservation) => {
      console.log("Socket reservationUpdated:", reservation);
      updateReservation(reservation);
    });

    newSocket.on("reservationDeleted", (reservationId) => {
      deleteReservation(reservationId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [
    businessId,
    setReservations,
    addReservation,
    updateReservation,
    deleteReservation,
  ]);

  return socket;
};

export default useReservationsSocket;
