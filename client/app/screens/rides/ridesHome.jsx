import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../src/util/AuthContext";

const RidesHome = () => {
  const navigation = useNavigation();
  const { phoneNumber, userData, goingFriday, goingSunday } = useAuth();

  const [fridayDate, setFridayDate] = useState("");
  const [sundayDate, setSundayDate] = useState("");
  const [ridesGenerated, setRidesGenerated] = useState(false);

  const handleSignUp = () => {
    navigation.navigate("Rides SignUp", { phoneNumber: phoneNumber });
  };

  const handleViewRide = async (day) => {
    const driverDoc = await getDoc(doc(db, `${day} Drivers`, phoneNumber));
    if (driverDoc.exists()) {
      navigation.navigate("Driver Home", { phoneNumber, day });
      return;
    }

    const passDoc = await getDoc(doc(db, `${day} Passengers`, phoneNumber));
    if (passDoc.exists()) {
      navigation.navigate("Passenger Home", { phoneNumber, day });
      return;
    }
  };

  useEffect(() => {
    const calculateDates = () => {
      const today = new Date();
      // 0 for Sunday, 6 for Saturday
      const day = today.getDay();

      //Calculate days until next friday
      const daysUntilFriday = (5 - day + 7) % 7;
      // If today is friday, use 0 instead of 7 because we want this friday
      const fridayDaysToAdd = daysUntilFriday === 0 ? 0 : daysUntilFriday;
      const daysUntilSunday = (0 - day + 7) % 7;
      const sundayDaysToAdd = daysUntilSunday === 0 ? 0 : daysUntilSunday;

      const fridayDateObj = new Date(today);
      fridayDateObj.setDate(today.getDate() + fridayDaysToAdd);
      const sundayDateObj = new Date(today);
      sundayDateObj.setDate(today.getDate() + sundayDaysToAdd);

      const formatDate = (date) => {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      };

      setFridayDate(formatDate(fridayDateObj));
      setSundayDate(formatDate(sundayDateObj));
    };

    calculateDates();
  }, []);

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Rides Home</Text>
          <Text style={styles.greeting}>
            Hi {userData.fname} {userData.lname}!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Ride Sign-Up</Text>
          <Text style={styles.cardSubtitle}>
            Sign up for rides and connect with your church community.
          </Text>

          <View style={styles.importantCard}>
            <View style={styles.deadlineContent}>
              <Text style={styles.deadlineTitle}>
                This Week&apos;s Deadlines
              </Text>
              <Text style={styles.deadlineText}>
                Please sign up before these times to guarantee your spot:
              </Text>
              <View style={styles.deadlineItem}>
                <View style={styles.deadlineDot} />
                <Text style={styles.deadlineDetail}>
                  <Text style={styles.deadlineDay}>Thursday 10PM</Text> for
                  Friday rides ({fridayDate})
                </Text>
              </View>
              <View style={styles.deadlineItem}>
                <View style={styles.deadlineDot} />
                <Text style={styles.deadlineDetail}>
                  <Text style={styles.deadlineDay}>Friday 10PM</Text> for Sunday
                  rides ({sundayDate})
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.primaryButton,
              ridesGenerated && styles.disabledButton,
            ]}
            onPress={handleSignUp}
            disabled={ridesGenerated}
          >
            <Text
              style={[
                styles.primaryButtonText,
                ridesGenerated && styles.disabledButtonText,
              ]}
            >
              {ridesGenerated ? "Sign-up Closed" : "Sign Up for a Ride"}
            </Text>
            {ridesGenerated && (
              <Text style={styles.buttonSubtext}>Rides have been assigned</Text>
            )}
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              !goingFriday && styles.disabledButton,
            ]} 
            onPress={() => handleViewRide("Friday")}
            disabled={!goingFriday}
          >
            <Text
              style={[
                styles.primaryButtonText,
                !goingFriday && styles.disabledButtonText,
              ]}
            >
              View Friday Rides
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.primaryButton,
              !goingSunday && styles.disabledButton,
            ]} 
            onPress={() => handleViewRide("Sunday")}
            disabled={!goingSunday}
          >
            <Text
              style={[
                styles.primaryButtonText,
                !goingSunday && styles.disabledButtonText,
              ]}
            >
              View Sunday Rides
            </Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            You may only view the full rides list if you signed up for that
            week.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  greeting: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 36,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 22,
    marginBottom: 16,
  },
  importantCard: {
    backgroundColor: "#fef3f2",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#fecaca",
    flexDirection: "row",
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  clockIcon: {
    fontSize: 20,
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 8,
  },
  deadlineText: {
    fontSize: 15,
    color: "#7f1d1d",
    marginBottom: 12,
  },
  deadlineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  deadlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#dc2626",
    marginRight: 10,
  },
  deadlineDetail: {
    fontSize: 15,
    color: "#7f1d1d",
    flex: 1,
  },
  deadlineDay: {
    fontWeight: "600",
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#e5e7eb",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
  buttonSubtext: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 17,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 1,
  },
  infoText: {
    fontSize: 14,
    color: "#0369a1",
    flex: 1,
    lineHeight: 20,
  },
});

export default RidesHome;
