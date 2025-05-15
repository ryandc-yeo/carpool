import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const gradeOptions = ["Freshman", "Sophomore", "Junior", "Senior"];
  const addressOptions = ["Hill (De Neve Turn Around)", "North of Wilshire", "South of Wilshire"];

  const [grade, setGrade] = useState("");
  const [address, setAddress] = useState("");

  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! Create your profile</Text>

      <Text style={styles.subtitle}>First Name</Text>
      <TextInput placeholder="First Name" style={styles.input} />

      <Text style={styles.subtitle}>Last Name</Text>
      <TextInput placeholder="Last Name" style={styles.input} />

      <Text style={styles.subtitle}>Phone Number</Text>
      <Text>{phoneNumber}</Text>


      <Text style={styles.subtitle}>Grade</Text>
      {gradeOptions.map((g) => (
        <View key={g} style={styles.radioRow}>
          <Pressable
            style={[
              styles.radioButtonOuter,
              grade === g && styles.radioButtonOuterSelected,
            ]}
            onPress={() => setGrade(g)}
          >
            {grade === g && <View style={styles.radioButtonInner} />}
          </Pressable>
          <Text style={styles.radioText}>{g}</Text>
        </View>
      ))}

      <Text style={styles.subtitle}>Address</Text>
      {addressOptions.map((a) => (
        <View key={a} style={styles.radioRow}>
          <Pressable
            style={[
              styles.radioButtonOuter,
              address === a && styles.radioButtonOuterSelected,
            ]}
            onPress={() => setAddress(a)}
          >
            {address === a && <View style={styles.radioButtonInner} />}
          </Pressable>
          <Text style={styles.radioText}>{a}</Text>
        </View>
      ))}

      <Pressable onPress={() => navigation.navigate('Rides')} style={styles.loginButton}>
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
});

export default Profile;
