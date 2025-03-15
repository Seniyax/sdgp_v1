/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import ViewFloorPlan from "./ViewFloorPlan";
import useReservationStore from "../store/reservationStore";
import useReservationsSocket from "../hooks/useReservationsSocket";

const ReservationDashboard = () => {
  // --- Reservations state and socket ---
  const {
    reservations,
    setReservations,
    addReservation,
    updateReservation,
    deleteReservation,
  } = useReservationStore();
  const [newReservation, setNewReservation] = useState({
    tableNumber: "",
    customerName: "",
  });

  // Initialize WebSocket connection for real-time reservation updates.
  useReservationsSocket();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.post("/api/reservation/get", {
          business_id: 20,
        });
        console.log("Reservations Updated:");
        setReservations(response.data.reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservations([]);
      }
    };
    fetchReservations();
  }, [setReservations]);

  const handleAddReservation = async () => {
    try {
      const response = await axios.post(
        "/api/reservation/create",
        newReservation
      );
      addReservation(response.data);
      setNewReservation({ tableNumber: "", customerName: "" });
    } catch (error) {
      console.error("Error adding reservation:", error);
    }
  };

  const handleUpdateReservation = async (id) => {
    const updatedName = prompt("Enter new customer name:");
    if (!updatedName) return;
    try {
      const response = await axios.put("/api/reservation/update", {
        id, // include id if necessary
        customerName: updatedName,
      });
      updateReservation(response.data);
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`/api/reservation/delete/${id}`);
      deleteReservation(id);
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  // --- Floor plan state and fetching ---
  const [floorPlan, setFloorPlan] = useState(null);
  const [floorError, setFloorError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with real auth logic if needed
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);

  useEffect(() => {
    // Simulate authentication check (replace with your actual auth logic)
    const userIsAuthenticated = true;
    setIsAuthenticated(userIsAuthenticated);
    if (!userIsAuthenticated) return;

    const fetchFloorPlan = async () => {
      try {
        const response = await axios.post(`api/floor-plan/get`, {
          business_id: 20,
        });
        if (response.data.success) {
          setFloorPlan({
            floors: response.data.floors,
            tables: response.data.tables,
          });
        } else {
          setFloorError("Failed to load floor plan.");
        }
      } catch (err) {
        setFloorError(err.response?.data?.message || err.message);
      }
    };

    fetchFloorPlan();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Reservation Dashboard</h1>

      {/* Reservations Section */}
      <section className="mb-5">
        <h2 className="mb-3">Manage Reservations</h2>
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Add Reservation</h3>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Table Number"
                  value={newReservation.tableNumber}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      tableNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Customer Name"
                  value={newReservation.customerName}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      customerName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleAddReservation}
                >
                  Add Reservation
                </button>
              </div>
            </div>
          </div>
        </div>

        <h3>Existing Reservations</h3>
        <ul className="list-group">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                Table {res.tableNumber} – {res.customerName}
              </span>
              <span>
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => handleUpdateReservation(res.id)}
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteReservation(res.id)}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Floor Plan Section */}
      <section>
        <h2 className="mb-3">Floor Map</h2>
        {!isAuthenticated && (
          <p className="text-muted">Please log in to view your floor plan.</p>
        )}
        {floorError && <div className="alert alert-danger">{floorError}</div>}
        {!floorPlan ? (
          <p>Loading floor plan...</p>
        ) : (
          <div>
            {/* Floor selector if multiple floors exist */}
            <div className="btn-group mb-3">
              {floorPlan.floors && floorPlan.floors.length > 0 ? (
                floorPlan.floors.map((floor, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFloorIndex(index)}
                    className={`btn ${
                      selectedFloorIndex === index
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {floor.floor_name}
                  </button>
                ))
              ) : (
                <p>No floors available.</p>
              )}
            </div>
            {floorPlan.floors && floorPlan.floors[selectedFloorIndex] && (
              <ViewFloorPlan
                canvasWidth={floorPlan.floors[selectedFloorIndex].canvas_width}
                canvasHeight={
                  floorPlan.floors[selectedFloorIndex].canvas_height
                }
                floor={floorPlan.floors[selectedFloorIndex]}
                tables={floorPlan.tables.filter(
                  (table) =>
                    table.floor_plan_id ===
                    floorPlan.floors[selectedFloorIndex].id
                )}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReservationDashboard;
