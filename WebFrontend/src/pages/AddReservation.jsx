/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

const AddReservation = ({
  onCancel,
  onClearSelection,
  selectedTables,
  onTableSelect,
  socket,
  defaultStartTime,
  defaultEndDate,
}) => {
  const [status, setStatus] = useState("idle");

  const initialGroupSize = selectedTables.reduce(
    (sum, table) => sum + (table.seatCount || 0),
    0
  );

  const [formData, setFormData] = useState({
    business_id: 20,
    customer_username: "",
    group_size: initialGroupSize,
    slot_type: "casual",
    start_time: defaultStartTime || "",
    end_date: defaultEndDate || new Date().toISOString().split("T")[0],
    customer_name: "",
    customer_number: "",
  });

  useEffect(() => {
    const computedGroupSize = selectedTables.reduce(
      (sum, table) => sum + (table.seatCount || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      group_size: computedGroupSize,
    }));
  }, [selectedTables]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      business_id: 20,
      customer_username: "",
      group_size: 0,
      slot_type: "casual",
      start_time: defaultStartTime || "",
      end_date: defaultEndDate || new Date().toISOString().split("T")[0],
      customer_name: "",
      customer_number: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!socket) {
      console.error("Socket connection is not available.");
      return;
    }
    setStatus("loading");
    try {
      for (const table of selectedTables) {
        const payload = {
          business_id: formData.business_id,
          table_number: table.tableNumber || "",
          customer_username: null,
          group_size: formData.group_size,
          slot_type: formData.slot_type,
          start_time: formData.start_time,
          end_date: formData.end_date,
          customer_name: formData.customer_name,
          customer_number: formData.customer_number,
          status: "Active",
        };

        await new Promise((resolve, reject) => {
          socket.emit("createReservation", payload, (response) => {
            if (response && response.success) {
              resolve(response.reservation);
            } else {
              reject(
                response?.message ||
                  `Failed to create reservation for table ${payload.table_number}`
              );
            }
          });
        });
      }
      console.log("Reservations created");
      setStatus("success");
      setTimeout(() => {
        resetForm();
        if (typeof onClearSelection === "function") {
          onClearSelection();
        }
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error creating reservations:", error);
      alert("Failed to create reservation: " + error);
      setStatus("idle");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card card-body mx-auto"
      style={{
        maxWidth: "600px",
        backgroundColor: "#2c2c2c",
        color: "#fff",
        position: "relative",
        minHeight: "400px",
      }}
    >
      <AnimatePresence exitBeforeEnter>
        {status === "idle" && (
          <motion.div
            key="formContent"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {selectedTables.length > 0 ? (
              <div className="mb-3">
                <label className="form-label">Selected Tables</label>
                <div className="d-flex flex-wrap gap-2">
                  {selectedTables.map((table, index) => {
                    const tableNum = table.tableNumber || "";
                    const seats = table.seatCount || "";
                    const floorName = table.floor;
                    return (
                      <div key={index} className="card p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            Table {tableNum} ({seats} seats, {floorName})
                          </span>
                          <button
                            type="button"
                            className="btn-close ms-2"
                            onClick={() => onTableSelect(table)}
                            aria-label="Remove table"
                          ></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                Please select tables from the floor plan that you want to
                reserve.
              </div>
            )}

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3 position-relative">
                  <label htmlFor="start_time" className="form-label">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="end_date" className="form-label">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Group Size</label>
                  <input
                    type="number"
                    className="form-control"
                    name="group_size"
                    value={formData.group_size}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="slot_type" className="form-label">
                    Type
                  </label>
                  <select
                    className="form-select"
                    id="slot_type"
                    name="slot_type"
                    value={formData.slot_type}
                    onChange={handleChange}
                  >
                    <option value="casual">Casual</option>
                    <option value="fine_dining">Fine Dining</option>
                    <option value="buffet">Buffet</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="customer_name" className="form-label">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="customer_number" className="form-label">
                    Customer Contact
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="customer_number"
                    name="customer_number"
                    value={formData.customer_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col d-flex justify-content-end">
                <button type="submit" className="btn btn-violet me-2">
                  Create
                </button>
                <button
                  type="button"
                  className="btn btn-violet-light"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {status === "loading" && (
          <motion.div
            key="loading"
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "300px" }}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div>Loading...</div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "300px", fontSize: "1.5rem" }}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Reservation Made
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default AddReservation;
