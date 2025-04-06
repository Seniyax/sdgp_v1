import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";
import styles from "../styles/homestyle";
import { useTheme } from "../contexts/ThemeContext";

export default function HomeScreen() {
  const { theme, isDarkMode } = useTheme();
  const animationRef = useRef(null);
  const router = useRouter();
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [categoryAnimations, setCategoryAnimations] = useState({});

  useEffect(() => {
    const animations = {};
    filteredCategories.forEach((category) => {
      animations[category.id] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
        translateY: new Animated.Value(0),
      };
    });
    setCategoryAnimations(animations);
  }, [filteredCategories]);

  useEffect(() => {
    if (!loading && filteredCategories.length > 0) {
      const animations = [];
      filteredCategories.forEach((category, index) => {
        if (categoryAnimations[category.id]) {
          categoryAnimations[category.id].translateY.setValue(50);
          categoryAnimations[category.id].opacity.setValue(0);
          const delay = index * 100;
          const translateAnim = Animated.timing(
            categoryAnimations[category.id].translateY,
            {
              toValue: 0,
              duration: 300,
              delay,
              useNativeDriver: true,
              easing: Easing.out(Easing.back(1.5)),
            }
          );
          const opacityAnim = Animated.timing(
            categoryAnimations[category.id].opacity,
            {
              toValue: 1,
              duration: 300,
              delay,
              useNativeDriver: true,
            }
          );
          animations.push(translateAnim);
          animations.push(opacityAnim);
        }
      });
      Animated.parallel(animations).start();
    }
  }, [loading, filteredCategories, categoryAnimations]);

  useEffect(() => {
    let intervalId;
    if (isFocused) {
      const fetchNotificationCount = async () => {
        try {
          const response = await api.get("/api/notifications/unread-count");
          if (response.data.success) {
            const count = response.data.data.count;
            setNotificationCount(count);
            setHasNotifications(count > 0);
          }
        } catch (err) {
          console.error("Error fetching notification count:", err);
          if (err.response && err.response.status === 401) {
            router.push("/login");
          }
        }
      };
      fetchNotificationCount();
      intervalId = setInterval(fetchNotificationCount, 30000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFocused]);

  const categoryIcons = {
    Restaurants: "restaurant-outline",
    "Meeting Rooms": "business-outline",
    "Customer Care": "people-outline",
    Education: "school-outline",
    Others: "ellipsis-horizontal-outline",
    default: "grid-outline",
  };

  const animateButtonPress = (categoryId) => {
    const scaleDown = Animated.timing(categoryAnimations[categoryId].scale, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    });
    const scaleUp = Animated.timing(categoryAnimations[categoryId].scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    });
    Animated.sequence([scaleDown, scaleUp]).start();
  };

  const toCamelCase = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase());

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/categories");
      if (response.data.success) {
        const mappedCategories = response.data.data.map((category) => {
          const iconName =
            categoryIcons[category.name] || categoryIcons.default;
          let routePath = toCamelCase(category.name) + "s";
          return {
            id: category.id,
            name: category.name,
            description: category.description,
            image_light_url: category.image_light_url,
            image_dark_url: category.image_dark_url,
            status: category.status,
            icon: iconName,
            route: routePath,
          };
        });
        setCategories(mappedCategories);
        setFilteredCategories(mappedCategories);
      } else {
        setError(
          "Failed to fetch categories: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const handleCategoryPress = (category) => {
    if (category.status !== "active") return;
    if (categoryAnimations[category.id]) {
      animateButtonPress(category.id);
      setTimeout(() => {
        router.push(category.route);
      }, 200);
    } else {
      router.push(category.route);
    }
  };

  const profileButtonAnim = useRef(new Animated.Value(1)).current;
  const historyButtonAnim = useRef(new Animated.Value(1)).current;
  const notificationButtonAnim = useRef(new Animated.Value(1)).current;

  const animateNavButton = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigateToHistory = () => {
    animateNavButton(historyButtonAnim);
    setTimeout(() => {
      router.push("/history");
    }, 200);
  };

  const navigateToProfile = () => {
    animateNavButton(profileButtonAnim);
    setTimeout(() => {
      router.push("/profile");
    }, 200);
  };

  const navigateToNotifications = () => {
    animateNavButton(notificationButtonAnim);
    setTimeout(() => {
      router.push("/notification");
      setNotificationCount(0);
      setHasNotifications(false);
    }, 200);
  };

  const handleRetry = () => {
    setError(null);
    fetchCategories();
  };

  const renderCategoryGrid = () => {
    if (filteredCategories.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="grid-outline"
            size={wp("15%")}
            color={theme.placeholder}
          />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No categories found
          </Text>
        </View>
      );
    }
    if (searchQuery.trim() !== "" && filteredCategories.length === 1) {
      const item = filteredCategories[0];
      return (
        <View style={styles.categoryGridContainer}>
          <View style={styles.singleResultContainer}>
            {categoryAnimations[item.id] ? (
              <Animated.View
                style={{
                  transform: [
                    { scale: categoryAnimations[item.id].scale },
                    { translateY: categoryAnimations[item.id].translateY },
                  ],
                  opacity: categoryAnimations[item.id].opacity,
                }}
              >
                <TouchableOpacity
                  key={item.id.toString()}
                  style={[
                    styles.categoryButton,
                    item.status !== "active" && styles.inactiveCategory,
                    { backgroundColor: theme.card },
                  ]}
                  onPress={() => handleCategoryPress(item)}
                  disabled={item.status !== "active"}
                >
                  {item.image_light_url && item.image_dark_url ? (
                    <Image
                      source={{
                        uri: isDarkMode
                          ? item.image_light_url
                          : item.image_dark_url,
                      }}
                      style={styles.categoryImage}
                    />
                  ) : (
                    <Ionicons
                      name={item.icon}
                      size={wp("8%")}
                      color={
                        item.status === "active"
                          ? theme.primary
                          : theme.placeholder
                      }
                      style={styles.categoryIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: theme.text },
                      item.status !== "active" && styles.inactiveCategoryText,
                    ]}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  {item.status !== "active" && (
                    <View style={styles.inactiveOverlay}>
                      <Text style={styles.inactiveText}>Coming Soon</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <TouchableOpacity
                key={item.id.toString()}
                style={[
                  styles.categoryButton,
                  item.status !== "active" && styles.inactiveCategory,
                  { backgroundColor: theme.card },
                ]}
                onPress={() => handleCategoryPress(item)}
                disabled={item.status !== "active"}
              />
            )}
          </View>
        </View>
      );
    }
    const rows = [];
    for (let i = 0; i < filteredCategories.length; i += 2) {
      const row = filteredCategories.slice(i, i + 2);
      rows.push(row);
    }
    return (
      <View style={styles.categoryGridContainer}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.categoryGridRow}>
            {row.map((item) =>
              categoryAnimations[item.id] ? (
                <Animated.View
                  key={item.id.toString()}
                  style={{
                    transform: [
                      { scale: categoryAnimations[item.id].scale },
                      { translateY: categoryAnimations[item.id].translateY },
                    ],
                    opacity: categoryAnimations[item.id].opacity,
                    flex: 1,
                    marginHorizontal: wp("2%"),
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      item.status !== "active" && styles.inactiveCategory,
                      { backgroundColor: theme.card },
                    ]}
                    onPress={() => handleCategoryPress(item)}
                    disabled={item.status !== "active"}
                  >
                    {item.image_light_url && item.image_dark_url ? (
                      <Image
                        source={{
                          uri: isDarkMode
                            ? item.image_light_url
                            : item.image_dark_url,
                        }}
                        style={styles.categoryImage}
                      />
                    ) : (
                      <Ionicons
                        name={item.icon}
                        size={wp("8%")}
                        color={
                          item.status === "active"
                            ? theme.primary
                            : theme.placeholder
                        }
                        style={styles.categoryIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.categoryButtonText,
                        { color: theme.text },
                        item.status !== "active" && styles.inactiveCategoryText,
                      ]}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    {item.status !== "active" && (
                      <View style={styles.inactiveOverlay}>
                        <Text style={styles.inactiveText}>Coming Soon</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={[
                    styles.categoryButton,
                    item.status !== "active" && styles.inactiveCategory,
                    { backgroundColor: theme.card },
                  ]}
                  onPress={() => handleCategoryPress(item)}
                  disabled={item.status !== "active"}
                />
              )
            )}
            {row.length === 1 && searchQuery.trim() === "" && (
              <View style={[styles.categoryButton, styles.emptyPlaceholder]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  const customStyles = {
    animationContainer: {
      ...styles.animationContainer,
      marginTop: -hp("2%"),
      marginBottom: hp("1%"),
    },
    animation: {
      ...styles.animation,
    },
  };

  return (
    <SafeAreaView
      style={[styles.mainContainer, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topNavHeader, { backgroundColor: theme.card }]}>
          <Animated.View style={{ transform: [{ scale: profileButtonAnim }] }}>
            <TouchableOpacity
              style={[
                styles.profileButton,
                { backgroundColor: theme.home_fix_2 },
              ]}
              onPress={navigateToProfile}
            >
              <Ionicons name="person-outline" size={wp("7%")} color="#420F54" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              transform: [{ scale: notificationButtonAnim }],
              marginLeft: wp("2%"),
            }}
          >
            <TouchableOpacity
              style={[
                styles.notificationButton,
                { backgroundColor: theme.home_fix_2 },
              ]}
              onPress={navigateToNotifications}
            >
              <Ionicons
                name="notifications-outline"
                size={wp("7%")}
                color="#420F54"
              />
              {hasNotifications && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.spacer} />
          <Animated.View style={{ transform: [{ scale: historyButtonAnim }] }}>
            <TouchableOpacity
              style={[
                styles.topNavButton,
                { backgroundColor: theme.home_fix_2 },
              ]}
              onPress={navigateToHistory}
            >
              <Ionicons name="time-outline" size={wp("7%")} color="#420F54" />
              <Text style={styles.topNavButtonText}>History</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View style={customStyles.animationContainer}>
          <LottieView
            ref={animationRef}
            source={require("../assets/home.json")}
            autoPlay
            loop={true}
            style={customStyles.animation}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.chooseText, { color: theme.text }]}>
            Choose System
          </Text>
          <Text style={[styles.subtaglineText, { color: theme.text }]}>
            "Join the Lineup with Style! Enroll Yourself in the Queue and Make
            Your Mark!"
          </Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={wp("6%")}
            color="#420F54"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.notification }]}>
              {error}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
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
              Loading categories...
            </Text>
          </View>
        ) : (
          renderCategoryGrid()
        )}
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </ScrollView>
    </SafeAreaView>
  );
}
