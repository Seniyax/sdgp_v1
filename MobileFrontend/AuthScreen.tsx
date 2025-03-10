"use client"

import { useState } from "react"
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import SignInForm from "./SignInForm"
import SignUpForm from "./SignUpForm"

// Color scheme based on #420E54 (deep purple)
const COLORS = {
  primary: "#420E54", // Deep purple
  secondary: "#6A1B9A", // Lighter purple
  accent: "#9C27B0", // Vibrant purple
  background: "#F8F5FB", // Light lavender background
  text: "#2D0A3E", // Dark purple text
  white: "#FFFFFF",
  lightGray: "#F0F0F7",
  error: "#D32F2F",
}

const AuthScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("signin")

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header with gradient */}
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

          <View style={styles.iconButton} />
        </View>
      </LinearGradient>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "signin" && styles.activeTab]}
          onPress={() => setActiveTab("signin")}
        >
          <Text style={[styles.tabText, activeTab === "signin" && styles.activeTabText]}>SIGN IN</Text>
          {activeTab === "signin" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "signup" && styles.activeTab]}
          onPress={() => setActiveTab("signup")}
        >
          <Text style={[styles.tabText, activeTab === "signup" && styles.activeTabText]}>SIGN UP</Text>
          {activeTab === "signup" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.formContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    opacity: 0.6,
    letterSpacing: 1,
  },
  activeTabText: {
    color: COLORS.primary,
    opacity: 1,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: "40%",
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
})

export default AuthScreen

