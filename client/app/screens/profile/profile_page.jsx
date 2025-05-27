import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation} from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc , setDoc } from "firebase/firestore";

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
  const { phoneNumber } = route.params;

  const createUser = async () => {
    const finalAddress = newAddress === "Apartment" ? customAddress : newAddress;

    await setDoc(doc(db, "users", phoneNumber), { 
      fname: newFname,
      lname: newLname,
      grade: newGrade,
      address: finalAddress
    }, { merge: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! Create your profile</Text>

      <Text style={styles.subtitle}>
        First Name
        <Text style={styles.required}> *</Text>
      </Text>
      <TextInput 
        placeholder="First Name"
        style={styles.input}
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

        navigation.navigate("Rides", { phoneNumber: phoneNumber });
      }} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Create Profile</Text>
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
