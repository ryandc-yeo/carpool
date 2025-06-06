import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../src/util/AuthContext";

const saveToken = async (token) => {
  await SecureStore.setItemAsync("userToken", token);
};

const PhoneVerification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;
  const { login } = useAuth();

  useEffect(() => {
    if (verificationCode.length === 6) {
      handleVerification();
    }
  }, [verificationCode]);

  const handleVerification = async () => {
    const regex = /^\d{6}$/;
    if (regex.test(verificationCode)) {
      // verify code with backend

      try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));

        if (userDoc.exists()) {
          alert(
            "Welcome " + userDoc.data().fname + " " + userDoc.data().lname + "!"
          );
          await login(phoneNumber);
          navigation.navigate("Rides");
        } else {
          alert("Verification code pressed with code: " + verificationCode);
          navigation.navigate("Profile SignUp", {
            phoneNumber: phoneNumber,
            isEdit: false,
          });
        }
      } catch (err) {
        console.error("Error checking Firestore: ", err);
        alert("Something wrong. Please try again.");
      }
    } else {
      alert("Please enter a valid six-digit verification code");
      setVerificationCode("");
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Phone</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to:</Text>
      <Text style={styles.subtitleNum}>{phoneNumber}</Text>

      <TextInput
        placeholder="------"
        style={[styles.input, styles.otpInput]}
        onChangeText={setVerificationCode}
        value={verificationCode}
        keyboardType="numeric"
        maxLength={6}
        autoComplete="sms-otp"
        autoFocus={true}
      />

      <Pressable
        onPress={() => {
          setVerificationCode("");
          navigation.navigate("Login");
        }}
        style={styles.changeNumberButton}
      >
        <Text style={styles.changeNumberText}>Change phone number</Text>
      </Pressable>

      {/* <Pressable
        onPress={handleVerification}
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
      </Pressable> */}
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>
  //       Please enter the six-digit code sent to {phoneNumber}
  //     </Text>
  //     <TextInput
  //       placeholder="000000"
  //       style={styles.input}
  //       onChangeText={(text) => setVerificationCode(text)}
  //       keyboardType="numeric"
  //     />
  // <Pressable
  //   onPress={() => handleVerification()}
  //   style={styles.loginButton}
  // >
  //   <Text style={styles.loginButtonText}>Next</Text>
  // </Pressable>
  //   </View>
  // );
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
  subtitleNum: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
    fontWeight: "bold",
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

export default PhoneVerification;
