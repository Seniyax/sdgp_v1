// reservationSocket.js
const axios = require("axios");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Retrieve reservations for a business
    socket.on("getReservations", async (data) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/reservation/get",
          { business_id: data.business_id }
        );
        if (response.data.success) {
          socket.emit("reservationsData", response.data);
        } else {
          socket.emit("reservationsError", {
            message: "Failed to load reservations.",
          });
        }
      } catch (err) {
        console.error("Error fetching reservations:", err);
        socket.emit("reservationsError", { message: err.message });
      }
    });

    // Update an existing reservation (using PUT)
    socket.on("updateReservation", async (data, callback) => {
      try {
        const response = await axios.put(
          "http://localhost:3000/api/reservation/update",
          {
            reservation_id: data.reservation_id,
            update_data: data.update_data,
            customer_username: data.customer_username, // include username if provided
          }
        );
        if (response.data.success) {
          callback({
            success: true,
            updatedReservation: response.data.reservation,
          });

          // Broadcast the updated reservation to all clients
          io.emit("reservationUpdated", response.data.reservation);
        } else {
          callback({ success: false, message: "Failed to update reservation" });
        }
      } catch (err) {
        console.error("Error updating reservation:", err);
        callback({ success: false, message: err.message });
      }
    });

    // Create a new reservation
    socket.on("createReservation", async (data, callback) => {
      try {
        // Clean and convert the start_time from 12-hour to 24-hour format.
        const cleanedTime = data.start_time
          .replace(/[\u202F\u00A0]/g, " ")
          .trim()
          .toUpperCase();
        const parsedTime = dayjs(cleanedTime, ["h:mm A", "hh:mm A"]);
        const formattedTime = parsedTime.isValid()
          ? parsedTime.format("HH:mm:ss")
          : data.start_time;

        // Parse and format the date to "YYYY-MM-DD".
        const parsedDate = dayjs(data.end_date);
        const formattedDate = parsedDate.isValid()
          ? parsedDate.format("YYYY-MM-DD")
          : data.end_date;

        // Send the reservation request.
        const response = await axios.post(
          "http://localhost:3000/api/reservation/create",
          {
            business_id: data.business_id,
            table_number: data.table_number,
            customer_username: data.customer_username,
            group_size: data.group_size,
            slot_type: data.slot_type,
            start_time: formattedTime,
            end_date: formattedDate,
            customer_name: data.customer_name,
            customer_number: data.customer_number,
            ...(data.status ? { status: data.status } : {}),
          }
        );

        if (response.data.success) {
          callback({ success: true, reservation: response.data.reservation });

          // Broadcast the new reservation to all clients
          io.emit("reservationAdded", response.data.reservation);
        } else {
          callback({ success: false, message: "Failed to create reservation" });
        }
      } catch (err) {
        console.error("Error creating reservation:", err);
        callback({ success: false, message: err.message });
      }
    });

    // Delete a reservation (Cancel)
    socket.on("deleteReservation", async (data, callback) => {
      console.log("DELETE EVENT RECEIVED", data); // Log immediately when event is received

      try {
        console.log("About to make DELETE request to API");
        const response = await axios.delete(
          `http://localhost:3000/api/reservation/delete/${data.reservation_id}`
        );
        console.log("API Response:", response.data);

        if (response.data.success) {
          console.log("Delete successful, sending callback and broadcast");
          callback({ success: true, message: response.data.message });

          // Broadcast the deleted reservation ID to all clients
          console.log("Broadcasting deletion with ID:", data.reservation_id);
          console.log("Type of ID:", typeof data.reservation_id);

          io.emit("reservationDeleted", data.reservation_id);
          console.log("Broadcast complete");
        } else {
          console.log("Delete API returned failure:", response.data);
          callback({ success: false, message: "Failed to delete reservation" });
        }
      } catch (err) {
        console.error("Error in delete operation:", err);
        callback({ success: false, message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
