import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../src/util/AuthContext";

const Profile = () => {
  const gradeOptions = ["Freshman", "Sophomore", "Junior", "Senior"];
  const addressOptions = [
    { label: "Hill (De Neve Turn Around)", value: "Hill" },
    { label: "Apartment (Enter Address)", value: "Apartment" },
  ];
  const [customAddress, setCustomAddress] = useState("");

  const [newFname, setFname] = useState("");
  const [newLname, setLname] = useState("");
  const [newGrade, setGrade] = useState("");
  const [newAddress, setAddress] = useState("");

  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber, isEdit } = route.params;
  const { login } = useAuth();

  const createUser = async () => {
    const finalAddress =
      newAddress === "Apartment" ? customAddress : newAddress;

    await setDoc(
      doc(db, "users", phoneNumber),
      {
        fname: newFname,
        lname: newLname,
        grade: newGrade,
        address: finalAddress,
      },
      { merge: true }
    );

    const rideCollections = [
      "Friday Passengers",
      "Friday Drivers",
      "Sunday Passengers",
      "Sunday Drivers",
    ];

    // Loop and update user data in each ride record
    for (const collection of rideCollections) {
      const ref = doc(db, collection, phoneNumber);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        await setDoc(
          ref,
          {
            fname: newFname,
            lname: newLname,
            grade: newGrade,
            address: finalAddress,
          },
          { merge: true }
        );
      }
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const docRef = doc(db, "users", phoneNumber);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFname(data.fname || "");
          setLname(data.lname || "");
          setGrade(data.grade || "");
          if (data.address === "Hill") {
            setAddress("Hill");
          } else {
            setAddress("Apartment");
            setCustomAddress(data.address || "");
          }
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    loadUserData();
  }, [phoneNumber]);

  useEffect(() => {
    if (!isEdit) {
      navigation.setOptions({
        gestureEnabled: false,
        headerLeft: () => null,
      });
      const parentNav = navigation.getParent(); // this is the drawer nav

      if (parentNav) {
        parentNav.setOptions({
          swipeEnabled: false, // disables swipe-to-open
        });
      }

      return () => {
        if (parentNav) {
          parentNav.setOptions({
            swipeEnabled: true,
          });
        }
      };
    }
  }, [navigation, isEdit]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={80}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEdit ? "Edit Your Profile" : "Welcome! Let's get to know you"}
          </Text>
          <Text style={styles.subtitle}>
            {isEdit
              ? "Update your information below"
              : "Please fill out your information to get started"}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              First Name<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              placeholder="Enter your first name"
              style={styles.input}
              value={newFname}
              onChangeText={setFname}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Last Name<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              placeholder="Enter your last name"
              style={styles.input}
              value={newLname}
              onChangeText={setLname}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Phone Number<Text style={styles.required}> *</Text>
            </Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{phoneNumber || ""}</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Grade<Text style={styles.required}> *</Text>
            </Text>
            <View style={styles.radioGroup}>
              {gradeOptions.map((g) => (
                <Pressable
                  key={g}
                  style={[
                    styles.radioOption,
                    newGrade === g && styles.radioOptionSelected,
                  ]}
                  onPress={() => setGrade(g)}
                >
                  <View style={styles.radioRow}>
                    <View
                      style={[
                        styles.radioButton,
                        newGrade === g && styles.radioButtonSelected,
                      ]}
                    >
                      {newGrade === g && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        newGrade === g && styles.radioTextSelected,
                      ]}
                    >
                      {g}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📍</Text>
            <Text style={styles.cardTitle}>Pickup Location</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Address<Text style={styles.required}> *</Text>
            </Text>
            <View style={styles.radioGroup}>
              {addressOptions.map((a) => (
                <Pressable
                  key={a.value}
                  style={[
                    styles.radioOption,
                    newAddress === a.value && styles.radioOptionSelected,
                  ]}
                  onPress={() => setAddress(a.value)}
                >
                  <View style={styles.radioRow}>
                    <View
                      style={[
                        styles.radioButton,
                        newAddress === a.value && styles.radioButtonSelected,
                      ]}
                    >
                      {newAddress === a.value && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        newAddress === a.value && styles.radioTextSelected,
                      ]}
                    >
                      {a.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {newAddress === "Apartment" && (
              <View style={styles.customAddressContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your apartment address"
                  placeholderTextColor="#9ca3af"
                  value={customAddress}
                  onChangeText={setCustomAddress}
                />
              </View>
            )}
          </View>
        </View>

        <Pressable
          onPress={async () => {
            if (!newFname.trim()) {
              alert("First name is required.");
              return;
            }
            if (!newLname.trim()) {
              alert("Last name is required.");
              return;
            }
            if (!newGrade) {
              alert("Please select your grade.");
              return;
            }
            if (
              !newAddress ||
              (newAddress === "Apartment" && !customAddress.trim())
            ) {
              alert("Please provide your address.");
              return;
            }
            await createUser();
            await login(phoneNumber);
            navigation.navigate("Rides");
          }}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>
            {isEdit ? "Save Changes" : "Create Profile"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#dc2626",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
  },
  readOnlyField: {
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  readOnlyText: {
    fontSize: 16,
    color: "#6b7280",
  },
  radioGroup: {
    gap: 8,
  },
  radioOption: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
  },
  radioOptionSelected: {
    backgroundColor: "#eef2ff",
    borderColor: "#4f46e5",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: "#4f46e5",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#4f46e5",
  },
  radioText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  radioTextSelected: {
    color: "#4f46e5",
    fontWeight: "600",
  },
  customAddressContainer: {
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 12,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Profile;
