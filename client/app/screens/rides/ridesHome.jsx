import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const RidesHome = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  const [fridayDate, setFridayDate] = useState("");
  const [sundayDate, setSundayDate] = useState("");
  const [userData, setUserData] = useState("");
  const [ridesGenerated, setRidesGenerated] = useState(false);

  const handleSignUp = () => {
    navigation.navigate("Rides SignUp", { phoneNumber: phoneNumber });
  };

  const handleViewRide = async () => {
    const driverDoc = await getDoc(doc(db, "Sunday Drivers", phoneNumber));
    if (driverDoc.exists()) {
      navigation.navigate("Driver Home", { phoneNumber: phoneNumber });
    }
    
    const passDoc = await getDoc(doc(db, "Sunday Passengers", phoneNumber));
    if (passDoc.exists()) {
      navigation.navigate("Passenger Home", { phoneNumber: phoneNumber });
    }
  };

  const getUser = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", phoneNumber));
      setUserData(userDoc.data());
    } catch (err) {
      console.error("Error checking Firestore: ", err);
      alert("Something wrong. Please try again.");
    }
  };

  // Not sure how this function works entirely, so can change later. For now, updates fine
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


  useEffect(() => {
    (async () => {
      await getUser(); 
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rides Home</Text>
      
      <Text style={styles.text}>
        Welcome to the rides page! You can sign up and view available rides
        here.
      </Text>
      <View style={styles.question}>
        <Text style={styles.text}>
          Please fill out this form each week. The deadlines for this week are:
        </Text>
        <Text style={styles.redText}>
          • THURSDAY EVENING at 10PM for Friday rides ({fridayDate})
        </Text>
        <Text style={styles.redText}>
          • FRIDAY EVENING at 10PM for Sunday rides ({sundayDate})
        </Text>
      </View>
      <Text style={styles.text}>
        Be sure to sign up before the deadline — spots may not be guaranteed
        afterward.
      </Text>

      <Pressable
        style={[
          styles.button,
          ridesGenerated && { backgroundColor: "#888" } 
        ]}
        onPress={handleSignUp}
        disabled={ridesGenerated}
      >
        <Text style={styles.buttonText}>
          {ridesGenerated ? "Sign-up Closed (Rides Assigned)" : "Sign Up for a Ride"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleViewRide}>
        <Text style={styles.buttonText}>View Sunday Rides</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "top",
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  redText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#f01e2c",
    fontWeight: "bold",
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
  question: {
    marginBottom: 20,
    padding: 30,
    justifyContent: "center",
    alignItems: "left",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
});

export default RidesHome;
