import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function HomeScreen() {
  const animationRef = useRef(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for different category names
  const categoryIcons = {
    'Restaurants': 'restaurant-outline',
    'Meeting Rooms': 'business-outline',
    'Customer Care': 'people-outline',
    'Education': 'school-outline',
    'Others': 'ellipsis-horizontal-outline',
    // Default icon for any other category
    'default': 'grid-outline'
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:3000/api/categories');
      if (response.data.success) {
        // Map API data to the format our UI expects
        const mappedCategories = response.data.data.map(category => {
          // Determine the icon based on category name or use default
          const iconName = categoryIcons[category.name] || categoryIcons.default;
          var routePath = "";
          // Create route path based on category name (remove spaces and special chars)
          if (category.name === "Restaurant"){
            routePath = "Restaurants";
          }else{
            routePath = `/${category.name.replace(/[^a-zA-Z0-9]/g, '')}`;

          }
          console.log(category.name)
          return {
            id: category.id,
            name: category.name,
            description: category.description,
            image_url: category.image_url,
            status: category.status,
            icon: iconName,
            route: routePath
          };
        });
        
        setCategories(mappedCategories);
        setFilteredCategories(mappedCategories);
      } else {
        setError('Failed to fetch categories: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  // Navigation handler for different categories
  const handleCategoryPress = (category) => {
    // For inactive categories, don't navigate
    if (category.status !== 'active') {
      // Could show alert or message that category is not available
      return;
    }
    
    router.push(category.route);
  };

  // Retry loading categories
  const handleRetry = () => {
    setError(null);
    fetchCategories();
  };

  // Render category grid using a simple mapping instead of FlatList
  const renderCategoryGrid = () => {
    // If no categories, show empty state
    if (filteredCategories.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={wp('15%')} color="#ccc" />
          <Text style={styles.emptyText}>No categories found</Text>
        </View>
      );
    }

    // Special case: If we're searching and there's only one result, center it
    if (searchQuery.trim() !== '' && filteredCategories.length === 1) {
      const item = filteredCategories[0];
      return (
        <View style={styles.categoryGridContainer}>
          <View style={styles.singleResultContainer}>
            <TouchableOpacity 
              key={item.id.toString()}
              style={[
                styles.categoryButton,
                item.status !== 'active' && styles.inactiveCategory
              ]}
              onPress={() => handleCategoryPress(item)}
              disabled={item.status !== 'active'}
            >
              {item.image_url ? (
                <Image 
                  source={{ uri: item.image_url }} 
                  style={styles.categoryImage}
                />
              ) : (
                <Ionicons 
                  name={item.icon} 
                  size={wp('8%')}
                  color={item.status === 'active' ? "#420F54" : "#999"} 
                  style={styles.categoryIcon}
                />
              )}
              <Text 
                style={[
                  styles.categoryButtonText, 
                  item.status !== 'active' && styles.inactiveCategoryText
                ]} 
                numberOfLines={2}
              >
                {item.name}
              </Text>
              {item.status !== 'active' && (
                <View style={styles.inactiveOverlay}>
                  <Text style={styles.inactiveText}>Coming Soon</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Regular grid layout for multiple items or when not searching
    const rows = [];
    for (let i = 0; i < filteredCategories.length; i += 2) {
      const row = filteredCategories.slice(i, i + 2);
      rows.push(row);
    }

    return (
      <View style={styles.categoryGridContainer}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.categoryGridRow}>
            {row.map((item) => (
              <TouchableOpacity 
                key={item.id.toString()}
                style={[
                  styles.categoryButton,
                  item.status !== 'active' && styles.inactiveCategory
                ]}
                onPress={() => handleCategoryPress(item)}
                disabled={item.status !== 'active'}
              >
                {item.image_url ? (
                  <Image 
                    source={{ uri: item.image_url }} 
                    style={styles.categoryImage}
                  />
                ) : (
                  <Ionicons 
                    name={item.icon} 
                    size={wp('8%')}
                    color={item.status === 'active' ? "#420F54" : "#999"} 
                    style={styles.categoryIcon}
                  />
                )}
                <Text 
                  style={[
                    styles.categoryButtonText, 
                    item.status !== 'active' && styles.inactiveCategoryText
                  ]} 
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
                {item.status !== 'active' && (
                  <View style={styles.inactiveOverlay}>
                    <Text style={styles.inactiveText}>Coming Soon</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            
            {/* Only add empty placeholder if row has exactly 1 item AND we're not in search mode */}
            {row.length === 1 && searchQuery.trim() === '' && (
              <View style={[styles.categoryButton, styles.emptyPlaceholder]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Lottie Animation at Top Center */}
      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require('../assets/home.json')}
          autoPlay
          loop={true}
          style={styles.animation}
        />
      </View>
      
      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.chooseText}>Choose System</Text>
        <Text style={styles.subtaglineText}>
          "Join the Lineup with Style! Enroll Yourself in the Queue and Make Your Mark!"
        </Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search-outline" 
          size={wp('6%')} 
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
      
      {/* Error View */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#420F54" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : (
        /* Category Grid using manual rendering instead of FlatList */
        renderCategoryGrid()
      )}
      
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: hp('5%'),
  },
  animationContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp('0%'),
  },
  animation: {
    width: wp('140%'),
    height: wp('140%'),
  },
  textContainer: {
    alignItems: 'center',
    width: wp('90%'),
    marginVertical: hp('1%'),
    marginTop: hp('-15%')
  },
  chooseText: {
    fontSize: wp('10%'),
    fontWeight: 'bold',
    color: '#272D2F',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  subtaglineText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Bold',
    color: '#420F54',
    marginTop: hp('1.5%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('90%'),
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('4%'),
    marginVertical: hp('2%'),
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    height: hp('6%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
  },
  categoryGridContainer: {
    width: wp('90%'),
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  // Special container for single search result
  singleResultContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('3%'),
  },
  categoryGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
    width: '100%',
  },
  categoryButton: {
    backgroundColor: '#F3E4FF',
    borderRadius: wp('5%'),     
    width: wp('42%'),
    height: hp('18%'),           
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: wp('1%'),
    margin: wp('1%'),
    position: 'relative',
    overflow: 'hidden',
  },
  // Style for the empty placeholder
  emptyPlaceholder: {
    backgroundColor: 'transparent', 
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  inactiveCategory: {
    backgroundColor: '#F0F0F0',
  },
  inactiveCategoryText: {
    color: '#999',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('5%'),
  },
  inactiveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
  },
  categoryIcon: {
    marginBottom: hp('1%'),
  },
  categoryImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  categoryButtonText: {
    color: '#420F54',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    textAlign: 'center',
    width: '90%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('30%'),
    width: wp('90%'),
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#420F54',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90%'),
    padding: hp('3%'),
  },
  errorText: {
    fontSize: wp('4%'),
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontFamily: 'Poppins-Regular',
  },
  retryButton: {
    backgroundColor: '#420F54',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('3%'),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('30%'),
    width: wp('90%'),
  },
  emptyText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});