import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  FlatList 
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const animationRef = useRef(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded categories with more details
  const categories = [
    { 
      id: 1, 
      name: 'Restaurants', 
      icon: 'restaurant-outline',
      route: '/Restaurants'
    },
    { 
      id: 2, 
      name: 'Meeting Rooms', 
      icon: 'business-outline',
      route: '/MeetingRooms'
    },
    { 
      id: 3, 
      name: 'Customer Care', 
      icon: 'people-outline',
      route: '/CustomerCareCenter'
    },
    { 
      id: 4, 
      name: 'Education', 
      icon: 'school-outline',
      route: '/EducationCenter'
    },
    { 
      id: 5, 
      name: 'Others', 
      icon: 'ellipsis-horizontal-outline',
      route: '/Others'
    },
  ];

  // Navigation handler for different categories
  const handleCategoryPress = (route) => {
    router.push(route);
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render individual category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryButton}
      onPress={() => handleCategoryPress(item.route)}
    >
      <Ionicons 
        name={item.icon} 
        size={wp('10%')} 
        color="#420F54" 
        style={styles.categoryIcon}
      />
      <Text style={styles.categoryButtonText} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

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
      
      {/* Category Grid */}
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.categoryGridRow}
        contentContainerStyle={styles.categoryGridContainer}
      />
      
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
  },
  categoryGridRow: {
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  categoryButton: {
    backgroundColor: '#F3E4FF',
    borderRadius: wp('6%'),
    width: wp('42%'),
    height: hp('22%'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    paddingHorizontal: wp('2%'),
  },
  categoryIcon: {
    marginBottom: hp('1%'),
  },
  categoryButtonText: {
    color: '#420F54',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4.5%'),
    textAlign: 'center',
    width: '90%',
  },
});