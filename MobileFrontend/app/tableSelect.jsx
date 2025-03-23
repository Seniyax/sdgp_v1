import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router'; 

const tableSelect = () => {
  return (
    <View>
      <Text>TableSelect</Text>
      <Link href="/payments">Payments</Link>
    </View>
  );
};

export default tableSelect;

const styles = StyleSheet.create({});
