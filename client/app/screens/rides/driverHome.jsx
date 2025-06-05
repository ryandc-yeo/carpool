import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import db from "../../src/firebase-config";

const DriverHome = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { phoneNumber, day} = route.params || {};
  const [passengers, setPassengers] = useState([]);
  const [pickupTimes, setPickupTimes] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [ridesGenerated, setRidesGenerated] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.navigate("Rides", { phoneNumber: phoneNumber, });
  };

  const handleAllRides = () => {
    navigation.navigate("Ride Details", { phoneNumber: phoneNumber, role: "Driver", day: day});
  }

  const fetchDriverData = async () => {
    const driverRef = doc(db, `${day} Drivers`, phoneNumber);
    const driverSnap = await getDoc(driverRef);

    if (driverSnap.exists()) {
      const data = driverSnap.data();
      setDriverData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!phoneNumber || !day) return;

    const unsubscribe = onSnapshot(doc(db, `${day} Drivers`, phoneNumber), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDriverData(data);
        setPassengers(data.passengers || []);
        setPickupTimes(
          Object.fromEntries(
            (data.passengers || []).map((p) => [
              p.phoneNumber,
              p.pickupTime || "",
            ])
          )
        );
      } else {
        setDriverData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [phoneNumber, day]);

  useFocusEffect(
    useCallback(() => {
      const configRef = doc(db, "meta", "config");

      const unsubscribe = onSnapshot(configRef, (configSnap) => {
        const ridesGenerated =
          configSnap.exists() && configSnap.data().ridesGenerated;
        setRidesGenerated(ridesGenerated);
      });

      return () => unsubscribe();
    }, [])
  );

  const handleTimeChange = (phone, time) => {
    setPickupTimes((prev) => ({ ...prev, [phone]: time }));
  };

  const handleSubmitTimes = async () => {
    const updatedPassengers = passengers.map((p) => ({
      ...p,
      pickupTime: pickupTimes[p.phoneNumber] || "",
      acknowledged: false,
    }));

    await updateDoc(doc(db, `${day} Drivers`, phoneNumber), {
      passengers: updatedPassengers,
    });

    for (const p of updatedPassengers) {
      await updateDoc(doc(db, `${day} Drivers`, p.phoneNumber), {
        pickupTime: p.pickupTime,
        acknowledged: false,
      });
    }

    alert("Pickup times saved!");
    setPassengers(updatedPassengers);
    setHasSubmitted(true);
  };

  if (loading || !driverData) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const {
    fname = "",
    lname = "",
  } = driverData || {};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>
          {ridesGenerated && 
            <Pressable style={styles.viewAllButton} onPress={handleAllRides}>
              <Text style={styles.viewAllButtonText}>View All Rides</Text>
            </Pressable>
          }
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeName}>
            {fname} {lname}
          </Text>
        </View>
      </View>

      {ridesGenerated ? (
        <>
          <Text style={styles.header}>Your Passengers for {day}</Text>
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
        </>
      ) : (
        // Assignment Pending State
        <View style={styles.assignmentCard}>
          <View style={styles.assignmentContent}>
            <Text style={styles.assignmentTitle}>
              We&apos;re Organizing Rides!
            </Text>
            <Text style={styles.assignmentText}>
              Thanks for signing up! Car assignments haven&apos;t been released yet. Please check back later
              for your pickup details!
            </Text>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>Typical Update Schedule:</Text>
              <Text style={styles.scheduleItem}>
                • Friday mornings at 8:00 AM
              </Text>
              <Text style={styles.scheduleItem}>
                • Saturday evenings at 6:00 PM
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#4f46e5",
    fontWeight: "600",
  },
  viewAllButton: {
    backgroundColor: "#374151",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewAllButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  welcomeSection: {
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
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
  },
  assignmentCard: {
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  assignmentIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 4,
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 8,
  },
  assignmentText: {
    fontSize: 16,
    color: "#0c4a6e",
    lineHeight: 22,
    marginBottom: 16,
  },
  scheduleInfo: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    marginBottom: 8,
  },
  scheduleItem: {
    fontSize: 13,
    color: "black",
    marginBottom: 4,
  },
});

export default DriverHome;
