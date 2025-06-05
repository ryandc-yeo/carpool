import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import db from "../../src/firebase-config";

const PassengerHome = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params || {};
  const [ridesGenerated, setRidesGenerated] = useState(false);
  const [passengerData, setPassengerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.navigate("Rides", { phoneNumber: phoneNumber });
  };

  const handleAllRides = () => {
    navigation.navigate("Ride Details", {
      phoneNumber: phoneNumber,
      role: "Passenger",
    });
  };

  const handleEditSignUp = () => {
    navigation.navigate("Rides SignUp", { phoneNumber: phoneNumber });
  };

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
    if (!phoneNumber) return;

    const unsubscribe = onSnapshot(
      doc(db, "Sunday Passengers", phoneNumber),
      (docSnap) => {
        if (docSnap.exists()) {
          setPassengerData(docSnap.data());
        } else {
          setPassengerData(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [phoneNumber]);

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

  const {
    fname = "",
    lname = "",
    address = "",
    pickupTime = "",
    acknowledged = false,
    driver = null,
  } = passengerData || {};

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
          <Pressable style={styles.viewAllButton} onPress={handleAllRides}>
            <Text style={styles.viewAllButtonText}>View All Rides</Text>
          </Pressable>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeName}>
            {fname} {lname}
          </Text>
        </View>
      </View>

      {driver && ridesGenerated ? (
        <>
          {acknowledged ? (
            <View style={styles.successBanner}>
              <Text style={styles.successIcon}>✅</Text>
              <View style={styles.bannerContent}>
                <Text style={styles.successTitle}>All Set!</Text>
                <Text style={styles.successText}>
                  You&apos;ve confirmed your pickup time
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.warningBanner}>
              <Text style={styles.warningIcon}>⏰</Text>
              <View style={styles.bannerContent}>
                <Text style={styles.warningTitle}>Action Needed</Text>
                <Text style={styles.warningText}>
                  Please confirm your pickup time below
                </Text>
              </View>
            </View>
          )}

          <View style={styles.rideCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Your Ride Details</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Driver</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>
                  {driver.fname} {driver.lname}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{driver.phoneNumber}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Pickup Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Time:</Text>
                <Text
                  style={[
                    styles.infoValue,
                    !pickupTime && styles.unassignedText,
                  ]}
                >
                  {pickupTime || "Not yet assigned"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>
                  {address || "Pickup location not available yet"}
                </Text>
              </View>
            </View>
          </View>

          {!acknowledged && (
            <View style={styles.actionSection}>
              <Pressable
                style={[
                  styles.confirmButton,
                  !pickupTime && styles.disabledButton,
                ]}
                onPress={acknowledgePickup}
                disabled={!pickupTime}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    !pickupTime && styles.disabledButtonText,
                  ]}
                >
                  {pickupTime
                    ? "Confirm Pickup Time"
                    : "Waiting for Pickup Assignment"}
                </Text>
              </Pressable>

              <View style={styles.reminderCard}>
                <Text style={styles.reminderIcon}>⚠️</Text>
                <Text style={styles.reminderText}>
                  Please confirm your pickup time to secure your spot.
                  Unconfirmed rides may be reassigned.
                </Text>
              </View>
            </View>
          )}
        </>
      ) : ridesGenerated ? (
        // Waitlist State
        <View style={styles.waitlistCard}>
          <Text style={styles.waitlistIcon}>⏳</Text>
          <View style={styles.waitlistContent}>
            <Text style={styles.waitlistTitle}>
              You&apos;re on the Waitlist
            </Text>
            <Text style={styles.waitlistText}>
              We&apos;ll notify you if a spot opens up. Thank you for your
              patience!
            </Text>
          </View>
        </View>
      ) : (
        // Assignment Pending State
        <View style={styles.assignmentCard}>
          \
          <View style={styles.assignmentContent}>
            <Text style={styles.assignmentTitle}>
              We&apos;re Organizing Rides!
            </Text>
            <Text style={styles.assignmentText}>
              Car assignments haven&apos;t been released yet. Check back later
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

      {ridesGenerated ? (
        ""
      ) : (
        <View style={styles.bottomSection}>
          <Pressable
            style={[
              styles.editButton,
              ridesGenerated && styles.disabledEditButton,
            ]}
            onPress={handleEditSignUp}
            disabled={ridesGenerated}
          >
            <Text
              style={[
                styles.editButtonText,
                ridesGenerated && styles.disabledEditButtonText,
              ]}
            >
              Edit Your Sign Up
            </Text>
            {ridesGenerated && (
              <Text style={styles.editButtonSubtext}>
                Rides have been assigned
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
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
  successBanner: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 12,
    padding: 16,
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  successIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  bannerContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#065f46",
    marginBottom: 2,
  },
  successText: {
    fontSize: 14,
    color: "#047857",
  },
  warningBanner: {
    backgroundColor: "#fef3f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 16,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 2,
  },
  warningText: {
    fontSize: 14,
    color: "#7f1d1d",
  },
  rideCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
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
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    width: 80,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#1a1a1a",
    flex: 1,
    fontWeight: "500",
  },
  unassignedText: {
    color: "#f59e0b",
    fontStyle: "italic",
  },
  actionSection: {
    margin: 20,
  },
  confirmButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#e5e7eb",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
  reminderCard: {
    backgroundColor: "#fef3f2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  reminderIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  reminderText: {
    fontSize: 14,
    color: "#7f1d1d",
    flex: 1,
    lineHeight: 20,
  },
  waitlistCard: {
    backgroundColor: "#fefbf3",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  waitlistIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 4,
  },
  waitlistContent: {
    flex: 1,
  },
  waitlistTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ea580c",
    marginBottom: 8,
  },
  waitlistText: {
    fontSize: 16,
    color: "#9a3412",
    lineHeight: 22,
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
  bottomSection: {
    margin: 20,
  },
  editButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledEditButton: {
    backgroundColor: "#f3f4f6",
    borderColor: "#d1d5db",
  },
  editButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledEditButtonText: {
    color: "#9ca3af",
  },
  editButtonSubtext: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },
});

export default PassengerHome;
