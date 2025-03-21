import { create } from "zustand";

const useReservationStore = create((set) => ({
  reservations: [],
  setReservations: (reservations) => set({ reservations }),
  addReservation: (reservation) =>
    set((state) => ({ reservations: [...state.reservations, reservation] })),
  updateReservation: (updatedReservation) =>
    set((state) => ({
      reservations: state.reservations.map((res) =>
        res.id === updatedReservation.id ? updatedReservation : res
      ),
    })),
  deleteReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((res) => res.id !== id),
    })),
}));

export default useReservationStore;
