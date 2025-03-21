import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useReservationsSocket from "../hooks/useReservationsSocket";
import useReservationStore from "../store/reservationStore";

export default function Payments() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse tables and reservation IDs passed from makeReservation
  const tables = params.tables ? JSON.parse(params.tables) : [];
  const reservationIds = params.reservationIds
    ? JSON.parse(params.reservationIds)
    : [];

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the shared socket instance and the updateReservation function from the store
  const socket = useReservationsSocket();
  const { updateReservation: updateReservationInStore } = useReservationStore();

  // Set a 15-minute timeout to auto-cancel payment if not completed
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Alert.alert(
        "Payment Timeout",
        "Payment time expired. Redirecting to home."
      );
      router.push("/");
    }, 15 * 60 * 1000);
    return () => clearTimeout(timeoutId);
  }, [router]);

  const handlePayment = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      Alert.alert("Incomplete Details", "Please enter complete card details.");
      return;
    }
    if (!socket) {
      Alert.alert(
        "Socket Error",
        "Socket not connected yet, please try again later."
      );
      return;
    }
    setLoading(true);

    // For each reservation ID, emit an update event to set status to "active".
    // Payload: { reservation_id: <id>, status: "active" }
    const updateReservation = (reservationId) =>
      new Promise((resolve, reject) => {
        const payload = {
          reservation_id: reservationId,
          customer_username: "uvindu_dev", // Include the username if needed
          update_data: { status: "Active" },
        };
        socket.emit("updateReservation", payload, (response) => {
          if (response && response.success && response.updatedReservation) {
            updateReservationInStore(response.updatedReservation);
            resolve(response);
          } else {
            reject(`Failed to update reservation ${reservationId}`);
          }
        });
      });

    Promise.all(reservationIds.map(updateReservation))
      .then(() => {
        setLoading(false);
        Alert.alert("Success", "Reservation Successful!");
        router.push("/");
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enter Payment Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="numeric"
        maxLength={16}
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Expiry Date (MM/YY)"
          keyboardType="numeric"
          maxLength={5}
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="CVV"
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
          value={cvv}
          onChangeText={setCvv}
        />
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Reservation Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Tables:</Text>
          {tables.map((table, index) => (
            <Text key={index}>
              Table {table.tableNumber}
              {index < tables.length - 1 ? ", " : ""}
            </Text>
          ))}
        </View>
        <View style={styles.summaryRow}>
          <Text>Seats:</Text>
          <Text>{params.totalSeats}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Reservation Type:</Text>
          <Text>{params.reservationType}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total Amount:</Text>
          <Text style={styles.totalText}>{params.totalPrice} LKR</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#420F54" />
      ) : (
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay & Reserve</Text>
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
    fontSize: wp("7%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: wp("3%"),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    marginBottom: hp("2%"),
    fontSize: wp("4%"),
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
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
    color: "#420F54",
  },
  payButton: {
    backgroundColor: "#420F54",
    paddingVertical: hp("2%"),
    borderRadius: wp("2%"),
    alignItems: "center",
    marginTop: hp("3%"),
  },
  payButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
});
