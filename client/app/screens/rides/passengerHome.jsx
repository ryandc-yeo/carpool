import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../src/firebase-config";

const PassengerHome = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params || {};
  const [passengerData, setPassengerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.navigate("Rides", { phoneNumber: phoneNumber });
  };

  const handleAllRides = () => {
    navigation.navigate("Ride Details", { phoneNumber: phoneNumber, role: "Passenger" });
  }

  const handleEditSignUp = () => {
    navigation.navigate("Rides SignUp", { phoneNumber: phoneNumber });
  }

  const fetchPassengerData = async () => {
    const passengerRef = doc(db, "Sunday Passengers", phoneNumber);
    const passengerSnap = await getDoc(passengerRef);

    if (passengerSnap.exists()) {
      const data = passengerSnap.data();
      setPassengerData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPassengerData();
  }, []);

  const acknowledgePickup = async () => {
    const passengerRef = doc(db, "Sunday Passengers", phoneNumber);

    await updateDoc(passengerRef, {
      acknowledged: true,
    });

    const driverPhone = passengerData.driver?.phoneNumber;
    if (driverPhone) {
      const driverRef = doc(db, "Sunday Drivers", driverPhone);
      const driverSnap = await getDoc(driverRef);

      if (driverSnap.exists()) {
        const updatedPassengers = driverSnap
          .data()
          .passengers.map((p) =>
            p.phoneNumber === phoneNumber ? { ...p, acknowledged: true } : p
          );

        await updateDoc(driverRef, { passengers: updatedPassengers });
      }
    }

    setPassengerData((prev) => ({ ...prev, acknowledged: true }));
    alert("Pickup time acknowledged!");
  };

  if (loading || !passengerData) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { fname, lname, address, pickupTime, acknowledged, driver } =
    passengerData;

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

      <Text style={styles.header}>
        Welcome {fname} {lname}!
      </Text>

      
      {driver ? (
        <>
        <Text style={styles.sectionTitle}>Car Details for (INSERT DATE):</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Driver Information</Text>
          <Text style={styles.cardText}>Name: {driver.fname} {driver.lname}</Text>
          <Text style={styles.cardText}>Phone Number: {driver.phoneNumber}</Text>

          <Text style={[styles.cardTitle, { marginTop: 16 }]}>Pickup Information</Text>
          <Text style={styles.cardText}>
            Pickup Time: {pickupTime || "Not yet assigned"}
          </Text>
          <Text style={styles.cardText}>
            {address ? `Location: ${address}` : "Pickup location not available yet."}
          </Text>
        </View>
                    
        {pickupTime && !acknowledged && (
            <Pressable style={styles.button} onPress={acknowledgePickup}>
              <Text style={styles.buttonText}>Acknowledge Pickup Time</Text>
            </Pressable>
          )}

          {!acknowledged && (
            <Text style={styles.text}>
              *If you don't confirm by (insert time), your ride may be replaced.
            </Text>
          )}

          {acknowledged && (
            <Text style={styles.confirmation}>
              Thank you. You have acknowledged your pickup time.
            </Text>
          )}

        </>

      ) : (
        <>
          <Text style={styles.subtitle}>Car assignments have not been released yet.</Text>
          <Text style={styles.text}>Please check back later for your pickup details! Rides are tentatively updated weekly at 8:00am Friday morning and 6:00pm Saturday night.</Text>

        </>
      )}
      <Pressable style={styles.button} onPress={handleEditSignUp}>
        <Text style={styles.buttonText}>Edit Sign Up</Text>
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
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 12,
  },
  confirmation: {
    marginTop: 20,
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10, 
    marginTop: 10,
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  }, 
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  sectionTitle: {
  fontSize: 20,
  fontWeight: "600",
  marginTop: 10,
  marginBottom: 12,
  color: "#333",
  },

  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    marginBottom: 16,
    width: "100%",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },

  cardText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },

});

export default PassengerHome;
