import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../src/firebase-config";

const DriverHome = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { phoneNumber } = route.params || {};
  const [passengers, setPassengers] = useState([]);
  const [pickupTimes, setPickupTimes] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  

  const handleGoBack = () => {
    navigation.navigate("Rides", { phoneNumber: phoneNumber });
  };

  const handleAllRides = () => {
    navigation.navigate("Ride Details", { phoneNumber: phoneNumber, role: "Driver" });
  }

  useEffect(() => {
    const loadDriverInfo = async () => {
      const driverRef = doc(db, "Sunday Drivers", phoneNumber);
      const driverSnap = await getDoc(driverRef);

      if (driverSnap.exists()) {
        const data = driverSnap.data();
        setPassengers(data.passengers || []);
        setPickupTimes(
          Object.fromEntries(
            (data.passengers || []).map((p) => [
              p.phoneNumber,
              p.pickupTime || "",
            ])
          )
        );
      }
    };

    loadDriverInfo();
  }, []);

  const handleTimeChange = (phone, time) => {
    setPickupTimes((prev) => ({ ...prev, [phone]: time }));
  };

  const handleSubmitTimes = async () => {
    const updatedPassengers = passengers.map((p) => ({
      ...p,
      pickupTime: pickupTimes[p.phoneNumber] || "",
      acknowledged: false,
    }));

    await updateDoc(doc(db, "Sunday Drivers", phoneNumber), {
      passengers: updatedPassengers,
    });

    for (const p of updatedPassengers) {
      await updateDoc(doc(db, "Sunday Passengers", p.phoneNumber), {
        pickupTime: p.pickupTime,
        acknowledged: false,
      });
    }

    alert("Pickup times saved!");
    setPassengers(updatedPassengers);
    setHasSubmitted(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Pressable style={styles.viewAllButton} onPress={handleAllRides}>
          <Text style={styles.buttonText}>View All Rides</Text>
        </Pressable>
      </View>
      
      <Text style={styles.header}>Your Passengers</Text>
      {hasSubmitted && (
        <View style={styles.submissionBanner}>
          <Text style={styles.submissionText}>Pickup times submitted successfully.</Text>
        </View>
      )}

      {passengers.map((p, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>
            {p.fname} {p.lname}
          </Text>

          <Text style={styles.cardText}>
            <Text style={{ fontWeight: "600" }}>Address:</Text> {p.address || "Not provided"}
          </Text> 
          <Text style={styles.cardText}>
            <Text style={{ fontWeight: "600" }}>Phone:</Text> {p.phoneNumber}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter pickup time"
            placeholderTextColor="#D3D3D3" //
            value={pickupTimes[p.phoneNumber] || ""}
            onChangeText={(text) => handleTimeChange(p.phoneNumber, text)}
          />

          <Text style={[styles.cardText, { marginTop: 10 }]}>
            Acknowledged:{" "}
            <Text style={{ color: p.acknowledged ? "#228B22" : "#cc0000", fontWeight: "600" }}>
              {p.acknowledged ? "YES" : "NO"}
            </Text>
          </Text>
        </View>
      ))}

      <Pressable style={styles.button} onPress={handleSubmitTimes}>
        <Text style={styles.buttonText}>Submit Pickup Times</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  viewAllButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    width: "100%",
    backgroundColor: "white",
    fontSize: 15,
    marginTop: 4,
  },
  
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },

  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.01,
    shadowRadius: 5,
    marginBottom: 16,
    width: "100%",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },

  cardText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },

  submissionBanner: {
    backgroundColor: "#e6f4ea",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },
  submissionText: {
    color: "#2c662d",
    fontWeight: "600",
    fontSize: 14,
  }
});

export default DriverHome;
