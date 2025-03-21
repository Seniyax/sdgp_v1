import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useReservationsSocket from "../hooks/useReservationsSocket";
import useReservationStore from "../store/reservationStore";

export default function MakeReservation() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse selected tables passed from floorPlan (JSON string)
  const tables = params.selectedTables ? JSON.parse(params.selectedTables) : [];
  // Date and time from params; we assume date is in "YYYY-MM-DD" format and time in "HH:MM:SS"
  const date = params.date || "Not specified";
  const time = params.time || "Not specified";

  // Build table info using available properties
  const tableInfo = tables.map((table) => ({
    tableNumber: table.tableNumber || table.id,
    seats: table.seatCount || table.seats || 0,
    floor: table.floor || "Unknown Floor",
  }));

  const totalSeats = tableInfo.reduce((sum, table) => sum + table.seats, 0);
  const pricePerSeat = 50;
  const reservationMultipliers = {
    casual: 1,
    fine_dining: 1.5,
    buffet: 1.2,
  };

  const [reservationType, setReservationType] = useState("");
  const [loading, setLoading] = useState(false);

  // Compute total price based on group size, base price, and type multiplier
  const totalPrice = React.useMemo(() => {
    const multiplier = reservationMultipliers[reservationType] || 1;
    return totalSeats * pricePerSeat * multiplier;
  }, [reservationType, totalSeats, pricePerSeat]);

  // Use your shared socket and reservation store
  const socket = useReservationsSocket();
  const { addReservation } = useReservationStore();

  const handleReservationSubmit = () => {
    if (!reservationType) {
      alert("Please select a reservation type");
      return;
    }
    if (!socket) {
      alert("Socket not connected yet, please try again later.");
      return;
    }
    setLoading(true);

    // Create reservation for each table.
    // Updated payload includes "end_date" (which is the date) and ensures "start_time" is in "HH:MM:SS" format.
    const createReservationForTable = (table) =>
      new Promise((resolve, reject) => {
        const payload = {
          business_id: 20,
          table_number: table.tableNumber, // one table per request
          customer_username: "uvindu_dev",
          group_size: totalSeats.toString(),
          slot_type: reservationType,
          start_time: time, // expected format "HH:MM:SS"
          end_date: date, // NEW: sending the date as end_date
        };

        socket.emit("createReservation", payload, (response) => {
          const reservationId =
            response?.reservation?.id || response?.reservation?.reservation_id;
          if (
            response &&
            response.success &&
            response.reservation &&
            reservationId
          ) {
            addReservation(response.reservation);
            resolve(reservationId);
          } else {
            reject(
              `Failed to create reservation for table ${table.tableNumber}`
            );
          }
        });
      });

    Promise.all(tableInfo.map(createReservationForTable))
      .then((reservationIds) => {
        // Pass all necessary data (including reservation IDs) to payments screen
        router.push({
          pathname: "payments_uvindu",
          params: {
            tables: JSON.stringify(tableInfo),
            date,
            time,
            reservationType,
            totalPrice: totalPrice.toString(),
            totalSeats: totalSeats.toString(),
            reservationIds: JSON.stringify(reservationIds),
          },
        });
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reservation Details</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Date:</Text>
        <Text style={styles.infoValue}>{date}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Time:</Text>
        <Text style={styles.infoValue}>{time}</Text>
      </View>

      <Text style={styles.sectionTitle}>Selected Tables</Text>
      {tableInfo.map((table, index) => (
        <View key={index} style={styles.tableInfoContainer}>
          <View style={styles.tableInfoRow}>
            <View style={styles.tableColumn}>
              <Text style={[styles.tableInfoText, styles.tableNumberText]}>
                Table {table.tableNumber}
              </Text>
            </View>
            <View style={styles.tableColumn}>
              <Text style={styles.tableInfoText}>{table.seats} seats</Text>
            </View>
            <View style={styles.tableColumn}>
              <Text style={styles.tableInfoText}>{table.floor}</Text>
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Reservation Type</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            reservationType === "casual" && styles.selectedTypeButton,
          ]}
          onPress={() => setReservationType("casual")}
        >
          <Text
            style={[
              styles.typeButtonText,
              reservationType === "casual" && styles.selectedTypeButtonText,
            ]}
          >
            Casual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            reservationType === "fine_dining" && styles.selectedTypeButton,
          ]}
          onPress={() => setReservationType("fine_dining")}
        >
          <Text
            style={[
              styles.typeButtonText,
              reservationType === "fine_dining" &&
                styles.selectedTypeButtonText,
            ]}
          >
            Fine Dining
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            reservationType === "buffet" && styles.selectedTypeButton,
          ]}
          onPress={() => setReservationType("buffet")}
        >
          <Text
            style={[
              styles.typeButtonText,
              reservationType === "buffet" && styles.selectedTypeButtonText,
            ]}
          >
            Buffet
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Base Price per Seat:</Text>
          <Text>{pricePerSeat} LKR</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Reservation Type Multiplier:</Text>
          <Text>x {reservationMultipliers[reservationType] || 1}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total Amount:</Text>
          <Text style={styles.totalText}>{totalPrice} LKR</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#420F54" />
      ) : (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleReservationSubmit}
        >
          <Text style={styles.submitButtonText}>Reserve</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: wp("5%"),
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: hp("1%"),
    paddingHorizontal: wp("2%"),
  },
  infoLabel: {
    fontWeight: "bold",
    width: wp("20%"),
  },
  infoValue: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    color: "#420F54",
  },
  tableInfoContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: wp("2%"),
    marginBottom: hp("1%"),
  },
  tableInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tableInfoText: {
    fontSize: wp("4%"),
    textAlign: "center",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp("2%"),
  },
  typeButton: {
    backgroundColor: "#f0f0f0",
    padding: wp("3%"),
    borderRadius: wp("2%"),
    width: wp("28%"),
    alignItems: "center",
  },
  selectedTypeButton: {
    backgroundColor: "#420F54",
  },
  typeButtonText: {
    fontSize: wp("3.5%"),
  },
  selectedTypeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  summaryContainer: {
    backgroundColor: "#f9f9f9",
    padding: wp("4%"),
    borderRadius: wp("2%"),
    marginTop: hp("2%"),
  },
  summaryTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("1%"),
  },
  totalText: {
    fontWeight: "bold",
    fontSize: wp("4.5%"),
  },
  submitButton: {
    backgroundColor: "#420F54",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("10%"),
    borderRadius: wp("2%"),
    marginTop: hp("3%"),
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  tableNumberText: {
    backgroundColor: "#D9B1EB",
    fontWeight: "bold",
    padding: 10,
    borderTopLeftRadius: wp("2%"),
    borderBottomLeftRadius: wp("2%"),
    textAlign: "center",
    width: wp("30%"),
  },
});
