import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const History = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [userId, setUserId] = useState(null);

  const api = axios.create({
    baseURL: `${process.env.API_BASE_URL}/api`,
    timeout: 10000,
  });

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          setUserId("86b0fb25-e1f7-41a1-8338-fee52ca2669d");
        }
      } catch {
        setUserId("86b0fb25-e1f7-41a1-8338-fee52ca2669d");
      }
    };
    getUserId();
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  const parseDate = (dateString) => {
    if (!dateString) return { formattedDate: "", formattedTime: "" };
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return {
          formattedDate: date.toISOString().split("T")[0],
          formattedTime: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }
    } catch {}
    return { formattedDate: "", formattedTime: "" };
  };

  const processReservationData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => {
      const { formattedDate, formattedTime } = parseDate(
        item.date || item.start_time
      );
      let normalizedStatus = item.status
        ? item.status.toLowerCase()
        : "pending";
      switch (normalizedStatus) {
        case "active":
          normalizedStatus = "pending";
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
      return {
        id: item.id || String(Math.random()),
        venueName: item.venueName || item.venue_name || "Unknown Venue",
        date: formattedDate || item.date || "",
        time: formattedTime || item.time || "",
        tableNumber:
          item.tableNumber || item.table_number || item.roomNumber || "N/A",
        guests: item.guests || item.attendees || 0,
        status: normalizedStatus,
        originalStatus: item.status || "pending",
        imageUrl: item.imageUrl || item.image_url || null,
        venueType: item.venueType || item.venue_type || "Restaurant",
        totalAmount: item.totalAmount || item.total_amount || "$0.00",
        orderItems: item.orderItems || item.order_items || [],
        roomNumber: item.roomNumber || item.room_number || "N/A",
        attendees: item.attendees || 0,
        duration: item.duration || "N/A",
        equipment: item.equipment || [],
        userId: item.userId || item.user_id,
      };
    });
  };

  const fetchReservationHistoryMock = async () => {
    setLoading(true);
    setError(null);
    try {
      const mockData = [
        { id: 41, status: "Completed" /* ... */ },
        { id: 43, status: "Completed" /* ... */ },
        { id: 51, status: "Active" /* ... */ },
      ];
      const processed = processReservationData(mockData);
      setReservations(processed);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchReservationHistory = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      return fetchReservationHistoryMock();
      // Real API call commented out:
      // const response = await api.post('/reservations/history', { userId });
      // ...
    } catch (err) {
      if (err.response) {
        setError(
          `Server error (${err.response.status}): ${
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

  useEffect(() => {
    if (userId) fetchReservationHistory();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return dateString;
    } catch {
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

  const filteredReservations = () => {
    const userReservations = userId
      ? reservations.filter((item) => !item.userId || item.userId === userId)
      : reservations;
    switch (activeTab) {
      case "active":
        return userReservations.filter((item) =>
          ["pending", "confirmed", "in_progress"].includes(item.status)
        );
      case "completed":
        return userReservations.filter((item) => item.status === "completed");
      case "failed":
        return userReservations.filter((item) =>
          ["cancelled", "rejected", "failed"].includes(item.status)
        );
      default:
        return userReservations;
    }
  };

  const renderTabBar = () => {
    const activeCount = reservations.filter((item) =>
      ["pending", "confirmed", "in_progress"].includes(item.status)
    ).length;
    const completedCount = reservations.filter(
      (item) => item.status === "completed"
    ).length;
    const failedCount = reservations.filter((item) =>
      ["cancelled", "rejected", "failed"].includes(item.status)
    ).length;

    return (
      <View style={styles.tabBarContainer}>
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
              activeTab === "failed" && styles.activeTabText,
            ]}
          >
            Failed <Text style={styles.countBadge}>({failedCount})</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  // Render each reservation item
  const renderReservationItem = ({ item }) => {
    // Determine the status icon based on reservation status
    let statusIcon;
    let statusColor;

    switch (item.status) {
      case 'completed':
        statusIcon = 'checkmark-circle';
        statusColor = '#4CAF50';
        break;
      case 'confirmed':
        statusIcon = 'time';
        statusColor = '#2196F3';
        break;
      case 'pending':
        statusIcon = 'hourglass';
        statusColor = '#FF9800';
        break;
      case 'in_progress':
        statusIcon = 'refresh-circle';
        statusColor = '#03A9F4';
        break;
      case 'cancelled':
      case 'rejected':
      case 'failed':
        statusIcon = 'close-circle';
        statusColor = '#F44336';
        break;
      default:
        statusIcon = 'help-circle';
        statusColor = '#9E9E9E';
    }


  const renderReservationItem = ({ item }) => {
    let statusIcon, statusColor;
    switch (item.status) {
      case "completed":
        statusIcon = "checkmark-circle";
        statusColor = "#4CAF50";
        break;
      case "confirmed":
        statusIcon = "time";
        statusColor = "#2196F3";
        break;
      case "pending":
        statusIcon = "hourglass";
        statusColor = "#FF9800";
        break;
      case "in_progress":
        statusIcon = "refresh-circle";
        statusColor = "#03A9F4";
        break;
      case "cancelled":
      case "rejected":
      case "failed":
        statusIcon = "close-circle";
        statusColor = "#F44336";
        break;
      default:
        statusIcon = "help-circle";
        statusColor = "#9E9E9E";
    }
    const displayStatus = item.originalStatus || item.status;

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
              {displayStatus.charAt(0).toUpperCase() +
                displayStatus.slice(1).replace("_", " ")}
            </Text>
          </View>
        </View>
        <View style={styles.reservationDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={wp("4%")} color="#420F54" />
            <Text style={styles.detailText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={wp("4%")} color="#420F54" />
            <Text style={styles.detailText}>{item.time || "N/A"}</Text>
          </View>
          {item.venueType === "Restaurant" ? (
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={wp("4%")} color="#420F54" />
              <Text style={styles.detailText}>{item.guests} guests</Text>
            </View>
          ) : (
            <View style={styles.detailItem}>
              <Ionicons
                name="business-outline"
                size={wp("4%")}
                color="#420F54"
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
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={wp("6%")} color="#420F54" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedReservation.venueName}
            </Text>
            {selectedReservation.imageUrl ? (
              <Image
                source={{ uri: selectedReservation.imageUrl }}
                style={styles.venueImage}
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
              {/* Date & Time */}
              <View style={styles.modalDetailRow}>
                <View style={styles.modalDetailItem}>
                  <Ionicons name="calendar" size={wp("5%")} color="#420F54" />
                  <View>
                    <Text style={styles.modalDetailLabel}>Date</Text>
                    <Text style={styles.modalDetailValue}>
                      {formatDate(selectedReservation.date)}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalDetailItem}>
                  <Ionicons name="time" size={wp("5%")} color="#420F54" />
                  <View>
                    <Text style={styles.modalDetailLabel}>Time</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedReservation.time || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
              {/* Venue-specific */}
              <View style={styles.modalDetailRow}>
                {selectedReservation.venueType === "Restaurant" ? (
                  <>
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="people" size={wp("5%")} color="#420F54" />
                      <View>
                        <Text style={styles.modalDetailLabel}>Guests</Text>
                        <Text style={styles.modalDetailValue}>
                          {selectedReservation.guests}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.modalDetailItem}>
                      <Ionicons
                        name="restaurant"
                        size={wp("5%")}
                        color="#420F54"
                      />
                      <View>
                        <Text style={styles.modalDetailLabel}>Table</Text>
                        <Text style={styles.modalDetailValue}>
                          {selectedReservation.tableNumber}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.modalDetailItem}>
                      <Ionicons
                        name="business"
                        size={wp("5%")}
                        color="#420F54"
                      />
                      <View>
                        <Text style={styles.modalDetailLabel}>Room</Text>
                        <Text style={styles.modalDetailValue}>
                          {selectedReservation.roomNumber}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.modalDetailItem}>
                      <Ionicons name="people" size={wp("5%")} color="#420F54" />
                      <View>
                        <Text style={styles.modalDetailLabel}>Attendees</Text>
                        <Text style={styles.modalDetailValue}>
                          {selectedReservation.attendees}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
              {/* Total & Status */}
              <View style={styles.modalDetailRow}>
                <View style={styles.modalDetailItem}>
                  <Ionicons name="pricetag" size={wp("5%")} color="#420F54" />
                  <View>
                    <Text style={styles.modalDetailLabel}>Total</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedReservation.totalAmount}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalDetailItem}>
                  <Ionicons
                    name="information-circle"
                    size={wp("5%")}
                    color="#420F54"
                  />
                  <View>
                    <Text style={styles.modalDetailLabel}>Status</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedReservation.originalStatus ||
                        selectedReservation.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={wp("6%")} color="#420F54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation History</Text>
        {userId && (
          <Text style={styles.userIdText}>
            User: {userId.substring(0, 8)}...
          </Text>
        )}
      </View>
      {renderTabBar()}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#420F54" />
          <Text style={styles.loadingText}>
            Loading your reservation history...
          </Text>
        </View>
      ) : filteredReservations().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={wp("20%")} color="#420F54" />
          <Text style={styles.emptyText}>
            No {activeTab} reservations found
          </Text>
          {userId && <Text style={styles.emptySubText}>User ID: {userId}</Text>}
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredReservations()}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#420F54"]}
            />
          }
        />
      )}
      {renderDetailModal()}
    </SafeAreaView>
  );
};

export default History;
