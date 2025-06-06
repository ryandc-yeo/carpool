import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import db from "../../src/firebase-config";

const DriverHome = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber, day } = route.params || {};
  const [passengers, setPassengers] = useState([]);
  const [pickupTimes, setPickupTimes] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [ridesGenerated, setRidesGenerated] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.navigate("Rides", { phoneNumber: phoneNumber });
  };

  const handleAllRides = () => {
    navigation.navigate("Ride Details", {
      phoneNumber: phoneNumber,
      role: "Driver",
      day: day,
    });
  };

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

    const unsubscribe = onSnapshot(
      doc(db, `${day} Drivers`, phoneNumber),
      (docSnap) => {
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
      }
    );

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
      await updateDoc(doc(db, `${day} Passengers`, p.phoneNumber), {
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

  const { fname = "", lname = "" } = driverData || {};

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
          {ridesGenerated && (
            <Pressable style={styles.viewAllButton} onPress={handleAllRides}>
              <Text style={styles.viewAllButtonText}>View All Rides</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.welcomeSection}>
          <View style={styles.driverBadge}>
            <Text style={styles.driverIcon}>🚗</Text>
            <Text style={styles.driverLabel}>Driver</Text>
          </View>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeName}>
            {fname} {lname}
          </Text>
        </View>
      </View>

      {ridesGenerated ? (
        <>
          {hasSubmitted && (
            <View style={styles.successBanner}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successText}>
                Pickup times submitted successfully!
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Your Passengers for {day} ({passengers.length})
              </Text>
            </View>

            {passengers.length > 0 ? (
              <View style={styles.passengersList}>
                {passengers.map((p, index) => (
                  <View key={index} style={styles.passengerCard}>
                    <View style={styles.passengerHeader}>
                      <View style={styles.passengerInfo}>
                        <Text style={styles.passengerName}>
                          {p.fname} {p.lname}
                        </Text>
                        <Text style={styles.passengerPhone}>
                          {p.phoneNumber}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          p.acknowledged
                            ? styles.statusBadgeSuccess
                            : styles.statusBadgeWarning,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            p.acknowledged
                              ? styles.statusTextSuccess
                              : styles.statusTextWarning,
                          ]}
                        >
                          {p.acknowledged ? "Confirmed" : "Pending"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timeSection}>
                      <Text style={styles.timeLabel}>Address:</Text>
                      <Text style={styles.passengerPhone}>
                        {p.address || "Address not provided"}
                      </Text>
                      <Text style={styles.addressText}></Text>
                    </View>

                    <View style={styles.timeSection}>
                      <Text style={styles.timeLabel}>Pickup Time:</Text>
                      <TextInput
                        style={styles.timeInput}
                        placeholder="Enter pickup time (e.g., 9:30 AM)"
                        placeholderTextColor="#9ca3af"
                        value={pickupTimes[p.phoneNumber] || ""}
                        onChangeText={(text) =>
                          handleTimeChange(p.phoneNumber, text)
                        }
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No passengers assigned</Text>
              </View>
            )}

            {passengers.length > 0 && (
              <Pressable
                style={styles.submitButton}
                onPress={handleSubmitTimes}
              >
                <Text style={styles.submitButtonText}>Submit Pickup Times</Text>
              </Pressable>
            )}
          </View>
        </>
      ) : (
        <View style={styles.pendingCard}>
          <View style={styles.pendingHeader}>
            <Text style={styles.pendingTitle}>
              We&apos;re Organizing Rides!
            </Text>
          </View>

          <Text style={styles.pendingText}>
            Thanks for signing up as a driver! Car assignments haven&apos;t been
            released yet. Your passengers will appear here once assignments are
            complete.
          </Text>

          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>Typical Update Schedule</Text>
            <View style={styles.scheduleItems}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleItemBullet}>•</Text>
                <Text style={styles.scheduleItemText}>
                  Friday mornings at 8:00 AM
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleItemBullet}>•</Text>
                <Text style={styles.scheduleItemText}>
                  Saturday evenings at 6:00 PM
                </Text>
              </View>
            </View>
          </View>
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
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
    alignItems: "center",
    marginBottom: 8,
  },
  driverBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  driverIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  driverLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
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
    textAlign: "center",
  },
  successBanner: {
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  successIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  successText: {
    color: "#166534",
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  passengersList: {
    gap: 16,
  },
  passengerCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  passengerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  passengerInitial: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  passengerPhone: {
    fontSize: 14,
    color: "#6b7280",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeSuccess: {
    backgroundColor: "#dcfce7",
  },
  statusBadgeWarning: {
    backgroundColor: "#fef3c7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextSuccess: {
    color: "#166534",
  },
  statusTextWarning: {
    color: "#92400e",
  },
  addressSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addressIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  addressText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
  },
  timeSection: {
    // Container for time input
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1a1a1a",
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  pendingCard: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pendingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pendingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  pendingText: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
    marginBottom: 20,
  },
  scheduleCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  scheduleItems: {
    gap: 8,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleItemBullet: {
    fontSize: 16,
    color: "#6b7280",
    marginRight: 8,
    width: 12,
  },
  scheduleItemText: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
});

export default DriverHome;
