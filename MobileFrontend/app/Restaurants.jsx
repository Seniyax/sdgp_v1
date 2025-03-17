import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Image, 
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';

const RestaurantsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const categoryId = 1; // Assuming 1 is for restaurants category

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
        
        // Add placeholder images since API doesn't provide images
        const restaurantsWithImages = newRestaurants.map(restaurant => ({
          ...restaurant,
          image: `https://source.unsplash.com/random/400x300/?restaurant,food&sig=${restaurant.id}`,
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
          cuisine: getRandomCuisine(),
          waitTime: Math.floor(Math.random() * 30) + 5, // Random wait time between 5-35 minutes
        }));

        if (refresh || pageNum === 1) {
          setRestaurants(restaurantsWithImages);
          setFilteredRestaurants(restaurantsWithImages);
        } else {
          setRestaurants(prev => [...prev, ...restaurantsWithImages]);
          setFilteredRestaurants(prev => [...prev, ...restaurantsWithImages]);
        }

        // Check if we have more pages
        setHasMoreData(pageNum < response.data.pagination.pages);
      } else {
        setError('Failed to load restaurants');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Generate random cuisine type
  const getRandomCuisine = () => {
    const cuisines = ['Italian', 'Chinese', 'Indian', 'Thai', 'Mexican', 'Japanese', 'French', 'Mediterranean'];
    return cuisines[Math.floor(Math.random() * cuisines.length)];
  };

  // Initial fetch
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant => 
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

  // Navigate to restaurant detail
  const handleRestaurantPress = (restaurant) => {
    router.push({
      pathname: '/tableSelect',
      params: { restaurantId: restaurant.id, restaurantName: restaurant.name }
    });
  };

  // Render restaurant item
  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      <View style={styles.restaurantInfo}>
        <View style={styles.nameAndRating}>
          <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={wp('5%')} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cuisineText}>{item.cuisine}</Text>
        <View style={styles.waitTimeContainer}>
          <Ionicons name="time-outline" size={wp('5%')} color="#420F54" />
          <Text style={styles.waitTimeText}>{item.waitTime} min wait</Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? '#4CAF50' : '#FFC107' }]} />
            <Text style={styles.statusText}>{item.status === 'active' ? 'Open' : 'Busy'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Restaurants</Text>
      </View>

      {/* Search Header */}
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search-outline" 
          size={wp('6%')} 
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
          <TouchableOpacity onPress={() => fetchRestaurants(1, true)} style={styles.retryButton}>
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
        /* Restaurant List */
        <FlatList
          data={filteredRestaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={item => item.id.toString()}
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
                <Ionicons name="restaurant-outline" size={wp('20%')} color="#ccc" />
                <Text style={styles.emptyText}>No restaurants found</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

export default RestaurantsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: hp('4%'), // Added extra padding at the top to move content down
  },
  headerContainer: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1%'),
    alignItems: 'center', // Center the header title
  },
  headerTitle: {
    fontSize: wp('8%'), // Increased from 6% to 8%
    fontWeight: 'bold',
    color: '#420F54',
    fontFamily: 'Poppins-Bold', // Added Poppins font
    textAlign: 'center', // Ensure text is centered
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('4%'),
    marginHorizontal: wp('5%'),
    marginVertical: hp('2%'),
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    height: hp('6%'),
    fontFamily: 'Poppins-Regular', // Already had Poppins
    fontSize: wp('4.5%'), // Increased from 4% to 4.5%
  },
  listContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
    alignItems: 'center', // Center the list items
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    width: wp('90%'), // Make the cards a consistent width
  },
  restaurantImage: {
    width: '100%',
    height: hp('20%'),
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
  },
  restaurantInfo: {
    padding: wp('4%'),
  },
  nameAndRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  restaurantName: {
    fontSize: wp('5.5%'), // Increased from 4.5% to 5.5%
    fontWeight: 'bold',
    color: '#272D2F',
    flex: 1,
    fontFamily: 'Poppins-Bold', // Added Poppins font
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
  },
  ratingText: {
    fontSize: wp('4.5%'), // Increased from 3.5% to 4.5%
    fontWeight: 'bold',
    color: '#272D2F',
    marginLeft: wp('1%'),
    fontFamily: 'Poppins-Bold', // Added Poppins font
  },
  cuisineText: {
    fontSize: wp('4.5%'), // Increased from 3.5% to 4.5%
    color: '#666',
    marginBottom: hp('1%'),
    fontFamily: 'Poppins-Regular', // Added Poppins font
  },
  waitTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitTimeText: {
    fontSize: wp('4.5%'), // Increased from 3.5% to 4.5%
    color: '#272D2F',
    marginLeft: wp('1%'),
    marginRight: wp('3%'),
    fontFamily: 'Poppins-Regular', // Added Poppins font
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('1%'),
  },
  statusText: {
    fontSize: wp('4.5%'), // Increased from 3.5% to 4.5%
    color: '#272D2F',
    fontFamily: 'Poppins-Regular', // Added Poppins font
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: hp('1%'),
    fontSize: wp('5%'), // Increased from 4% to 5%
    color: '#420F54',
    fontFamily: 'Poppins-Regular', // Added Poppins font
    textAlign: 'center', // Ensure text is centered
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp('2%'),
  },
  footerText: {
    marginLeft: wp('2%'),
    fontSize: wp('4.5%'), // Increased from 3.5% to 4.5%
    color: '#420F54',
    fontFamily: 'Poppins-Regular', // Added Poppins font
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: hp('10%'),
  },
  emptyText: {
    marginTop: hp('2%'),
    fontSize: wp('5%'), // Increased from 4% to 5%
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Added Poppins font
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: hp('5%'),
  },
  errorText: {
    fontSize: wp('5%'), // Increased from 4% to 5%
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontFamily: 'Poppins-Regular', // Added Poppins font
  },
  retryButton: {
    backgroundColor: '#420F54',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('3%'),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp('4.5%'), // Increased from 4% to 4.5%
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold', // Added Poppins font
  },
});