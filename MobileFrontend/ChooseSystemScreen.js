import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur'; // Make sure to install expo-blur

const { width } = Dimensions.get('window');
const itemWidth = (width - 50) / 2;

// Color scheme based on #420E54 (deep purple)
const COLORS = {
  primary: '#420E54', // Deep purple (as requested)
  secondary: '#6A1B9A', // Lighter purple
  accent: '#9C27B0', // Vibrant purple
  background: '#F8F5FB', // Light lavender background
  text: '#2D0A3E', // Dark purple text
  white: '#FFFFFF',
  lightGray: '#F0F0F7',
};

const categories = [
  { 
    id: '1', 
    title: 'RESTAURANTS', 
    icon: 'silverware-fork-knife',
    iconType: 'MaterialCommunityIcons',
    gradientColors: ['#6A1B9A', '#9C27B0'],
    iconSize: 36,
    shadowColor: '#6A1B9A'
  },
  { 
    id: '2', 
    title: 'OFFICE ROOMS', 
    icon: 'office-building',
    iconType: 'MaterialCommunityIcons',
    gradientColors: ['#512DA8', '#7E57C2'],
    iconSize: 36,
    shadowColor: '#512DA8'
  },
  { 
    id: '3', 
    title: 'CUSTOMER CARE', 
    icon: 'headset',
    iconType: 'FontAwesome5',
    gradientColors: ['#7B1FA2', '#AB47BC'],
    iconSize: 32,
    shadowColor: '#7B1FA2'
  },
  { 
    id: '4', 
    title: 'CLOTHING STORES', 
    icon: 'tshirt',
    iconType: 'FontAwesome5',
    gradientColors: ['#4A148C', '#7B1FA2'],
    iconSize: 32,
    shadowColor: '#4A148C'
  },
  { 
    id: '5', 
    title: 'EDUCATIONAL', 
    icon: 'graduation-cap',
    iconType: 'FontAwesome5',
    gradientColors: ['#5E35B1', '#7E57C2'],
    iconSize: 30,
    shadowColor: '#5E35B1'
  },
  { 
    id: '6', 
    title: 'OTHERS', 
    icon: 'apps',
    iconType: 'MaterialCommunityIcons',
    gradientColors: ['#4A148C', '#6A1B9A'],
    iconSize: 36,
    shadowColor: '#4A148C'
  },
];

const renderIcon = (category) => {
  switch(category.iconType) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={category.icon} size={category.iconSize} color={COLORS.white} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={category.icon} size={category.iconSize} color={COLORS.white} />;
    default:
      return <Ionicons name={category.icon} size={category.iconSize} color={COLORS.white} />;
  }
};

const ChooseSystemScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header with flat bottom (no curve) */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SLOTZI</Text>
            <View style={styles.logoUnderline} />
          </View>
          
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <Ionicons name="menu" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Page title and subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Choose System</Text>
        <Text style={styles.subtitle}>
          Join the Lineup with Style! Enroll Yourself in
          the Queue and Make Your Mark!
        </Text>
      </View>
      
      {/* Categories grid */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.item}
              activeOpacity={0.7}
            >
              <View style={[styles.cardShadow, { shadowColor: category.shadowColor }]}>
                <LinearGradient
                  colors={category.gradientColors}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Icon with circle background */}
                  <View style={styles.iconCircle}>
                    {renderIcon(category)}
                  </View>
                  
                  {/* Title with blur effect */}
                  <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                    <Text style={styles.itemTitle}>{category.title}</Text>
                  </BlurView>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 15,
    // No border radius for flat bottom
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 3,
  },
  logoUnderline: {
    width: 30,
    height: 2,
    backgroundColor: COLORS.white,
    marginTop: 4,
    borderRadius: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: itemWidth,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardShadow: {
    width: '100%',
    height: itemWidth * 1.1, // Slightly taller than width
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  blurContainer: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default ChooseSystemScreen;