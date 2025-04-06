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
import styles from "../styles/Restaurantsstyle";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import defaultRestaurantImage from "../assets/default-resturant.jpg";

const RestaurantsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { setBusiness } = useAuth();
  const animationsRef = useRef({});
  const backButtonAnim = useRef(new Animated.Value(1)).current;
  const prevRestaurantsRef = useRef([]);

  const categoryId = 1;
  const { theme, isDarkMode } = useTheme();

  const initializeAnimation = (restaurantId) => {
    if (!animationsRef.current[restaurantId]) {
      animationsRef.current[restaurantId] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(50),
      };
    }
  };

  useEffect(() => {
    const fetchFloorPlans = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/api/floor-plan/get-all`
        );
        if (response.data.success) {
          setFloorPlans(response.data.floorplans);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFloorPlans();
  }, []);

  useEffect(() => {
    const newRestaurants = filteredRestaurants.filter(
      (restaurant) =>
        !prevRestaurantsRef.current.some(
          (prevRestaurant) => prevRestaurant.id === restaurant.id
        )
    );
    newRestaurants.forEach((restaurant) => {
      initializeAnimation(restaurant.id);
      const anim = animationsRef.current[restaurant.id];
      anim.translateY.setValue(50);
      anim.opacity.setValue(0);
    });
    const animations = newRestaurants.map((restaurant, index) => {
      const anim = animationsRef.current[restaurant.id];
      const delay = index * 100;
      return Animated.parallel([
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 300,
          delay,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
      ]);
    });
    if (animations.length > 0) {
      Animated.stagger(100, animations).start();
    }
    prevRestaurantsRef.current = filteredRestaurants;
  }, [filteredRestaurants]);

  const animateButtonPress = (restaurantId) => {
    const anim = animationsRef.current[restaurantId];
    if (!anim) return;
    Animated.sequence([
      Animated.timing(anim.scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(anim.scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  };

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

  const handleBackPress = () => {
    animateBackButton();
    setTimeout(() => {
      router.back();
    }, 200);
  };

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

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    const floorPlanIds = new Set(floorPlans.map((fp) => fp.business_id));
    filtered = filtered.filter(
      (restaurant) => restaurant.is_verified && floorPlanIds.has(restaurant.id)
    );
    setFilteredRestaurants(filtered);
  }, [searchQuery, restaurants, floorPlans]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants(1, true);
  };

  const loadMoreData = () => {
    if (hasMoreData && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRestaurants(nextPage);
    }
  };

  const handleRestaurantPress = (restaurant) => {
    if (animationsRef.current[restaurant.id]) {
      animateButtonPress(restaurant.id);
      setBusiness(restaurant);
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

  const renderRestaurantItem = ({ item, index }) => {
    const isEven = index % 2 === 0;
    const imageSource = item.logo
      ? { uri: item.logo }
      : item.cover
      ? { uri: item.cover }
      : defaultRestaurantImage;
    const imageComponent = (
      <Image
        source={imageSource}
        style={styles.horizontalRestaurantImage}
        resizeMode="cover"
      />
    );
    const infoComponent = (
      <View style={styles.horizontalRestaurantInfo}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.restaurantDescription} numberOfLines={2}>
          {item.description || ""}
        </Text>
        <Text style={styles.restaurantHours}>
          {item.opening_hour ? `Opens at ${item.opening_hour}` : ""}
        </Text>
      </View>
    );
    const content = isEven ? (
      <>
        {imageComponent}
        {infoComponent}
      </>
    ) : (
      <>
        {infoComponent}
        {imageComponent}
      </>
    );
    const anim = animationsRef.current[item.id];
    return anim ? (
      <Animated.View
        style={{
          transform: [{ scale: anim.scale }, { translateY: anim.translateY }],
          opacity: anim.opacity,
        }}
      >
        <TouchableOpacity
          style={styles.horizontalRestaurantCard}
          onPress={() => handleRestaurantPress(item)}
        >
          {content}
        </TouchableOpacity>
      </Animated.View>
    ) : (
      <TouchableOpacity
        style={styles.horizontalRestaurantCard}
        onPress={() => handleRestaurantPress(item)}
      >
        {content}
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#420F54" />
        <Text style={[styles.footerText, { color: theme.text }]}>
          Loading more restaurants...
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View style={[styles.headerContainer, { backgroundColor: theme.card }]}>
          <Animated.View style={{ transform: [{ scale: backButtonAnim }] }}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={wp("6%")}
                color={theme.primary}
              />
            </TouchableOpacity>
          </Animated.View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Restaurants
          </Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={wp("6%")}
            color={theme.primary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor={theme.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {error && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <Text style={[styles.errorText, { color: theme.text }]}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => fetchRestaurants(1, true)}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#420F54" />
            <Text style={[styles.loaderText, { color: theme.text }]}>
              Loading restaurants...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRestaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.primary]}
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
