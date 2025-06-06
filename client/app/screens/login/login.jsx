import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../src/util/AuthContext";

const Login = () => {
  const [pNumber, setPNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { phoneNumber, login } = useAuth();

  // Format phone number for display (XXX) XXX-XXXX
  const formatPhoneDisplay = (phone) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length >= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }
    return phone;
  };

  useEffect(() => {
    if (phoneNumber) {
      (async () => {
        const loggedIn = await login(phoneNumber);
        if (loggedIn) {
          navigation.navigate("Rides");
          setLoading(false);
        }
      })();
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (regex.test(pNumber)) {
      navigation.navigate("Phone Verification", { phoneNumber: pNumber });
    } else {
      alert("Please enter a valid phone number in the format (XXX) XXX-XXXX");
      setPNumber("");
      return;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        To get started, enter your mobile number.
      </Text>
      <Text style={styles.subtitle}>
        We&apos;ll send you a verification code to confirm it&apos;s you.
      </Text>

      <TextInput
        placeholder="(123) 456-7890"
        style={styles.input}
        onChangeText={(text) => {
          const formatted = formatPhoneDisplay(text);
          setPNumber(formatted);
        }}
        value={pNumber}
        keyboardType="phone-pad"
        autoComplete="tel"
        maxLength={14} // (XXX) XXX-XXXX format
      />

      <Pressable
        onPress={handleLogin}
        style={[styles.loginButton, loading && styles.disabledButton]}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? "Sending..." : "Send Code"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 50,
    marginTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 5,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 2,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  otpInput: {
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  resendButton: {
    padding: 15,
    marginBottom: 10,
  },
  resendText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  disabledText: {
    color: "#999",
  },
  changeNumberButton: {
    padding: 10,
  },
  changeNumberText: {
    color: "#666",
    fontSize: 14,
  },
  verifyingText: {
    color: "#007AFF",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default Login;
