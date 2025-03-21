// import { useEffect, useRef } from 'react';
// import { Text, View, Animated, Easing } from 'react-native';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import LottieView from 'lottie-react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// export default function SplashScreen() {
//   const animationRef = useRef(null);
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const rotateReverseAnim = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(0)).current;
//   const titleFadeAnim = useRef(new Animated.Value(0)).current;
//   const subtitleFadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Start Lottie animation on component mount
//     animationRef.current?.play();

//     // Animate the rotation of the outer ring
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 12000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();

//     // Animate the reverse rotation of the inner ring
//     Animated.loop(
//       Animated.timing(rotateReverseAnim, {
//         toValue: 1,
//         duration: 8000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();

//     // Animate the pulsing effect
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 0,
//           duration: 2000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         })
//       ])
//     ).start();

//     // Title fade in and slide up
//     Animated.sequence([
//       Animated.delay(500), // Small delay before title appears
//       Animated.timing(titleFadeAnim, {
//         toValue: 1,
//         duration: 800,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       })
//     ]).start();

//     // Subtitle fade in with delay and slide up
//     Animated.sequence([
//       Animated.delay(1000), // Longer delay for subtitle
//       Animated.timing(subtitleFadeAnim, {
//         toValue: 1,
//         duration: 800,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       })
//     ]).start();

//     // Navigate to home screen after 3 seconds
//     const timeout = setTimeout(() => {
//       router.push('/home'); // Change '/home' to your desired route
//     }, 3000);

//     // Cleanup timeout on component unmount
//     return () => clearTimeout(timeout);
//   }, []);

//   // Rotate interpolation for the outer ring
//   const rotation = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   // Reverse rotate interpolation for inner ring
//   const reverseRotation = rotateReverseAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '-360deg'],
//   });

//   // Scale interpolation for pulse effect
//   const scale = pulseAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.95, 1.05],
//   });

//   return (
//     <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#420f54' }}>
//       {/* Light status bar style */}
//       <StatusBar style='light' />

//       {/* Main container with centered animation and rings */}
//       <View className="relative justify-center items-center" style={{ width: hp(50), height: hp(50) }}>
//         {/* Larger outer ring with rotation and pulse - no blinking */}
//         <Animated.View
//           className="absolute rounded-full"
//           style={{
//             width: hp(32),
//             height: hp(32),
//             backgroundColor: 'rgba(103,62,118,255)', // Consistent brightness
//             transform: [
//               { rotate: rotation },
//               { scale: scale }
//             ],
//             zIndex: 1
//           }}
//         />

//         {/* Smaller inner ring with reverse rotation - no blinking */}
//         <Animated.View
//           className="absolute rounded-full"
//           style={{
//             width: hp(26),
//             height: hp(26),
//             backgroundColor: 'rgba(133,100,145,255)', // Consistent brightness
//             transform: [
//               { rotate: reverseRotation },
//               { scale: scale }
//             ],
//             zIndex: 2
//           }}
//         />

//         {/* Lottie animation centered in the middle */}
//         <View className="absolute justify-center items-center z-10">
//           <LottieView
//             ref={animationRef} // Reference to control animation
//             source={require('../assets/splash1.json')} // Lottie animation file
//             autoPlay // Automatically play animation
//             loop // Keep looping the animation
//             style={{ width: hp(40), height: hp(40) }}
//           />
//         </View>
//       </View>

//       {/* Animated title and punchline - both animating from bottom to top */}
//       <View className="flex items-center space-y-2 mt-10">
//         <Animated.Text
//           className="font-bold text-white tracking-widest text-6xl"
//           style={{
//             opacity: titleFadeAnim,
//             transform: [
//               { translateY: titleFadeAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [30, 0] // Move from below to current position
//                 })
//               }
//             ]
//           }}
//         >
//           SLOTZI
//         </Animated.Text>
//         <Animated.Text
//           className="font-medium text-white tracking-widest text-lg"
//           style={{
//             opacity: subtitleFadeAnim,
//             transform: [
//               { translateY: subtitleFadeAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [20, 0] // Move from below to current position
//                 })
//               }
//             ]
//           }}
//         >
//         "Your Perfect Slot, Just a Tap Away."
//         </Animated.Text>
//       </View>
//     </View>
//   );
// }

import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  console.log("DEBUG: Index component mounted");

  useEffect(() => {
    console.warn("DEBUG: Index useEffect triggered");
  }, []);

  const handleGoToFloorPlan = () => {
    console.log("Navigating to FloorPlan...");
    router.push("/floorPlan");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Reservation App</Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleGoToFloorPlan}
      >
        <Text style={styles.buttonText}>Go to Floor Plan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#420F54",
  },
  button: {
    backgroundColor: "#420F54",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    shadowColor: "#420F54",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
});
