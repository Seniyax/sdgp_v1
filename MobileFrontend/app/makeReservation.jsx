import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useReservationsSocket from "../hooks/useReservationsSocket";
import useReservationStore from "../store/reservationStore";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function MakeReservation() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user, business } = useAuth();
  const { theme } = useTheme();
  const tables = params.selectedTables ? JSON.parse(params.selectedTables) : [];
  const date = params.date || "Not specified";
  const time = params.time || "Not specified";
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
  const totalPrice = React.useMemo(() => {
    const multiplier = reservationMultipliers[reservationType] || 1;
    return totalSeats * pricePerSeat * multiplier;
  }, [reservationType, totalSeats, pricePerSeat]);
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
    const createReservationForTable = (table) =>
      new Promise((resolve, reject) => {
        const payload = {
          business_id: business.id,
          table_number: table.tableNumber,
          customer_username: user.username,
          group_size: totalSeats.toString(),
          slot_type: reservationType,
          start_time: time,
          end_date: date,
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
        router.push({
          pathname: "payments",
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={[styles.headerContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={wp("6%")} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: theme.text }]}>
          Create Reservation
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Reservation Details
        </Text>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>Date:</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{date}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>Time:</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{time}</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Selected Tables
        </Text>
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
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Reservation Type
        </Text>
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
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleReservationSubmit}
          >
            <Text style={styles.submitButtonText}>
              Reserve
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("5%"),
    paddingBottom: hp("2%"),
  },
  backButton: {
    padding: wp("2%"),
  },
  screenTitle: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#420F54",
    flex: 1,
    marginLeft: wp("3%"),
  },
  container: { padding: wp("5%"), backgroundColor: "#fff", flexGrow: 1 },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#420F54",
    marginBottom: 25,
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: hp("1%"),
    paddingHorizontal: wp("2%"),
  },
  infoLabel: { fontWeight: "bold", width: wp("20%") },
  infoValue: { flex: 1 },
  sectionTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
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
  tableColumn: { flex: 1, alignItems: "center", justifyContent: "center" },
  tableInfoText: { fontSize: wp("4%"), textAlign: "center" },
  tableNumberText: {
    backgroundColor: "#D9B1EB",
    fontWeight: "bold",
    padding: 10,
    borderTopLeftRadius: wp("2%"),
    borderBottomLeftRadius: wp("2%"),
    textAlign: "center",
    width: wp("30%"),
    height: hp("5%"),
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
  selectedTypeButton: { backgroundColor: "#420F54" },
  typeButtonText: { fontSize: wp("3.5%") },
  selectedTypeButtonText: { color: "#fff", fontWeight: "bold" },
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
  totalText: { fontWeight: "bold", fontSize: wp("4.5%") },
  submitButton: {
    backgroundColor: "#420F54",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("10%"),
    borderRadius: wp("2%"),
    marginTop: hp("3%"),
    alignSelf: "center",
  },
  submitButtonText: { color: "#fff", fontSize: wp("4%"), fontWeight: "bold" },
});
