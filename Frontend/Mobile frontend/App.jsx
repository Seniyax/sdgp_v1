import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function App() {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/1198/1198321.png",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Main Content */}
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.emailButton}>
            <Text style={styles.emailButtonText}>Sign up with email</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or use social sign up</Text>

          {/* Social Buttons */}
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="google" size={20} color="#db4437" style={styles.icon} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Icon
              name="facebook-square"
              size={20}
              color="#4267B2"
              style={styles.icon}
            />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Icon name="apple" size={20} color="#000" style={styles.icon} />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Footer Text */}
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.signInText}>Sign in</Text>
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
  },
  emailButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
    width: "85%",
  },
  emailButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "#888",
    marginVertical: 10,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "85%",
    elevation: 2,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  icon: {
    width: 20,
  },
  footerText: {
    marginTop: 20,
    color: "#888",
    fontSize: 14,
  },
  signInText: {
    color: "#4b9cd3",
    textDecorationLine: "underline",
  },
});
