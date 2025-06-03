import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../src/util/AuthContext";
import Constants from "expo-constants";

const { CLIENT_IP } = Constants.expoConfig.extra;

// EDIT THIS WITH EVERY NEW SESSION YOU WORK
const API_BASE_URL = `http://${CLIENT_IP}:3005`;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(false);

  const navigation = useNavigation();
  const { login, isAuthenticated, isFullyRegistered } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isFullyRegistered) {
      navigation.navigate("Rides");
    }
  }, [isAuthenticated, isFullyRegistered]);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (otp.length === 6 && otpSent) {
      verifyOtp();
    }
  }, [otp]);

  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith("1")) {
      return `+${digits}`;
    }
    return `+${digits}`;
  };

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

  const sendOtp = async () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setResendCountdown(60);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const response = await fetch(`${API_BASE_URL}/send-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        console.log("Verification sent:", data);
      } else {
        throw new Error(data.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setResendCountdown(0);

      if (error.message.includes("trial account")) {
        alert(
          "This phone number needs to be verified in your Twilio account first (trial limitation)."
        );
      } else if (error.message.includes("Invalid phone number")) {
        alert("Please enter a valid phone number.");
      } else if (error.message.includes("Too many requests")) {
        alert("Too many requests. Please wait a moment and try again.");
      } else if (error.message.includes("Max send attempts")) {
        alert(
          "Maximum verification attempts reached for this number. Please try again later."
        );
      } else {
        alert("Failed to send verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const response = await fetch(`${API_BASE_URL}/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          code: otp,
        }),
      });

      const data = await response.json();
      const firebaseNumberFormat = formattedPhone.slice(2);

      if (data.success) {
        console.log("Verification successful:", data);

        await login(firebaseNumberFormat);

        if (data.userExists && data.userData) {
          // Existing user with complete profile
          alert(`Welcome back ${data.userData.fname} ${data.userData.lname}!`);
          navigation.navigate("Rides");
        } else {
          // New user or incomplete profile
          navigation.navigate("Profile SignUp", {
            phoneNumber: firebaseNumberFormat,
            isEdit: false,
          });
        }
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification failed:", error);

      // Handle specific verification errors
      if (error.message.includes("Invalid verification code")) {
        alert("Incorrect code. Please try again.");
      } else if (error.message.includes("not found or expired")) {
        alert("Verification code has expired. Please request a new one.");
        handleExpiredCode();
      } else if (error.message.includes("Max verification attempts")) {
        alert("Too many incorrect attempts. Please request a new code.");
        handleExpiredCode();
      } else if (error.message.includes("No pending verification")) {
        alert("No verification found. Please request a new code.");
        handleExpiredCode();
      } else {
        alert("Verification failed. Please try again.");
      }

      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleExpiredCode = () => {
    setOtpSent(false);
    setOtp("");
    setResendCountdown(0);
  };

  const resendOtp = () => {
    if (resendCountdown === 0) {
      setOtp("");
      setOtpSent(false);
      sendOtp();
    }
  };

  // SCREEN: phone number input
  if (!otpSent) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          To get started, enter your mobile number.
        </Text>
        <Text style={styles.subtitle}>
          We'll send you a verification code to confirm it's you.
        </Text>

        <TextInput
          placeholder="(123) 456-7890"
          style={styles.input}
          onChangeText={(text) => {
            const formatted = formatPhoneDisplay(text);
            setPhoneNumber(formatted);
          }}
          value={phoneNumber}
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={14} // (XXX) XXX-XXXX format
        />

        <Pressable
          onPress={sendOtp}
          style={[styles.loginButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Sending..." : "Send Code"}
          </Text>
        </Pressable>
      </View>
    );
  }

  // SCREEN: verification code input
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Phone</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {phoneNumber}
      </Text>

      <TextInput
        placeholder="123456"
        style={[styles.input, styles.otpInput]}
        onChangeText={setOtp}
        value={otp}
        keyboardType="numeric"
        maxLength={6}
        autoComplete="sms-otp"
        autoFocus={true}
      />

      {loading && <Text style={styles.verifyingText}>Verifying...</Text>}

      <Pressable
        onPress={resendOtp}
        style={[
          styles.resendButton,
          resendCountdown > 0 && styles.disabledButton,
        ]}
        disabled={resendCountdown > 0}
      >
        <Text
          style={[
            styles.resendText,
            resendCountdown > 0 && styles.disabledText,
          ]}
        >
          {resendCountdown > 0
            ? `Resend code in ${resendCountdown}s`
            : "Resend code"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          setOtpSent(false);
          setOtp("");
          setResendCountdown(0);
        }}
        style={styles.changeNumberButton}
      >
        <Text style={styles.changeNumberText}>Change phone number</Text>
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
