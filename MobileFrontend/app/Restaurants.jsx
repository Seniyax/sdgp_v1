import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import styles from "../styles/Restaurantsstyle"; // Import styles from the restaurantstyle.js file
import { useAuth } from "../contexts/AuthContext";

const RestaurantsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { setBusiness } = useAuth();

  // Added for animations
  const [restaurantAnimations, setRestaurantAnimations] = useState({});
  const backButtonAnim = useRef(new Animated.Value(1)).current;

  const categoryId = 1; // Assuming 1 is for restaurants category

  // Create animation references for each restaurant when they're loaded
  useEffect(() => {
    const animations = {};
    filteredRestaurants.forEach((restaurant) => {
      animations[restaurant.id] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
        translateY: new Animated.Value(0),
      };
    });
    setRestaurantAnimations(animations);
  }, [filteredRestaurants]);

  // Entrance animation for all restaurants
  useEffect(() => {
    if (!loading && filteredRestaurants.length > 0) {
      const animations = [];

      filteredRestaurants.forEach((restaurant, index) => {
        if (restaurantAnimations[restaurant.id]) {
          // Reset animations
          restaurantAnimations[restaurant.id].translateY.setValue(50);
          restaurantAnimations[restaurant.id].opacity.setValue(0);

          // Create entrance animations with staggered delay
          const delay = index * 100;

          const translateAnim = Animated.timing(
            restaurantAnimations[restaurant.id].translateY,
            {
              toValue: 0,
              duration: 300,
              delay,
              useNativeDriver: true,
              easing: Easing.out(Easing.back(1.5)),
            }
          );

          const opacityAnim = Animated.timing(
            restaurantAnimations[restaurant.id].opacity,
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
  }, [loading, filteredRestaurants, restaurantAnimations]);

  // Animation for button press
  const animateButtonPress = (restaurantId) => {
    const scaleDown = Animated.timing(
      restaurantAnimations[restaurantId].scale,
      {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }
    );

    const scaleUp = Animated.timing(restaurantAnimations[restaurantId].scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    });

    Animated.sequence([scaleDown, scaleUp]).start();
  };

  // Back button animation
  const animateBackButton = () => {
    Animated.sequence([
      Animated.timing(backButtonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(backButtonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle back button press with animation
  const handleBackPress = () => {
    animateBackButton();
    setTimeout(() => {
      router.back();
    }, 200);
  };

  // Function to fetch restaurants from API
  const fetchRestaurants = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setLoading(true);
        setPage(1);
        pageNum = 1;
      } else if (pageNum > 1) {
        setLoadingMore(true);
      }

      const response = await axios.get(
        `http://10.0.2.2:3000/api/categories/${categoryId}/businesses?page=${pageNum}&limit=10`
      );

      if (response.data.success) {
        const newRestaurants = response.data.data;

        if (refresh || pageNum === 1) {
          setRestaurants(newRestaurants);
          setFilteredRestaurants(newRestaurants);
        } else {
          setRestaurants((prev) => [...prev, ...newRestaurants]);
          setFilteredRestaurants((prev) => [...prev, ...newRestaurants]);
        }

        // Check if we have more pages
        setHasMoreData(pageNum < response.data.pagination.pages);
      } else {
        setError("Failed to load restaurants");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants(1, true);
  };

  // Load more data when reaching end of list
  const loadMoreData = () => {
    if (hasMoreData && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRestaurants(nextPage);
    }
  };

  // Navigate to restaurant detail with animation
  const handleRestaurantPress = (restaurant) => {
    if (restaurantAnimations[restaurant.id]) {
      animateButtonPress(restaurant.id);
      setBusiness(restaurant);
      // Add small delay before navigation to allow animation to complete
      setTimeout(() => {
        router.push({
          pathname: "/floorPlan",
          params: {
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
          },
        });
      }, 200);
    } else {
      setBusiness(restaurant);
      router.push({
        pathname: "/floorPlan",
        params: {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        },
      });
    }
  };

  // Render restaurant item with alternating layouts
  const renderRestaurantItem = ({ item, index }) => {
    // Determine layout based on index (even/odd)
    const isEven = index % 2 === 0;

    // Common components for both layouts
    const imageComponent = (
      <Image
        source={{ uri: item.image }}
        style={styles.horizontalRestaurantImage}
        resizeMode="cover"
      />
    );

    const infoComponent = (
      <View style={styles.horizontalRestaurantInfo}>
        <View style={styles.nameAndRating}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={wp("4%")} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cuisineText}>{item.cuisine}</Text>
        <View style={styles.waitTimeContainer}>
          <Ionicons name="time-outline" size={wp("4%")} color="#420F54" />
          <Text style={styles.waitTimeText}>{item.waitTime} min wait</Text>
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    item.status === "active" ? "#4CAF50" : "#FFC107",
                },
              ]}
            />
            <Text style={styles.statusText}>
              {item.status === "active" ? "Open" : "Busy"}
            </Text>
          </View>
        </View>
      </View>
    );

    // Apply animations to restaurant card
    return restaurantAnimations[item.id] ? (
      <Animated.View
        style={[
          {
            transform: [
              { scale: restaurantAnimations[item.id].scale },
              { translateY: restaurantAnimations[item.id].translateY },
            ],
            opacity: restaurantAnimations[item.id].opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.horizontalRestaurantCard}
          onPress={() => handleRestaurantPress(item)}
        >
          {isEven ? (
            // Even index: Image first, then info
            <>
              {imageComponent}
              {infoComponent}
            </>
          ) : (
            // Odd index: Info first, then image
            <>
              {infoComponent}
              {imageComponent}
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    ) : (
      <TouchableOpacity
        style={styles.horizontalRestaurantCard}
        onPress={() => handleRestaurantPress(item)}
      >
        {isEven ? (
          <>
            {imageComponent}
            {infoComponent}
          </>
        ) : (
          <>
            {infoComponent}
            {imageComponent}
          </>
        )}
      </TouchableOpacity>
    );
  };

  // Render footer for FlatList (loading indicator when loading more)
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#420F54" />
        <Text style={styles.footerText}>Loading more restaurants...</Text>
      </View>
    );
  };

  return (
    <>
      {/* Add Stack.Screen to hide the header completely */}
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        {/* Header Title with Animated Back Button */}
        <View style={styles.headerContainer}>
          <Animated.View style={{ transform: [{ scale: backButtonAnim }] }}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={wp("6%")} color="#420F54" />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.headerTitle}>Restaurants</Text>
        </View>

        {/* Search Header */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={wp("6%")}
            color="#420F54"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Error message if needed */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => fetchRestaurants(1, true)}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading indicator */}
        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#420F54" />
            <Text style={styles.loaderText}>Loading restaurants...</Text>
          </View>
        ) : (
          /* Restaurant List in Vertical List View with horizontal items */
          <FlatList
            data={filteredRestaurants.filter(
              (restaurant) => restaurant.is_verified
            )}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#420F54"]}
              />
            }
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              !loading && (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="restaurant-outline"
                    size={wp("20%")}
                    color="#ccc"
                  />
                  <Text style={styles.emptyText}>No restaurants found</Text>
                </View>
              )
            }
            numColumns={1}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default RestaurantsScreen;
