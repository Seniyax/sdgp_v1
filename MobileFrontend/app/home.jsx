import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function HomeScreen() {
  const animationRef = useRef(null);
  const router = useRouter();
  
  // Navigation handler for different categories
  const handleCategoryPress = (category) => {
    switch(category) {
      case 'Restaurant':
        router.push('/Restaurants');
        break;
      case 'Meeting Rooms':
        router.push('/MeetingRooms');
        break;
      case 'Customer Care Center':
        router.push('/CustomerCareCenter');
        break;
      case 'Education Center':
        router.push('/EducationCenter');
        break;
      case 'Others':
        router.push('/Others');
        break;
      default:
        console.log('No navigation defined for this category');
    }
  };
  
  // Array of categories for dynamic rendering
  const categories = [
    'Restaurant', 
    'Meeting Rooms', 
    'Customer Care Center', 
    'Education Center', 
    'Others'
  ];
  
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
      
      {/* Category Selection Section */}
      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.categoryButton}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.categoryButtonText} numberOfLines={2} adjustsFontSizeToFit>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
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
    paddingBottom: hp('10%'), // Add some bottom padding
  },
  animationContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp('0%'), // Adjusted to give some top margin
  },
  animation: {
    width: wp('140%'),
    height: wp('140%'),
  },
  textContainer: {
    alignItems: 'center',
    width: wp('90%'),
    marginVertical: hp('2%'),
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
  categoryContainer: {
    width: wp('90%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  categoryButton: {
    backgroundColor: '#F3E4FF',
    borderRadius: wp('6%'),
    width: wp('90%'),
    height: hp('30%'),
    marginVertical: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    paddingHorizontal: wp('5%'),
  },
  categoryButtonText: {
    color: '#420F54',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('6%'),
    textAlign: 'center',
    width: '90%',
  },
});