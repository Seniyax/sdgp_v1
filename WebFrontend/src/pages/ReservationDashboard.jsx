/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import FloorPlanLayout from "./FloorPlanLayout";
import ViewFloorPlan from "./ViewFloorPlan";
import useReservationStore from "../store/reservationStore";
import useReservationsSocket from "../hooks/useReservationsSocket";
import AddReservation from "./AddReservation";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY || "fallback-secret-key";

const ReservationDashboard = () => {
  const { businessId: rawEncryptedBusinessId } = useParams();
  const encryptedBusinessId = decodeURIComponent(rawEncryptedBusinessId);

  let decryptedBusinessId = encryptedBusinessId;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedBusinessId, secretKey);
    decryptedBusinessId = bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting businessId:", error);
  }

  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [isBusinessLoaded, setIsBusinessLoaded] = useState(false);
  const [isFloorPlanLoading, setIsFloorPlanLoading] = useState(true);

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.post("/api/business/get-by-id", {
        business_id: decryptedBusinessId,
      });
      if (response.data.success && response.data.data) {
        const fetchedBusiness = response.data.data.business;
        sessionStorage.setItem("business", JSON.stringify(fetchedBusiness));
        setBusiness(fetchedBusiness);
      } else {
        console.error("Failed to fetch business:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching business:", error);
    } finally {
      setIsBusinessLoaded(true);
    }
  }, [decryptedBusinessId]);

  useEffect(() => {
    if (decryptedBusinessId) {
      fetchBusiness();
    }
  }, [decryptedBusinessId, fetchBusiness]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (isBusinessLoaded && (!user || !rawEncryptedBusinessId)) {
      navigate("/");
    }
  }, [navigate, isBusinessLoaded, rawEncryptedBusinessId]);

  const {
    reservations,
    setReservations,
    updateReservation,
    deleteReservation,
  } = useReservationStore();

  const [floorPlan, setFloorPlan] = useState(null);
  const [floorError, setFloorError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);

  useEffect(() => {
    const fetchFloorPlan = async () => {
      try {
        const response = await axios.post("/api/floor-plan/get", {
          business_id: decryptedBusinessId,
        });
        console.log(response.data.message);
        if (
          !response.data.success &&
          response.data.message === "Floor plan not found"
        ) {
          setFloorError("Floor plan not found.");
          navigate("/manage-business");
          return;
        } else if (!response.data.success) {
          setFloorError("Failed to load floor plan.");
          navigate("/manage-business");
          return;
        } else {
          setFloorPlan({
            floors: response.data.floors,
            tables: response.data.tables,
          });
        }
      } catch (err) {
        if (err.response?.data?.message === "Floor plan not found") {
          setFloorError("Floor plan not found.");
          navigate("/manage-business");
          return;
        }
        setFloorError(err.response?.data?.message || err.message);
      } finally {
        setIsFloorPlanLoading(false);
      }
    };

    fetchFloorPlan();
  }, [decryptedBusinessId, navigate]);

  const [addingReservation, setAddingReservation] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const addFormRef = useRef(null);
  const [timeMode, setTimeMode] = useState("auto");

  const allowedStartHour = business?.opening_hour ?? 0;
  const allowedEndHour = business?.closing_hour ?? 24;

  const computeDefaultDate = () => {
    const now = new Date();
    const defaultDate = new Date(now);
    defaultDate.setHours(now.getHours() + 1);
    if (
      defaultDate.getHours() < allowedStartHour ||
      defaultDate.getHours() >= allowedEndHour
    ) {
      defaultDate.setDate(defaultDate.getDate() + 1);
      defaultDate.setHours(12, 0, 0, 0);
    }
    return defaultDate;
  };
  const [selectedDate, setSelectedDate] = useState(computeDefaultDate());

  useEffect(() => {
    let interval;
    if (timeMode === "auto") {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10);
      setSelectedDate(now);
      interval = setInterval(() => {
        const newDate = new Date();
        newDate.setMinutes(newDate.getMinutes() + 10);
        setSelectedDate(newDate);
      }, 10 * 60 * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeMode]);

  const handleDateChange = (e) => {
    if (timeMode !== "manual") return;
    const newDateStr = e.target.value;
    const newDate = new Date(selectedDate);
    const [year, month, day] = newDateStr.split("-").map(Number);
    newDate.setFullYear(year, month - 1, day);
    console.log("Date changed:", newDate);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (e) => {
    if (timeMode !== "manual") return;
    const newTimeStr = e.target.value;
    const [hour, minute] = newTimeStr.split(":").map(Number);
    if (hour < allowedStartHour || hour >= allowedEndHour) {
      alert(
        `Please choose a time between ${allowedStartHour}:00 and ${allowedEndHour}:00.`
      );
      return;
    }
    const newDate = new Date(selectedDate);
    newDate.setHours(hour, minute, 0, 0);
    console.log("Time changed:", newDate);
    setSelectedDate(newDate);
  };

  const toggleTimeMode = () => {
    setTimeMode((prev) => (prev === "manual" ? "auto" : "manual"));
  };

  const scrollToForm = () => {
    if (addFormRef.current) {
      addFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShowAddForm = () => {
    setAddingReservation(true);
    setSelectedTables([]);
    setTimeout(scrollToForm, 300);
  };

  const handleCancelAddReservation = () => {
    setAddingReservation(false);
    setSelectedTables([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTableSelect = (table) => {
    if (
      reservedTableNumbers &&
      reservedTableNumbers.includes(table.tableNumber)
    ) {
      return;
    }
    const exists = selectedTables.find(
      (t) => t.id === table.id || t.tableNumber === table.tableNumber
    );
    if (exists) {
      setSelectedTables((prev) => prev.filter((t) => t.id !== table.id));
    } else {
      setSelectedTables((prev) => [...prev, table]);
    }
  };

  const parseLocalDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  };

  const activeReservations = reservations.filter(
    (res) => res.status === "Active"
  );

  const selectedPeriodEnd = new Date(selectedDate.getTime() + 10 * 60 * 1000);
  const selectedPeriodStart = new Date(selectedDate.getTime() - 10 * 60 * 1000);

  const filteredReservations = activeReservations.filter((res) => {
    if (res.end_date !== selectedDate.toISOString().split("T")[0]) return false;

    const reservationStart = parseLocalDateTime(res.end_date, res.start_time);
    let reservationEnd = parseLocalDateTime(res.end_date, res.end_time);

    if (reservationEnd < reservationStart) {
      reservationEnd.setDate(reservationEnd.getDate() + 1);
    }

    return (
      reservationStart < selectedPeriodEnd &&
      reservationEnd > selectedPeriodStart
    );
  });

  const reservedTableNumbers = Array.from(
    new Set(
      filteredReservations
        .sort((a, b) => {
          const aStart = parseLocalDateTime(a.end_date, a.start_time);
          const bStart = parseLocalDateTime(b.end_date, b.start_time);
          return aStart - bStart;
        })
        .map((res) => res.table.table_number)
    )
  );

  const socket = useReservationsSocket(decryptedBusinessId);

  const handleCancel = (id) => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }
    socket.emit("deleteReservation", { reservation_id: id }, (response) => {
      if (response.success) {
        deleteReservation(id);
        console.log("Reservation cancelled via socket:", response.message);
      } else {
        console.error(
          "Failed to cancel reservation via socket:",
          response.message
        );
      }
    });
  };

  const handleDone = (id) => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }
    socket.emit(
      "updateReservation",
      {
        reservation_id: id,
        update_data: { status: "Completed" },
      },
      (response) => {
        if (response.success) {
          updateReservation(response.reservation);
          console.log("Reservation updated via socket:", response.message);
        } else {
          console.error(
            "Failed to update reservation via socket:",
            response.message
          );
        }
      }
    );
  };

  const canvasWidth =
    floorPlan && floorPlan.floors && floorPlan.floors[selectedFloorIndex]
      ? floorPlan.floors[selectedFloorIndex].canvas_width || 800
      : 800;
  const canvasHeight =
    floorPlan && floorPlan.floors && floorPlan.floors[selectedFloorIndex]
      ? floorPlan.floors[selectedFloorIndex].canvas_height || 600
      : 600;

  useEffect(() => {
    if (!business) return;
    const fetchReservations = async () => {
      try {
        const response = await axios.post("/api/reservation/get", {
          business_id: business.id,
        });
        console.log("Fetched reservations:", response.data.reservations);
        setReservations(response.data.reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservations([]);
      }
    };
    fetchReservations();
  }, [setReservations, business]);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <FloorPlanLayout>
      <div className="container py-4">
        <div style={{ width: canvasWidth, margin: "0 auto" }}>
          <motion.h1
            className="mb-4"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ color: "white" }}
          >
            Reservation Dashboard
          </motion.h1>
          <motion.h2
            className="mb-3"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ color: "white" }}
          >
            Floor Map
          </motion.h2>

          <motion.div
            className="row mb-3"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="col">
              <label
                htmlFor="date-input"
                className="form-label"
                style={{ color: "white" }}
              >
                Date:
              </label>
              <input
                id="date-input"
                type="date"
                className="form-control"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                disabled={timeMode === "auto"}
                style={{
                  background: timeMode === "auto" ? "transparent" : "white",
                  color: timeMode === "auto" ? "white" : "black",
                  height: "50px",
                  border: "2px solid grey",
                  borderRadius: 0,
                }}
              />
            </div>
            <div className="col">
              <label
                htmlFor="time-input"
                className="form-label"
                style={{ color: "white" }}
              >
                Time:
              </label>
              <input
                id="time-input"
                type="time"
                className="form-control"
                value={selectedDate.toTimeString().slice(0, 5)}
                onChange={handleTimeChange}
                disabled={timeMode === "auto"}
                style={{
                  background: timeMode === "auto" ? "transparent" : "white",
                  color: timeMode === "auto" ? "white" : "black",
                  height: "50px",
                  border: "2px solid grey",
                  borderRadius: 0,
                }}
              />
            </div>
            <div className="col d-flex align-items-end">
              <button className="btn btn-violet-light" onClick={toggleTimeMode}>
                {timeMode === "manual" ? "Switch to Auto" : "Switch to Manual"}
              </button>
            </div>
          </motion.div>

          <motion.div
            className="row mb-3"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="col">
              {floorPlan && floorPlan.floors && floorPlan.floors.length > 0 ? (
                <div className="btn-group">
                  {floorPlan.floors.map((floor, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFloorIndex(index)}
                      className={`btn ${
                        selectedFloorIndex === index
                          ? "btn-violet"
                          : "btn-outline-secondary"
                      }`}
                    >
                      {floor.floor_name}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No floors available.</p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="row">
          <div className="col-12">
            {!isAuthenticated && (
              <motion.p
                className="text-muted"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                Please log in to view your floor plan.
              </motion.p>
            )}
            {floorError && (
              <motion.div
                className="alert alert-danger"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {floorError}
              </motion.div>
            )}
            {isFloorPlanLoading ? (
              <motion.p
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                Loading floor plan...
              </motion.p>
            ) : floorPlan ? (
              <div
                style={{
                  position: "relative",
                  width: canvasWidth,
                  height: canvasHeight,
                  margin: "0 auto",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFloorIndex}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {floorPlan.floors &&
                      floorPlan.floors[selectedFloorIndex] &&
                      (() => {
                        const selectedFloor =
                          floorPlan.floors[selectedFloorIndex];
                        return (
                          <ViewFloorPlan
                            canvasWidth={canvasWidth}
                            canvasHeight={canvasHeight}
                            floor={selectedFloor}
                            tables={floorPlan.tables.filter(
                              (table) =>
                                table.floor_plan_id === selectedFloor.id
                            )}
                            reservations={reservations}
                            selectedDate={selectedDate}
                            addingReservation={addingReservation}
                            onTableSelect={handleTableSelect}
                            selectedTables={selectedTables}
                            reservedTables={reservedTableNumbers}
                          />
                        );
                      })()}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <motion.p
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                No floor plan available.
              </motion.p>
            )}
          </div>

          <div className="col-12">
            <div className="row mt-4">
              <div className="col-5 offset-2">
                <AnimatePresence>
                  {!addingReservation && (
                    <motion.div
                      key="add-reservation-btn"
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="col-6 offset-6 mb-3"
                    >
                      <button
                        className="btn btn-violet w-100"
                        onClick={handleShowAddForm}
                      >
                        Add Reservation
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="col-8 mt-4">
                <AnimatePresence>
                  {addingReservation && (
                    <motion.div
                      key="add-reservation-form"
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      ref={addFormRef}
                    >
                      <AddReservation
                        onCancel={handleCancelAddReservation}
                        selectedTables={selectedTables}
                        onTableSelect={handleTableSelect}
                        socket={socket}
                        defaultStartTime={selectedDate
                          .toTimeString()
                          .slice(0, 8)}
                        defaultEndDate={
                          selectedDate.toISOString().split("T")[0]
                        }
                        onClearSelection={() => setSelectedTables([])}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="col-4 mt-4">
                <AnimatePresence>
                  <motion.section
                    key="reservation-list"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                      <ul className="list-group">
                        {filteredReservations.map((res) => {
                          const tableNumber = res.table.table_number;
                          const customerName = res.customer.full_name;
                          const floor = res.table.floor_plan.floor_name;
                          return (
                            <li
                              key={res.id}
                              className="list-group-item d-flex justify-content-between align-items-center mt-1"
                            >
                              <div className="row">
                                <div className="col-12">
                                  Table {tableNumber} | {floor}
                                </div>
                                <div className="col-12">{customerName}</div>
                              </div>
                              <div className="d-flex align-items-center">
                                <button
                                  className="btn btn-violet-light btn-sm me-1"
                                  onClick={() => handleCancel(res.id)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn btn-violet-light btn-sm"
                                  onClick={() => handleDone(res.id)}
                                >
                                  Done
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.section>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FloorPlanLayout>
  );
};

export default ReservationDashboard;
