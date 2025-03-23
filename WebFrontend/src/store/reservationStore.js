import { create } from "zustand";

const normalizeReservation = (reservation) => ({
  ...reservation,
  table: reservation.table || {
    table_number: reservation.table_number || "N/A",
    floor_plan: { floor_name: "Unknown" },
  },
  customer: reservation.customer || {
    full_name: reservation.customer_name || "Unknown",
    username: reservation.customer_username || "Unknown",
  },
});

const useReservationStore = create((set) => ({
  reservations: [],
  setReservations: (reservations) =>
    set({ reservations: reservations.map(normalizeReservation) }),
  addReservation: (reservation) => {
    const normalizedReservation = normalizeReservation(reservation);
    set((state) => {
      const exists = state.reservations.some(
        (res) => res.id === normalizedReservation.id
      );
      if (exists) {
        return state;
      }
      return {
        reservations: [...state.reservations, normalizedReservation],
      };
    });
  },
  updateReservation: (updatedReservation) => {
    const normalizedReservation = normalizeReservation(updatedReservation);
    set((state) => ({
      reservations: state.reservations.map((res) =>
        res.id === normalizedReservation.id ? normalizedReservation : res
      ),
    }));
  },
  deleteReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((res) => res.id !== id),
    })),
}));

export default useReservationStore;
