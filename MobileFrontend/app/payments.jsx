import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from "../styles/paymentsstyle";
import { api } from "../services/api";
import useReservationsSocket from "../hooks/useReservationsSocket";
import useReservationStore from "../store/reservationStore";
import { useTheme } from "../contexts/ThemeContext";

export default function Payments() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const params = useLocalSearchParams();
  const tables = useMemo(
    () => (params.tables ? JSON.parse(params.tables) : []),
    [params.tables]
  );
  const reservationIds = useMemo(
    () => (params.reservationIds ? JSON.parse(params.reservationIds) : []),
    [params.reservationIds]
  );
  const { reservationId, amount, totalSeats, reservationType, totalPrice } =
    params;
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [error, setError] = useState(null);
  const socket = useReservationsSocket();
  const { updateReservation: updateReservationInStore } = useReservationStore();
  const { theme } = useTheme();

  useEffect(() => {
    if (!paymentCompleted) {
      const timeoutId = setTimeout(() => {
        if (isFocused) {
          Alert.alert(
            "Payment Timeout",
            "Payment time expired. Redirecting to home."
          );
          router.push("/home");
        }
      }, 15 * 60 * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [paymentCompleted, router, isFocused]);

  useEffect(() => {
    setPaymentData([
      {
        order_id: "ORD-" + Math.floor(Math.random() * 1000000),
        reservation_id:
          reservationId ||
          (reservationIds.length > 0
            ? reservationIds[0]
            : "RSV-" + Math.floor(Math.random() * 1000000)),
        amount: amount || totalPrice || 2500,
        currency: "LKR",
        status: "COMPLETED",
      },
    ]);
    setInitializing(false);
  }, []);

  const validateCardDetails = () => {
    const { number, expiry, cvc, name } = cardDetails;
    if (number.replace(/\s/g, "").length !== 16) return false;
    if (expiry.length !== 5 || !expiry.includes("/")) return false;
    if (cvc.length !== 3) return false;
    if (name.trim().length < 3) return false;
    return true;
  };

  const handleCardNumberChange = (text) => {
    const formatted = text
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      setCardDetails({ ...cardDetails, expiry: cleaned });
    } else {
      const month = cleaned.substring(0, 2);
      const year = cleaned.substring(2, 4);
      setCardDetails({ ...cardDetails, expiry: `${month}/${year}` });
    }
  };

  const processPayment = async () => {
    if (!validateCardDetails()) {
      Alert.alert(
        "Invalid Card",
        "Please check your card details and try again."
      );
      return;
    }
    if (reservationIds.length > 0 && !socket) {
      Alert.alert(
        "Socket Error",
        "Real-time update failed: the reservation socket is not connected. Payment processed but reservation status may not update immediately. Please try again later."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const paymentPromises = reservationIds.map((resId) =>
        api
          .post("/api/payments/initialize", {
            amount: amount || totalPrice || 2500,
            reservationId: resId,
            customerInfo: {
              cardHolderName: cardDetails.name,
              cardNumber: cardDetails.number,
              expiry: cardDetails.expiry,
              cvc: cardDetails.cvc,
            },
          })
          .then((res) => res.data)
      );
      const payments = await Promise.all(paymentPromises);
      const failed = payments.find((p) => !p.success);
      if (failed) {
        throw new Error(
          failed.message ||
            "Failed to initialize payment for one or more reservations"
        );
      }
      setPaymentData(payments.map((p) => p.data));
      setPaymentStatus("COMPLETED");
      setPaymentCompleted(true);
      if (socket && reservationIds.length > 0) {
        await Promise.all(
          reservationIds.map(
            (id) =>
              new Promise((resolve, reject) => {
                const payload = {
                  reservation_id: id,
                  update_data: { status: "Active" },
                };
                socket.emit("updateReservation", payload, (response) => {
                  if (
                    response &&
                    response.success &&
                    response.updatedReservation
                  ) {
                    updateReservationInStore(response.updatedReservation);
                    resolve(response);
                  } else {
                    reject(`Failed to update reservation ${id}`);
                  }
                });
              })
          )
        );
      }
      setLoading(false);
      Alert.alert(
        "Payment Successful",
        "Your payment was processed and reservations updated successfully!",
        [{ text: "OK", onPress: () => router.push("/home") }]
      );
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(err.message || "Payment processing failed");
      Alert.alert("Payment Error", err.message || "Payment processing failed");
      setLoading(false);
    }
  };

  const cancelPayment = () => {
    Alert.alert(
      "Cancel Payment",
      "Are you sure you want to cancel this payment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            setPaymentStatus("CANCELED");
          },
        },
      ]
    );
  };

  if (initializing) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Initializing payment...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={hp("8%")}
            color="#FF6347"
          />
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            Payment Error
          </Text>
          <Text style={[styles.errorMessage, { color: theme.text }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setInitializing(true)}
          >
            <Text style={[styles.retryButtonText, { color: theme.primary }]}>
              Retry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={[styles.cancelButtonText, { color: theme.primary }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.summaryContainer}>
          <Text style={styles.pageTitle}>Payment Details</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount:</Text>
            <Text style={styles.amount}>
              {paymentData[0]?.currency || "LKR"}{" "}
              {paymentData[0]?.amount || amount || 2500}
            </Text>
          </View>
          {paymentData[0]?.reservation_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reservation ID:</Text>
              <Text style={styles.infoValue}>
                {paymentData[0].reservation_id}
              </Text>
            </View>
          )}
          {paymentData[0]?.order_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID:</Text>
              <Text style={styles.infoValue}>{paymentData[0].order_id}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View
              style={[
                styles.statusBadge,
                paymentStatus === "COMPLETED"
                  ? styles.statusCompleted
                  : paymentStatus === "CANCELED"
                  ? styles.statusCanceled
                  : styles.statusPending,
              ]}
            >
              <Text style={styles.statusText}>{paymentStatus}</Text>
            </View>
          </View>
          {tables.length > 0 && (
            <View style={styles.additionalSummary}>
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
              {totalSeats && (
                <View style={styles.summaryRow}>
                  <Text>Seats:</Text>
                  <Text>{totalSeats}</Text>
                </View>
              )}
              {reservationType && (
                <View style={styles.summaryRow}>
                  <Text>Type:</Text>
                  <Text>{reservationType}</Text>
                </View>
              )}
              {totalPrice && (
                <View style={styles.summaryRow}>
                  <Text style={styles.totalText}>Total Price:</Text>
                  <Text style={styles.totalText}>{totalPrice} LKR</Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Card Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="card-outline"
                size={wp("5%")}
                color={theme.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
                value={cardDetails.number}
                onChangeText={handleCardNumberChange}
              />
            </View>
          </View>
          <View style={styles.rowInputs}>
            <View
              style={[
                styles.inputContainer,
                { flex: 1, marginRight: wp("2%") },
              ]}
            >
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="calendar-outline"
                  size={wp("5%")}
                  color={theme.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                  value={cardDetails.expiry}
                  onChangeText={handleExpiryChange}
                />
              </View>
            </View>
            <View
              style={[styles.inputContainer, { flex: 1, marginLeft: wp("2%") }]}
            >
              <Text style={styles.inputLabel}>CVC</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={wp("5%")}
                  color={theme.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  value={cardDetails.cvc}
                  onChangeText={(text) =>
                    setCardDetails({ ...cardDetails, cvc: text })
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={wp("5%")}
                color={theme.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={cardDetails.name}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, name: text })
                }
              />
            </View>
          </View>
          <View style={styles.cardBrandsContainer}>
            <View
              style={[
                styles.cardBrandPlaceholder,
                { backgroundColor: "#1A1F71" },
              ]}
            >
              <Text style={styles.cardBrandText}>VISA</Text>
            </View>
            <View
              style={[
                styles.cardBrandPlaceholder,
                { backgroundColor: "#FF5F00" },
              ]}
            >
              <Text style={styles.cardBrandText}>MC</Text>
            </View>
            <View
              style={[
                styles.cardBrandPlaceholder,
                { backgroundColor: "#2E77BC" },
              ]}
            >
              <Text style={styles.cardBrandText}>AMEX</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={processPayment}
            disabled={loading || paymentStatus === "COMPLETED"}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>
                {paymentStatus === "COMPLETED" ? "Payment Complete" : "Pay Now"}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { borderBlockColor: theme.payment_fix },
            ]}
            onPress={cancelPayment}
            disabled={loading || paymentStatus === "COMPLETED"}
          >
            <Text
              style={[styles.cancelButtonText, { color: theme.payment_fix }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
