import React, { useState, useRef, useEffect } from 'react';
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
  Easing
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import styles from '../styles/homestyle';

export default function HomeScreen() {
  const animationRef = useRef(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Animation values for category buttons
  const [categoryAnimations, setCategoryAnimations] = useState({});

  // Create animation references for each category when they're loaded
  useEffect(() => {
    const animations = {};
    filteredCategories.forEach(category => {
      animations[category.id] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
        translateY: new Animated.Value(0)
      };
    });
    setCategoryAnimations(animations);
  }, [filteredCategories]);

  // Entrance animation for all categories
  useEffect(() => {
    if (!loading && filteredCategories.length > 0) {
      const animations = [];
      
      filteredCategories.forEach((category, index) => {
        if (categoryAnimations[category.id]) {
          // Reset animations
          categoryAnimations[category.id].translateY.setValue(50);
          categoryAnimations[category.id].opacity.setValue(0);
          
          // Create entrance animations with staggered delay
          const delay = index * 100;
          
          const translateAnim = Animated.timing(categoryAnimations[category.id].translateY, {
            toValue: 0,
            duration: 300,
            delay,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.5))
          });
          
          const opacityAnim = Animated.timing(categoryAnimations[category.id].opacity, {
            toValue: 1,
            duration: 300,
            delay,
            useNativeDriver: true
          });
          
          animations.push(translateAnim);
          animations.push(opacityAnim);
        }
      });
      
      Animated.parallel(animations).start();
    }
  }, [loading, filteredCategories, categoryAnimations]);

  // Simulate receiving notifications (for testing)
  useEffect(() => {
    // Simulate receiving a notification after component loads
    const timer = setTimeout(() => {
      setNotificationCount(3);
      setHasNotifications(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Animation for button press
  const animateButtonPress = (categoryId) => {
    const scaleDown = Animated.timing(categoryAnimations[categoryId].scale, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    });
    
    const scaleUp = Animated.timing(categoryAnimations[categoryId].scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    });
    
    Animated.sequence([scaleDown, scaleUp]).start();
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
    
    // Play animation before navigating
    if (categoryAnimations[category.id]) {
      animateButtonPress(category.id);
      
      // Add small delay before navigation to allow animation to complete
      setTimeout(() => {
        router.push(category.route);
      }, 200);
    } else {
      router.push(category.route);
    }
  };

  // Navigation handlers for History and Profile with animations
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
      })
    ]).start();
  };

  const navigateToHistory = () => {
    animateNavButton(historyButtonAnim);
    setTimeout(() => {
      router.push('/history');
    }, 200);
  };

  const navigateToProfile = () => {
    animateNavButton(profileButtonAnim);
    setTimeout(() => {
      router.push('/Profile');
    }, 200);
  };
  

  const navigateToNotifications = () => {
    animateNavButton(notificationButtonAnim);
    setTimeout(() => {
      router.push('/notification');
      // Reset notification count when navigating to notifications page
      setNotificationCount(0);
      setHasNotifications(false);
    }, 200);
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
            {categoryAnimations[item.id] ? (
              <Animated.View style={[
                {
                  transform: [
                    { scale: categoryAnimations[item.id].scale },
                    { translateY: categoryAnimations[item.id].translateY }
                  ],
                  opacity: categoryAnimations[item.id].opacity
                }
              ]}>
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
              </Animated.View>
            ) : (
              <TouchableOpacity 
                key={item.id.toString()}
                style={[
                  styles.categoryButton,
                  item.status !== 'active' && styles.inactiveCategory
                ]}
                onPress={() => handleCategoryPress(item)}
                disabled={item.status !== 'active'}
              >
                {/* ... (rest of button content) ... */}
              </TouchableOpacity>
            )}
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
              categoryAnimations[item.id] ? (
                <Animated.View 
                  key={item.id.toString()}
                  style={[
                    {
                      transform: [
                        { scale: categoryAnimations[item.id].scale },
                        { translateY: categoryAnimations[item.id].translateY }
                      ],
                      opacity: categoryAnimations[item.id].opacity,
                      flex: 1,
                      marginHorizontal: wp('2%')
                    }
                  ]}
                >
                  <TouchableOpacity 
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
                </Animated.View>
              ) : (
                <TouchableOpacity 
                  key={item.id.toString()}
                  style={[
                    styles.categoryButton,
                    item.status !== 'active' && styles.inactiveCategory
                  ]}
                  onPress={() => handleCategoryPress(item)}
                  disabled={item.status !== 'active'}
                >
                  {/* ... (rest of button content) ... */}
                </TouchableOpacity>
              )
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

  // Custom styles to adjust the animation position
  const customStyles = {
    animationContainer: {
      ...styles.animationContainer, // Keep original styles
      marginTop: -hp('2%'), // Move animation up by decreasing top margin
      marginBottom: hp('1%'), // Optional: adjust bottom margin if needed
    },
    animation: {
      ...styles.animation, // Keep original animation styles
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation Header - Now inside ScrollView */}
        <View style={styles.topNavHeader}>
          <Animated.View style={{transform: [{scale: profileButtonAnim}]}}>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={navigateToProfile}
            >
              <Ionicons name="person-outline" size={wp('7%')} color="#420F54" />
            </TouchableOpacity>
          </Animated.View>
          
          {/* Notification Button */}
          <Animated.View style={{transform: [{scale: notificationButtonAnim}], marginLeft: wp('2%')}}>
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={navigateToNotifications}
            >
              <Ionicons name="notifications-outline" size={wp('7%')} color="#420F54" />
              {hasNotifications && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.spacer} />

          <Animated.View style={{transform: [{scale: historyButtonAnim}]}}>
            <TouchableOpacity 
              style={styles.topNavButton} 
              onPress={navigateToHistory}
            >
              <Ionicons name="time-outline" size={wp('7%')} color="#420F54" />
              <Text style={styles.topNavButtonText}>History</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        {/* Lottie Animation at Top Center - Using custom styles to move it up */}
        <View style={customStyles.animationContainer}>
          <LottieView
            ref={animationRef}
            source={require('../assets/home.json')}
            autoPlay
            loop={true}
            style={customStyles.animation}
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
    </SafeAreaView>
  );
}