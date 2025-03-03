import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2;

const categories = [
  { id: '1', title: 'RESTAURANTS', image: 'https://source.unsplash.com/featured/?restaurant' },
  { id: '2', title: 'OFFICE ROOMS', image: 'https://source.unsplash.com/featured/?office' },
  { id: '3', title: 'CUSTOMER CARE\nCENTRES', image: 'https://source.unsplash.com/featured/?customer-service' },
  { id: '4', title: 'CLOTHING STORES', image: 'https://source.unsplash.com/featured/?clothing-store' },
  { id: '5', title: 'EDUCATIONAL\nCENTRES', image: 'https://source.unsplash.com/featured/?school' },
  { id: '6', title: 'OTHERS', image: 'https://source.unsplash.com/featured/?queue' },
];

const ChooseSystemScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.menuButton}>{'<<'}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>Choose System</Text>
      <Text style={styles.subtitle}>
        Join the Lineup with Style! Enroll Yourself in{'\n'}
        the Queue and Make Your Mark!
      </Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.item}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: category.image }} style={styles.image} />
              </View>
              <Text style={styles.itemTitle}>{category.title}</Text>
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
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    fontSize: 24,
    color: '#2A8B8B',
  },
  menuButton: {
    fontSize: 24,
    color: '#2A8B8B',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A8B8B',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#2A8B8B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
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
  imageContainer: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2A8B8B',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2A8B8B',
    textAlign: 'center',
  },
});

export default ChooseSystemScreen;