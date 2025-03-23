import React, { useState, useEffect } from "react";
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
import useReservationsSocket from "../hooks/useReservationsSocket";
import useReservationStore from "../store/reservationStore";

export default function Payments() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const params = useLocalSearchParams();
  const tables = params.tables ? JSON.parse(params.tables) : [];
  const reservationIds = params.reservationIds
    ? JSON.parse(params.reservationIds)
    : [];
  const { reservationId, amount, totalSeats, reservationType, totalPrice } =
    params;
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [error, setError] = useState(null);

  // Socket and reservation store for updating reservation status
  const socket = useReservationsSocket();
  const { updateReservation: updateReservationInStore } = useReservationStore();

  // Updated timeout: now 20 minutes (15 * 60 * 1000 ms)
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
      }, 15 * 60 * 1000); // Updated to 15 minutes

      return () => clearTimeout(timeoutId);
    }
  }, [paymentCompleted, router, isFocused]);

  // Call this when payment succeeds to update state.
  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
  };

  // Simulate initialization
  useEffect(() => {
    const mockInitialization = () => {
      setTimeout(() => {
        setPaymentData({
          paymentRecord: {
            order_id: "ORD-" + Math.floor(Math.random() * 1000000),
            reservation_id:
              reservationId ||
              (reservationIds.length > 0
                ? reservationIds[0]
                : "RSV-" + Math.floor(Math.random() * 1000000)),
            amount: amount || totalPrice || 2500,
            currency: "LKR",
            status: "PENDING",
          },
        });
        setInitializing(false);
      }, 1000);
    };
    mockInitialization();
  }, [reservationId, amount, totalPrice, reservationIds]);

  // Validate card details (simple validation)
  const validateCardDetails = () => {
    const { number, expiry, cvc, name } = cardDetails;
    if (number.replace(/\s/g, "").length !== 16) return false;
    if (expiry.length !== 5 || !expiry.includes("/")) return false;
    if (cvc.length !== 3) return false;
    if (name.trim().length < 3) return false;
    return true;
  };

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (text) => {
    const formatted = text
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setCardDetails({ ...cardDetails, number: formatted });
  };

  // Format expiry date as MM/YY
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

  // Process payment: simulate API call then update reservation(s) via socket if available
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
        "Socket not connected yet, please try again later."
      );
      return;
    }
    setLoading(true);

    // Simulate payment processing (replace with actual API call as needed)
    setTimeout(() => {
      setPaymentStatus("COMPLETED");
      setPaymentData((prev) =>
        prev
          ? {
              ...prev,
              paymentRecord: { ...prev.paymentRecord, status: "COMPLETED" },
            }
          : prev
      );
      // Mark payment as completed.
      handlePaymentSuccess();

      // If there are reservation IDs and a connected socket, update each reservation
      if (socket && reservationIds.length > 0) {
        Promise.all(
          reservationIds.map((id) => {
            return new Promise((resolve, reject) => {
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
            });
          })
        )
          .then(() => {
            setLoading(false);
            Alert.alert(
              "Payment Successful",
              "Payment and reservation update completed successfully!",
              [{ text: "OK", onPress: () => router.push("/home") }]
            );
          })
          .catch((error) => {
            setLoading(false);
            Alert.alert("Error", error);
          });
      } else {
        setLoading(false);
        Alert.alert("Payment Successful", "Payment completed successfully!", [
          { text: "OK", onPress: () => router.push("/home") },
        ]);
      }
    }, 1500);
  };

  // Cancel payment (sets status to CANCELED)
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#420F54" />
          <Text style={styles.loadingText}>Initializing payment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={hp("8%")}
            color="#FF6347"
          />
          <Text style={styles.errorTitle}>Payment Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setInitializing(true)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Payment Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.pageTitle}>Payment Details</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount:</Text>
            <Text style={styles.amount}>
              {paymentData?.paymentRecord?.currency || "LKR"}{" "}
              {paymentData?.paymentRecord?.amount || amount || 2500}
            </Text>
          </View>

          {paymentData?.paymentRecord?.reservation_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reservation ID:</Text>
              <Text style={styles.infoValue}>
                {paymentData.paymentRecord.reservation_id}
              </Text>
            </View>
          )}

          {paymentData?.paymentRecord?.order_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID:</Text>
              <Text style={styles.infoValue}>
                {paymentData.paymentRecord.order_id}
              </Text>
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

          {/* If additional reservation summary is available */}
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
                  <Text>Total Price:</Text>
                  <Text style={styles.totalText}>{totalPrice} LKR</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Payment Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Card Information</Text>

          {/* Card Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="card-outline"
                size={wp("5%")}
                color="#420F54"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19} // 16 digits + spaces
                value={cardDetails.number}
                onChangeText={handleCardNumberChange}
              />
            </View>
          </View>

          {/* Expiry and CVC */}
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
                  color="#420F54"
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
                  color="#420F54"
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

          {/* Cardholder Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={wp("5%")}
                color="#420F54"
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

          {/* Card Brand Images */}
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

        {/* Action Buttons */}
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
            style={styles.cancelButton}
            onPress={cancelPayment}
            disabled={loading || paymentStatus === "COMPLETED"}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
