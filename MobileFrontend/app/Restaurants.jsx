import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router'; 

const Restaurants = () => {
  return (
    <View>
      <Text>Restaurants</Text>
      <Link href="/tableSelect">Table Select</Link>
    </View>
  );
};

export default Restaurants;

const styles = StyleSheet.create({});
