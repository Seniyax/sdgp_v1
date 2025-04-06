import { useEffect, useRef } from "react";
import { Text, View, Animated } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "../contexts/AuthContext";

export default function SplashScreen() {
  const { isAuthenticated, loading } = useAuth();

  // Animation references for fade-in effects
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simple fade-in animation for title
    Animated.timing(titleFadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Delayed fade-in for subtitle
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(subtitleFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay based on authentication status
    const timeout = setTimeout(() => {
      if (!loading && isAuthenticated()) {
        router.push("/home");
      } else {
        router.push("/auth/signin");
      }
    }, 2500);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeout);
  }, [loading, isAuthenticated]);

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: "#420f54" }}
    >
      <StatusBar style="light" />

      {/* Simple centered text display */}
      <View className="items-center space-y-4">
        <Animated.Text
          className="font-bold text-white tracking-widest text-7xl"
          style={{ opacity: titleFadeAnim }}
        >
          SLOTZI
        </Animated.Text>
        
        <Animated.Text
          className="font-medium text-white tracking-wider text-lg"
          style={{ opacity: subtitleFadeAnim }}
        >
          "Your Perfect Slot, Just a Tap Away."
        </Animated.Text>
      </View>
    </View>
  );
}