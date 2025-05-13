import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";

const Profile = () => {
  const gradeOptions = ["Freshman", "Sophomore", "Junior", "Senior"];
  const addressOptions = ["Pepperdine", "UCLA", "USC"];

  const [grade, setGrade] = useState("");
  const [address, setAddress] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! Create your profile</Text>

      <Text style={styles.subtitle}>Name</Text>
      <TextInput placeholder="name" style={styles.input} />

      <Text style={styles.subtitle}>Phone Number</Text>
      <TextInput placeholder="xxx-xxx-xxxx" style={styles.input} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
    width: "80%",
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
});

export default Profile;
