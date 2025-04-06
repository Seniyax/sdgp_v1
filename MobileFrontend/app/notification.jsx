import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { formatDistanceToNow } from "date-fns";
import styles from "../styles/notificationstyle";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const NotificationScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const { theme } = useTheme();

  useEffect(() => {
    if (!user) router.replace("/auth/signin");
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/notifications");
      if (response.data.success) {
        setNotifications(response.data.data);
        setError(null);
      } else {
        setError(response.data.message || "Failed to fetch notifications");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/api/notifications/unread-count");
      if (response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
    fetchUnreadCount();
  };

  const markAsRead = async (id) => {
    try {
      const response = await api.put(`/api/notifications/${id}/read`);
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
        );
        fetchUnreadCount();
      }
    } catch (err) {
      Alert.alert("Error", "Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await api.put("/api/notifications/read-all");
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            is_read: true,
            read_at: n.read_at || new Date().toISOString(),
          }))
        );
        setUnreadCount(0);
        Alert.alert("Success", "All notifications marked as read");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to mark all notifications as read");
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification.is_read) markAsRead(notification.id);
    if (notification.reservation && notification.reservation.id) {
      if (notification.type === "Reservation - Active") {
        router.push(
          `/history?reservationId=${notification.reservation.id}&tab=active`
        );
      } else if (notification.type === "Reservation - Completed") {
        router.push(
          `/history?reservationId=${notification.reservation.id}&tab=completed`
        );
      } else {
        Alert.alert("Notification", notification.message);
      }
    } else {
      Alert.alert("Notification", notification.message);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Reservation - Pending":
        return "time-outline";
      case "Reservation - Active":
        return "checkmark-circle-outline";
      case "Reservation - Dashboard":
        return "business-outline";
      case "Reservation - Completed":
        return "checkmark-done-outline";
      case "Reservation - Cancelled":
        return "close-circle-outline";
      default:
        return "notifications-outline";
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "Reservation - Pending":
        return "#FFA500";
      case "Reservation - Active":
        return "#4CAF50";
      case "Reservation - Dashboard":
        return "#2196F3";
      case "Reservation - Completed":
        return "#9C27B0";
      case "Reservation - Cancelled":
        return "#F44336";
      default:
        return "#9C27B0";
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (err) {
      return dateString;
    }
  };

  const renderNotificationItem = ({ item }) => (
    <Animated.View style={styles.animatedContainer}>
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.is_read && styles.unreadNotification,
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getIconColor(item.type) },
          ]}
        >
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={wp("6%")}
            color="#fff"
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.timeStamp}>{formatTime(item.created_at)}</Text>
          </View>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          {!item.is_read && <View style={styles.unreadIndicator} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons
        name="notifications-off-outline"
        size={wp("20%")}
        color="#ccc"
      />
      <Text style={[styles.emptyStateText, { color: theme.text }]}>
        No notifications yet
      </Text>
      <Text style={[styles.emptyStateSubText, { color: theme.text }]}>
        We'll notify you when something important happens
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={wp("6%")} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { color: theme.text }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllReadButton}
              onPress={markAllAsRead}
            >
              <Text style={[styles.markAllReadText, { color: theme.primary }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Animated.View
          style={[
            styles.summaryContainer,
            { opacity: fadeAnim, transform: [{ translateY }] },
          ]}
        >
          <View style={styles.countContainer}>
            <Text style={[styles.totalCount, { color: theme.text }]}>
              {notifications.length}
              <Text style={styles.countLabel}> Total</Text>
            </Text>
          </View>
          {unreadCount > 0 && (
            <View style={styles.unreadCountContainer}>
              <Text style={[styles.unreadCount, { color: theme.text }]}>
                {unreadCount}
                <Text style={styles.countLabel}> Unread</Text>
              </Text>
            </View>
          )}
        </Animated.View>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.text }]}>
              {error}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchNotifications}
            >
              <Text style={[styles.retryButtonText, { color: theme.primary }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>
              Loading notifications...
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.primary]}
              />
            }
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
