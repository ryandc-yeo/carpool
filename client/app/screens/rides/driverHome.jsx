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
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Pressable style={styles.viewAllButton} onPress={handleAllRides}>
          <Text style={styles.viewAllText}>View All Rides</Text>
        </Pressable>
      </View>
      
      <Text style={styles.header}>Your Passengers</Text>
      {passengers.map((p, index) => (
        <View key={index} style={styles.textBox}>
          <Text style={styles.name}>
            {p.fname} {p.lname}
          </Text>
          <Text style={styles.address}>{p.address || "No address"} || {p.phoneNumber}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pickup time"
            value={pickupTimes[p.phoneNumber] || ""}
            onChangeText={(text) => handleTimeChange(p.phoneNumber, text)}
          />
          <Text style={styles.status}>
            Acknowledged: {p.acknowledged ? "YES" : "NO"}
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
    padding: 10,
  },
  viewAllText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textBox: {
    backgroundColor: '#e4f1ee',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    alignSelf: 'stretch'
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    marginTop: 4,
    fontStyle: "italic",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
  },
  status: {
    marginTop: 10,
    fontWeight: "600",
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
});

export default DriverHome;
