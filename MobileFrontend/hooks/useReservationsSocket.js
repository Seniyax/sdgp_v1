import { useEffect, useState } from "react";
import io from "socket.io-client";
import useReservationStore from "../store/reservationStore";
import { useAuth } from "../contexts/AuthContext";

const SOCKET_SERVER_URL = process.env.API_BASE_URL;

const useReservationsSocket = () => {
  const [socket, setSocket] = useState(null);
  const {
    setReservations,
    addReservation,
    updateReservation,
    deleteReservation,
  } = useReservationStore();
  const { business } = useAuth();

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      console.log("Connected to reservations socket");
      newSocket.emit("getReservations", { business_id: business.id });
    });

    newSocket.on("reservationsData", (data) => {
      if (data.reservations) {
        setReservations(data.reservations);
      }
    });

    newSocket.on("reservationAdded", (reservation) => {
      addReservation(reservation);
    });

    newSocket.on("reservationUpdated", (reservation) => {
      updateReservation(reservation);
    });

    newSocket.on("reservationDeleted", (reservationId) => {
      deleteReservation(reservationId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [setReservations, addReservation, updateReservation, deleteReservation]);

  return socket;
};

export default useReservationsSocket;
