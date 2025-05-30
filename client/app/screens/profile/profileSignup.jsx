import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute, useNavigation} from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc , setDoc, getDoc } from "firebase/firestore";
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
    const finalAddress = newAddress === "Apartment" ? customAddress : newAddress;

    await setDoc(doc(db, "users", phoneNumber), { 
      fname: newFname,
      lname: newLname,
      grade: newGrade,
      address: finalAddress
    }, { merge: true });

    const rideCollections = [
      "Friday Passengers",
      "Friday Drivers",
      "Sunday Passengers",
      "Sunday Drivers"
    ];

    // Loop and update user data in each ride record
    for (const collection of rideCollections) {
      const ref = doc(db, collection, phoneNumber);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        await setDoc(ref, {
          fname: newFname,
          lname: newLname,
          grade: newGrade,
          address: finalAddress
        }, { merge: true });
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
  } , [phoneNumber]);

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
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? "Edit Your Profile" : "Welcome! Create your profile"}
      </Text>

      <Text style={styles.subtitle}>
        First Name
        <Text style={styles.required}> *</Text>
      </Text>
      <TextInput 
        placeholder="First Name"
        style={styles.input}
        value={newFname}
        onChangeText={(text) => {
          setFname(text);
        }}
      />

      <Text style={styles.subtitle}>
        Last Name
        <Text style={styles.required}> *</Text>
      </Text>
      <TextInput 
        placeholder="Last Name"
        style={styles.input}
        value={newLname}
        onChangeText={(text) => {
          setLname(text);
        }}
      />

      <Text style={styles.subtitle}>
        Phone Number
        <Text style={styles.required}> *</Text>
      </Text>
      <Text>{phoneNumber || ''}</Text>


      <Text style={styles.subtitle}>
        Grade
        <Text style={styles.required}> *</Text>
      </Text>
      {gradeOptions.map((g) => (
        <View key={g} style={styles.radioRow}>
          <Pressable
            style={[
              styles.radioButtonOuter,
              newGrade === g && styles.radioButtonOuterSelected,
            ]}
            onPress={() => setGrade(g)}
          >
            {newGrade === g && <View style={styles.radioButtonInner} />}
          </Pressable>
          <Text style={styles.radioText}>{g}</Text>
        </View>
      ))}

      <Text style={styles.subtitle}>
        Address
        <Text style={styles.required}> *</Text>
      </Text>
      {addressOptions.map((a) => (
        <View key={a.value} style={styles.radioRow}>
          <Pressable
            style={[
              styles.radioButtonOuter,
              newAddress === a.value && styles.radioButtonOuterSelected,
            ]}
            onPress={() => setAddress(a.value)}
          >
            {newAddress === a.value && <View style={styles.radioButtonInner} />}
          </Pressable>
          <Text style={styles.radioText}>{a.label}</Text>
        </View>
      ))}
      {newAddress === "Apartment" && (
        <TextInput
          style={styles.input}
          placeholder="Enter apartment address"
          placeholderTextColor="#888"
          value={customAddress}
          onChangeText={setCustomAddress}
        />
      )}

      <Pressable onPress={async () => {
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
        if (!newAddress || (newAddress === "Apartment" && !customAddress.trim())) {
          alert("Please provide your address.");
          return;
        }
        await createUser();

        await login(phoneNumber);
        navigation.navigate("Rides");
      }} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>
          {isEdit ? "Save Profile" : "Create Profile"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "left",
    justifyContent: "center",
    padding: 20,
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
    paddingLeft: 10,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioText: {
    marginLeft: 10,
    fontSize: 16,
  },
  radioButtonOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonOuterSelected: {
    borderColor: "#007AFF",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  loginButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
  },
  required: {
  color: "#f01e2c",
  },

});

export default Profile;
