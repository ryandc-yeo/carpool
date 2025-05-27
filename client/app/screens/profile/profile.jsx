import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation} from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc , setDoc } from "firebase/firestore";

const ProfileHome = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  const [userData, setUserData] = useState("");

  const getUser = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", phoneNumber));
      setUserData(userDoc.data());
    } catch (err) {
      console.error("Error checking Firestore: ", err);
      alert("Something wrong. Please try again.");
    }
  };

  useEffect(() => {
      (async () => {
        await getUser();
      })();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! Create your profile</Text>
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

export default ProfileHome;
