import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import { useRoute, useNavigation } from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import fetchUserData from "../../src/util/utilities";

const RidesSignUp = () => {
  const roleOptions = ["Passenger", "Driver"];
  const fridayOptions = ["Early (5pm)", "Regular (6:30pm)"];
  const sundayOptions = ["Early (8am)", "Regular (10:45am)"];
  const fellyOptions = ["Yes", "No, go back early"];
  const addressOptions = [
    "Hill (De Neve Turn Around)",
    "North of Wilshire",
    "South of Wilshire",
  ];

  const [role, setRole] = useState("");
  const [friday, setFriday] = useState("");
  const [sunday, setSunday] = useState("");
  const [felly, setFelly] = useState("");
  const [address, setAddress] = useState("");
  const [isNewcomer, setisNewcomer] = useState(false);
  const [acknowledge, setAcknowledge] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  useEffect(() => {
    (async () => {
      const data = await fetchUserData(phoneNumber);
      setUserData(data);
      setLoadingData(false);
    })();
  }, []);

  const handleGoBack = () => {
    navigation.navigate("Rides", { phoneNumber });
  };

  const addToRides = async () => {
    if (!userData || !userData.fname) {
      alert("User data not loaded yet");
      return;
    }

    const timeValue = (slot) =>
      slot === "Early (5pm)" || slot === "Early (8am)" ? "early" : "regular";

    if (friday !== "" && role === "Driver") {
      await setDoc(
        doc(db, "Friday Drivers", phoneNumber),
        {
          fname: userData.fname,
          lname: userData.lname,
          grade: userData.grade,
          address: address,
          time: timeValue(friday),
          newcomer: isNewcomer,
        },
        { merge: true }
      );
    } else {
      await setDoc(
        doc(db, "Friday Passengers", phoneNumber),
        {
          fname: userData.fname,
          lname: userData.lname,
          grade: userData.grade,
          address: address,
          time: timeValue(friday),
          newcomer: isNewcomer,
        },
        { merge: true }
      );
    }

    if (sunday !== "" && role === "Driver") {
      await setDoc(
        doc(db, "Sunday Drivers", phoneNumber),
        {
          fname: userData.fname,
          lname: userData.lname,
          grade: userData.grade,
          address: address,
          time: timeValue(sunday),
          felly: felly,
          newcomer: isNewcomer,
        },
        { merge: true }
      );
    } else {
      await setDoc(
        doc(db, "Sunday Passengers", phoneNumber),
        {
          fname: userData.fname,
          lname: userData.lname,
          grade: userData.grade,
          address: address,
          time: timeValue(sunday),
          felly: felly,
          newcomer: isNewcomer,
        },
        { merge: true }
      );
    }

    return true;
  };

  if (loadingData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <View style={styles.question}>
          <Text style={styles.title}>Rides Signup</Text>
          <Text style={styles.text}>
            Welcome! So excited that you are going to be worshipping with us
            this week. If you need a ride, please sign up!
          </Text>
          <Text style={styles.boldText}>Sunday Information:</Text>
          <Text style={styles.text}>
            Every Sunday we gather from all walks of life and all parts of the
            city. After service, we will eat lunch together as a college
            ministry, usually at restaurants nearby. Hope to see you this week!
          </Text>
          <Text style={styles.boldText}>Friday Information:</Text>
          <Text style={styles.text}>
            At the end of every week, on Friday nights, we meet together as a
            community to share our walk in life. Also be on the lookout for the
            occasional fellowship in place of the weekly community groups!
          </Text>
          <Text style={styles.redSmallText}>
            Deadline for Friday rides is Thursday at 10PM and deadline for
            Sunday rides is at Friday at 10PM. Please make sure to sign up on
            time!
          </Text>
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>Are you a...</Text>
          {roleOptions.map((r) => (
            <View key={r} style={styles.radioRow}>
              <Pressable
                style={[
                  styles.radioButtonOuter,
                  role === r && styles.radioButtonOuterSelected,
                ]}
                onPress={() => setRole(r)}
              >
                {role === r && <View style={styles.radioButtonInner} />}
              </Pressable>
              <Text style={styles.radioText}>{r}</Text>
            </View>
          ))}
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            If you are a driver, how many people can you drive (excluding you?){" "}
          </Text>
          <TextInput placeholder="Input here" style={styles.input} />
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            Select which days you want a ride:
          </Text>
          <View style={styles.horizontalGroup}>
            <View>
              <Text>Friday</Text>
              {fridayOptions.map((f) => (
                <View key={f} style={styles.radioRow}>
                  <Pressable
                    style={[
                      styles.radioButtonOuter,
                      friday === f && styles.radioButtonOuterSelected,
                    ]}
                    onPress={() => setFriday(f)}
                  >
                    {friday === f && <View style={styles.radioButtonInner} />}
                  </Pressable>
                  <Text style={styles.radioText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          <View>
            <Text>Sunday</Text>
            {sundayOptions.map((s) => (
              <View key={s} style={styles.radioRow}>
                <Pressable
                  style={[
                    styles.radioButtonOuter,
                    sunday === s && styles.radioButtonOuterSelected,
                  ]}
                  onPress={() => setSunday(s)}
                >
                  {sunday === s && <View style={styles.radioButtonInner} />}
                </Pressable>
                <Text style={styles.radioText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            Stay for lunch or go back immediately?
          </Text>

          {fellyOptions.map((f) => (
            <View key={f} style={styles.radioRow}>
              <Pressable
                style={[
                  styles.radioButtonOuter,
                  felly === f && styles.radioButtonOuterSelected,
                ]}
                onPress={() => setFelly(f)}
              >
                {felly === f && <View style={styles.radioButtonInner} />}
              </Pressable>
              <Text style={styles.radioText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>Where are you located?</Text>
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

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            Please check this box if you are a newcomer!
          </Text>
          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={isNewcomer}
              onValueChange={setisNewcomer}
            />
            <Text style={styles.paragraph}>I am a newcomer!</Text>
          </View>
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            Rides are a privilege and gift, not a right that everyone is
            entitled to. Please be respectful and practice proper car
            ettiquette!
          </Text>
          <Text style={styles.subtitle}>
            By signing up, you are committing to receiving a ride for Friday
            and/or Sunday. If you are unable to uphold this commitment, you must
            email a ride coordinator (INSERT CONTACT) at least 24 hours in
            advance. Failure to do so will first result in a warning strike;
            repeated failure will lead to suspension from receiving rides from
            the church for the remainder of the semester/quarter.{" "}
          </Text>
          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={acknowledge}
              onValueChange={setAcknowledge}
            />
            <Text style={styles.paragraph}>
              I understand if I give less than 24 hrs for a cancellation, I will
              be given a warning strike (or suspension, if I already have a
              strike)
            </Text>
          </View>
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            Any questions, comments, or concerns?
          </Text>
          <TextInput placeholder="Input here" style={styles.input} />
        </View>

        <Pressable
          style={styles.button}
          onPress={async () => {
            const success = await addToRides();
            if (success) {
              if (role === "Driver") {
                navigation.navigate("Driver Home", {
                  phoneNumber: phoneNumber,
                });
              } else {
                navigation.navigate("Passenger Home", {
                  phoneNumber: phoneNumber,
                });
              }
            } else {
              alert("Could not submit. Please fill all required fields.");
            }
          }}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
  question: {
    marginBottom: 20,
    padding: 30,
    justifyContent: "center",
    alignItems: "left",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  horizontalGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
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
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  boldText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: "#555",
  },
  redSmallText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#f01e2c",
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
    flexWrap: "wrap",
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
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default RidesSignUp;
