import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import styles from "../styles/historystyle";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const History = () => {
  const router = useRouter();
  const { reservationId, tab } = useLocalSearchParams();
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const userId = user ? user.id : null;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tab ? tab : "active");
  const [isSharing, setIsSharing] = useState(false);
  // Flag to ensure auto-scroll/tab switch happens only once
  const [initialScrollPerformed, setInitialScrollPerformed] = useState(false);
  const flatListRef = useRef(null);
  const ITEM_HEIGHT = 100;

  useEffect(() => {
    if (userId) {
      fetchReservationHistory();
    }
  }, [userId]);

  // Only auto-switch tab/scroll once when coming from a notification
  useEffect(() => {
    if (reservationId && !initialScrollPerformed) {
      const reservation = reservations.find(
        (r) => r.id.toString() === reservationId
      );
      if (reservation) {
        let targetTab = activeTab;
        if (reservation.status !== activeTab) {
          targetTab = reservation.status;
          setActiveTab(targetTab);
          setTimeout(() => {
            scrollToReservation(reservationId);
            setInitialScrollPerformed(true);
          }, 300);
        } else {
          scrollToReservation(reservationId);
          setInitialScrollPerformed(true);
        }
      }
    }
  }, [reservations, activeTab, reservationId, initialScrollPerformed]);

  const scrollToReservation = (reservationId) => {
    const filtered = filteredReservations();
    const index = filtered.findIndex(
      (item) => item.id.toString() === reservationId
    );
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const processReservationData = (data) => {
    if (!Array.isArray(data)) {
      console.warn("Expected array for reservation data, got:", typeof data);
      return [];
    }
    return data.map((item) => {
      const dateSource = item.end_date || item.created_at || "";
      const parsedDate = new Date(dateSource);
      const formattedDate = !isNaN(parsedDate.getTime())
        ? parsedDate.toISOString().split("T")[0]
        : "";
      const time = item.start_time || "N/A";
      let normalizedStatus = item.status
        ? item.status.toLowerCase()
        : "pending";
      switch (normalizedStatus) {
        case "active":
          normalizedStatus = "active";
          break;
        case "completed":
          normalizedStatus = "completed";
          break;
        case "failed":
          normalizedStatus = "failed";
          break;
        default:
          normalizedStatus = "pending";
      }
      const payment =
        item.customer_payment &&
        Array.isArray(item.customer_payment) &&
        item.customer_payment.length > 0
          ? item.customer_payment[0]
          : null;
      return {
        id: item.id,
        venueName:
          (item.business && item.business.name) ||
          item.venue_name ||
          "Unknown Venue",
        date: formattedDate,
        time: time,
        endTime: item.end_time || "N/A",
        peopleCount: item.people_count || "N/A",
        status: normalizedStatus,
        originalStatus: item.status || "pending",
        imageUrl:
          item.image_url || (item.business && item.business.cover) || null,
        venueType: item.venue_type || "Restaurant",
        totalAmount: payment
          ? `${payment.amount} ${payment.currency}`
          : "$0.00",
        orderItems: item.order_items || [],
        roomNumber: item.room_number || "N/A",
        attendees: item.attendees || 0,
        duration: item.duration || "N/A",
        equipment: item.equipment || [],
        userId: item.customer_id,
        paymentAmount: payment ? payment.amount.toString() : "N/A",
        paymentCurrency: payment ? payment.currency : "",
        table: item.table
          ? item.table
          : { table_number: "N/A", floor_plan: { floor_name: "N/A" } },
      };
    });
  };

  const fetchReservationHistory = async () => {
    if (!userId) {
      console.log("No userId available yet, waiting...");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/reservations/history", { userId });
      if (response.data && response.data.success) {
        const processedData = processReservationData(
          response.data.reservationHistory || []
        );
        setReservations(processedData);
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch reservation history"
        );
      }
    } catch (err) {
      console.error("Error fetching reservation history:", err);
      if (err.response) {
        const status = err.response.status;
        setError(
          `Server error (${status}): ${
            err.response.data?.message || err.message
          }`
        );
      } else if (err.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString(undefined, options);
      }
      return dateString;
    } catch (err) {
      console.warn("Error formatting date:", dateString);
      return dateString || "N/A";
    }
  };

  const handleReservationPress = (item) => {
    setSelectedReservation(item);
    setModalVisible(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReservationHistory();
  };

  const handleDownloadReceipt = async (reservation) => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                padding: 20px;
                background-color: #f9f9f9;
              }
              .receipt-container {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                width: 80%;
                max-width: 600px;
                background: #fff;
                text-align: center;
              }
              h1 {
                color: #333;
                margin-bottom: 20px;
              }
              p {
                font-size: 14px;
                margin: 10px 0;
              }
              .label {
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <h1>Receipt for Reservation ${reservation.id}</h1>
              <p><span class="label">Venue:</span> ${reservation.venueName}</p>
              <p><span class="label">Date:</span> ${reservation.date}</p>
              <p><span class="label">Start Time:</span> ${reservation.time}</p>
              <p><span class="label">End Time:</span> ${reservation.endTime}</p>
              <p><span class="label">Table Number:</span> ${reservation.table.table_number}</p>
              <p><span class="label">Floor:</span> ${reservation.table.floor_plan.floor_name}</p>
              <p><span class="label">People Count:</span> ${reservation.peopleCount}</p>
              <p><span class="label">Payment:</span> ${reservation.paymentAmount} ${reservation.paymentCurrency}</p>
            </div>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      Alert.alert(
        "Error",
        "Unable to download receipt. Please try again later."
      );
    } finally {
      setIsSharing(false);
    }
  };

  const filteredReservations = () => {
    const userReservations = userId
      ? reservations.filter((item) => !item.userId || item.userId === userId)
      : reservations;
    switch (activeTab) {
      case "active":
        return userReservations.filter((item) => item.status === "active");
      case "completed":
        return userReservations.filter((item) => item.status === "completed");
      case "failed":
        return userReservations.filter((item) =>
          ["cancelled", "failed"].includes(item.status)
        );
      default:
        return userReservations;
    }
  };

  const renderTabBar = () => {
    const activeCount = reservations.filter(
      (item) => item.status === "active"
    ).length;
    const completedCount = reservations.filter(
      (item) => item.status === "completed"
    ).length;
    const failedCount = reservations.filter((item) =>
      ["cancelled", "rejected", "failed"].includes(item.status)
    ).length;
    return (
      <View style={[styles.tabBarContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "active" && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.text },
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active <Text style={styles.countBadge}>({activeCount})</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "completed" && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.text },
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed <Text style={styles.countBadge}>({completedCount})</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "failed" && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab("failed")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.text },
              activeTab === "failed" && styles.activeTabText,
            ]}
          >
            Failed <Text style={styles.countBadge}>({failedCount})</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderReservationItem = ({ item }) => {
    let statusIcon;
    let statusColor;
    switch (item.status) {
      case "completed":
        statusIcon = "checkmark-circle";
        statusColor = "#4CAF50";
        break;
      case "active":
        statusIcon = "ellipse";
        statusColor = "#4CAF50";
        break;
      case "pending":
        statusIcon = "hourglass";
        statusColor = "#FF9800";
        break;
      case "cancelled":
      case "failed":
        statusIcon = "close-circle";
        statusColor = "#F44336";
        break;
      default:
        statusIcon = "help-circle";
        statusColor = "#9E9E9E";
    }
    const displayStatus =
      item.originalStatus ||
      item.status.charAt(0).toUpperCase() +
        item.status.slice(1).replace("_", " ");
    return (
      <TouchableOpacity
        style={styles.reservationItem}
        onPress={() => handleReservationPress(item)}
      >
        <View style={styles.reservationHeader}>
          <Text style={styles.venueName}>{item.venueName}</Text>
          <View style={styles.statusContainer}>
            <Ionicons name={statusIcon} size={wp("4%")} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {displayStatus}
            </Text>
          </View>
        </View>
        <View style={styles.reservationDetails}>
          <View style={styles.detailItem}>
            <Ionicons
              name="calendar-outline"
              size={wp("4%")}
              color={theme.primary}
            />
            <Text style={styles.detailText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="time-outline"
              size={wp("4%")}
              color={theme.primary}
            />
            <Text style={styles.detailText}>{item.time || "N/A"}</Text>
          </View>
          {item.venueType === "Restaurant" ? (
            <View style={styles.detailItem}>
              <Ionicons
                name="people-outline"
                size={wp("4%")}
                color={theme.primary}
              />
              <Text style={styles.detailText}>{item.guests} guests</Text>
            </View>
          ) : (
            <View style={styles.detailItem}>
              <Ionicons
                name="business-outline"
                size={wp("4%")}
                color={theme.primary}
              />
              <Text style={styles.detailText}>{item.venueType}</Text>
            </View>
          )}
        </View>
        <View style={styles.reservationFooter}>
          <Text style={styles.totalAmount}>{item.totalAmount}</Text>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedReservation) return null;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={wp("6%")} color={theme.primary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {selectedReservation.venueName}
            </Text>
            {selectedReservation.imageUrl ? (
              <Image
                source={{ uri: selectedReservation.imageUrl }}
                style={styles.venueImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons
                  name="image-outline"
                  size={wp("10%")}
                  color="#CCCCCC"
                />
              </View>
            )}
            <View style={styles.modalDetailsContainer}>
              <View style={styles.modalDetailRow}>
                <View style={styles.modalDetailItem}>
                  <Ionicons
                    name="calendar"
                    size={wp("5%")}
                    color={theme.primary}
                  />
                  <View>
                    <Text
                      style={[
                        styles.modalDetailLabel,
                        { color: theme.history_fix_2 },
                      ]}
                    >
                      Date
                    </Text>
                    <Text
                      style={[
                        styles.modalDetailValue,
                        { color: theme.history_fix },
                      ]}
                    >
                      {formatDate(selectedReservation.date)}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalDetailItem}>
                  <Ionicons name="time" size={wp("5%")} color={theme.primary} />
                  <View>
                    <Text
                      style={[
                        styles.modalDetailLabel,
                        { color: theme.history_fix_2 },
                      ]}
                    >
                      Start Time
                    </Text>
                    <Text
                      style={[
                        styles.modalDetailValue,
                        { color: theme.history_fix },
                      ]}
                    >
                      {selectedReservation.time || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.modalDetailRow}>
                <View style={styles.modalDetailItem}>
                  <Ionicons
                    name="people"
                    size={wp("5%")}
                    color={theme.primary}
                  />
                  <View>
                    <Text
                      style={[
                        styles.modalDetailLabel,
                        { color: theme.history_fix_2 },
                      ]}
                    >
                      Guests
                    </Text>
                    <Text
                      style={[
                        styles.modalDetailValue,
                        { color: theme.history_fix },
                      ]}
                    >
                      {selectedReservation.peopleCount || "N/A"}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalDetailItem}>
                  <Ionicons
                    name="time-outline"
                    size={wp("5%")}
                    color={theme.primary}
                  />
                  <View>
                    <Text
                      style={[
                        styles.modalDetailLabel,
                        { color: theme.history_fix_2 },
                      ]}
                    >
                      End Time
                    </Text>
                    <Text
                      style={[
                        styles.modalDetailValue,
                        { color: theme.history_fix },
                      ]}
                    >
                      {selectedReservation.endTime || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.modalDetailRow}>
                <View style={styles.modalDetailItem}>
                  <Ionicons name="grid" size={wp("5%")} color={theme.primary} />
                  <View>
                    <Text
                      style={[
                        styles.modalDetailLabel,
                        { color: theme.history_fix_2 },
                      ]}
                    >
                      Table Number
                    </Text>
                    <Text
                      style={[
                        styles.modalDetailValue,
                        { color: theme.history_fix },
                      ]}
                    >
                      {selectedReservation.table.table_number}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalDetailItem}>
                  <Ionicons
                    name="layers"
                    size={wp("5%")}
                    color={theme.primary}
                  />
                  <View>
                    <Text
                      style={[
                        styles.modalDetailLabel,
                        { color: theme.history_fix_2 },
                      ]}
                    >
                      Floor
                    </Text>
                    <Text
                      style={[
                        styles.modalDetailValue,
                        { color: theme.history_fix },
                      ]}
                    >
                      {selectedReservation.table.floor_plan.floor_name}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.modalDetailRow}>
                <View style={styles.modalDetailItem}>
                  <Ionicons name="card" size={wp("5%")} color={theme.primary} />
                  <View>
                    <Text
                      style={[
                        styles.modalDetailLabel,
                        { color: theme.history_fix_2 },
                      ]}
                    >
                      Payment
                    </Text>
                    <Text
                      style={[
                        styles.modalDetailValue,
                        { color: theme.history_fix },
                      ]}
                    >
                      {selectedReservation.paymentAmount
                        ? `${selectedReservation.paymentAmount} ${selectedReservation.paymentCurrency}`
                        : "N/A"}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalDetailItem}>
                  <Ionicons
                    name="information-circle"
                    size={wp("5%")}
                    color={theme.primary}
                  />
                  <View>
                    <Text
                      style={[
                        styles.modalDetailLabel,
                        { color: theme.history_fix_2 },
                      ]}
                    >
                      Status
                    </Text>
                    <Text
                      style={[
                        styles.modalDetailValue,
                        { color: theme.history_fix },
                      ]}
                    >
                      {selectedReservation.originalStatus ||
                        selectedReservation.status}
                    </Text>
                  </View>
                </View>
              </View>
              {(selectedReservation.status === "completed" ||
                selectedReservation.status === "active") && (
                <TouchableOpacity
                  style={styles.downloadButtonModal}
                  onPress={() => handleDownloadReceipt(selectedReservation)}
                >
                  <Ionicons
                    name="download-outline"
                    size={wp("4%")}
                    style={{ color: theme.history_fix }}
                  />
                  <Text
                    style={[
                      styles.downloadButtonTextModal,
                      { color: theme.history_fix },
                    ]}
                  >
                    Download Receipt
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={wp("6%")} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Reservation History
        </Text>
      </View>
      {renderTabBar()}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.notification }]}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={[styles.retryButtonText, { color: theme.primary }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading your reservation history...
          </Text>
        </View>
      ) : (
        <>
          {filteredReservations().length === 0 && !error ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={wp("20%")}
                color={theme.primary}
              />
              <Text style={[styles.emptyText, { color: theme.text }]}>
                No {activeTab} reservations found
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text
                  style={[styles.retryButtonText, { color: theme.primary }]}
                >
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={filteredReservations()}
              renderItem={renderReservationItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.primary]}
                />
              }
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              onScrollToIndexFailed={(info) => {
                console.warn("Scroll failed", info);
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                }, 500);
              }}
            />
          )}
        </>
      )}
      {renderDetailModal()}
    </SafeAreaView>
  );
};

export default History;
