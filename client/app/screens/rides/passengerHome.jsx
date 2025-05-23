import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../src/firebase-config";

const PassengerHome = () => {
  const navigation = useNavigation();
  const { phoneNumber } = useRoute().params;
  const [passengerData, setPassengerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.navigate("Rides", { phoneNumber });
  };

  const fetchPassengerData = async () => {
    const passengerRef = doc(db, "Sunday Passengers", phoneNumber);
    const passengerSnap = await getDoc(passengerRef);

    if (passengerSnap.exists()) {
      setPassengerData(passengerSnap.data());
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
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>← Back to Rides Home</Text>
      </Pressable>
      <Text style={styles.header}>
        Welcome {fname} {lname}
      </Text>
      <Text style={styles.info}>Your Address: {address}</Text>

      {driver ? (
        <>
          <Text style={styles.info}>
            Your Driver: {driver.fname} {driver.lname}
          </Text>
          <Text style={styles.info}>
            Pickup Time: {pickupTime || "Not yet assigned"}
          </Text>
        </>
      ) : (
        <Text style={styles.info}>No driver assigned yet.</Text>
      )}

      {pickupTime && !acknowledged && (
        <Pressable
          title="Acknowledge Pickup Time"
          onPress={acknowledgePickup}
        />
      )}

      {acknowledged && (
        <Text style={styles.confirmation}>
          Thank you. You have acknowledged your pickup time.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 10,
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
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
});

export default PassengerHome;
