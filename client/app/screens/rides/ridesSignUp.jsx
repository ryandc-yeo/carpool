import { View, Text, TextInput, StyleSheet, Pressable, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useEffect, useState, useRef } from "react";
import Checkbox from "expo-checkbox";
import { useRoute, useNavigation } from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import fetchUserData from "../../src/util/utilities";

const RidesSignUp = () => {
  const scrollRef = useRef(null);
  const capacityRef = useRef(null);
  const locationRef = useRef(null);
  const commentsRef = useRef(null);

  const roleOptions = ["Passenger", "Driver"];
  const fridayOptions = ["Early (5pm)", "Regular (6:30pm)", "No time preference"];
  const sundayOptions = ["Early (8am)", "Regular (10:45am)", "No time preference"];
  const fellyOptions = ["Yes", "No, go back early", "No preference"];
  const addressOptions = [
    { label: "Hill (De Neve Turn Around)", value: "Hill" },
  { label: "Apartment (Enter Address)", value: "Apartment" }
  ];

  const [role, setRole] = useState("");
  const [friday, setFriday] = useState("");
  const [sunday, setSunday] = useState("");
  const [felly, setFelly] = useState("");
  const [address, setAddress] = useState("");
  const [customAddress, setCustomAddress] = useState ("")
  const [isNewcomer, setisNewcomer] = useState(false);
  const [acknowledge, setAcknowledge] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [capacity, setCapacity] = useState(0);
  const [comments, setComments] = useState("");
  const [commentsFocused, setCommentsFocused] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  useEffect(() => {
    (async () => {
      const data = await fetchUserData(phoneNumber);
      setUserData(data);
      if (data.address) {
        if (data.address === "Hill (De Neve Turn Around)" || data.address === "Hill") {
          setAddress("Hill");
        } else {
          setAddress("Apartment");
          setCustomAddress(data.address);
        }
      }
      setLoadingData(false);
    })();
  }, [phoneNumber]);

  const handleGoBack = () => {
    navigation.navigate("Rides", { phoneNumber });
  };

  const addToRides = async () => {
    if (!userData || !userData.fname) {
      alert("User data not loaded yet");
      return;
    }

    const finalAddress = address === "Apartment" ? customAddress : address;

    const timeValue = (slot) => {
      if (slot === "No preference" || slot === "") return "no_preference";
      return slot === "Early (5pm)" || slot === "Early (8am)" ? "early" : "regular";
    };
      

    if (friday !== "" && role === "Driver") {
      await setDoc(
        doc(db, "Friday Drivers", phoneNumber),
        {
          fname: userData.fname,
          lname: userData.lname,
          grade: userData.grade,
          address: finalAddress,
          time: timeValue(friday),
          capacity: capacity,
          newcomer: isNewcomer,
          comments: comments,
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
          address: finalAddress,
          time: timeValue(friday),
          newcomer: isNewcomer,
          comments: comments,
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
          address: finalAddress,
          time: timeValue(sunday),
          capacity: capacity,
          felly: felly,
          newcomer: isNewcomer,
          comments: comments,
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
          address: finalAddress,
          time: timeValue(sunday),
          felly: felly,
          newcomer: isNewcomer,
          comments: comments,
        },
        { merge: true }
      );
    }

    return true;
  };

  const scrollToInput = (inputRef) => {
    inputRef.current?.measureLayout(
      scrollRef.current.getScrollResponder(),
      (x, y) => scrollRef.current.scrollToPosition(0, y - 20),
      (e) => console.warn('measureLayout failed', e)
    );
  };

  if (loadingData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        enableAutomaticScroll={false}
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <View style={styles.question}>
          <Text style={styles.title}>Rides Signup</Text>
          <Text style={styles.text}>
            Welcome! So excited that you are going to be joining us
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
            Sunday rides is on Friday at 10PM. Please make sure to sign up on
            time!
          </Text>
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            Are you a...
            <Text style={styles.required}> *</Text>
          </Text>
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
          {role === "Driver" && (
            <>
              <Text style={[styles.subtitle, { marginTop: 20 }]}>
                How many passengers can you drive? (Excluding yourself)
                <Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                ref={capacityRef}
                onFocus={() => scrollRef.current?.scrollToFocusedInput(capacityRef.current, 120)}
                style={styles.input}
                placeholder="e.g., 4"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={capacity}
                onChangeText={setCapacity}
              />
            </>
          )}
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            Select which days you want a ride:
            <Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.horizontalGroup}>
            <View>
              <Text style={styles.subsubtitle}>Friday</Text>
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
            <Text style={styles.subsubtitle}>Sunday</Text>
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
            Would you like to join us for lunch?
            <Text style={styles.required}> *</Text>
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
          <Text style={styles.subtitle}>
            Where are you located?
            <Text style={styles.required}> *</Text>
          </Text>
          
          {addressOptions.map((a) => (
            <View key={a.value} style={styles.radioRow}>
              <Pressable
                style={[
                  styles.radioButtonOuter,
                  address === a.value && styles.radioButtonOuterSelected,
                ]}
                onPress={() => setAddress(a.value)}
              >
                {address === a.value && <View style={styles.radioButtonInner} />}
              </Pressable>
              <Text style={styles.radioText}>{a.label}</Text>
            </View>
          ))}
          {address === "Apartment" && (
            <TextInput
              ref={locationRef}
              onFocus={() => scrollRef.current?.scrollToFocusedInput(locationRef.current, 120)}
              style={styles.input}
              placeholder="Enter apartment address"
              placeholderTextColor="#888"
              value={customAddress}
              onChangeText={setCustomAddress}
            />
          )}
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
            Rides are a privilege, not a right that everyone is
            entitled to. Please be respectful and practice proper car
            ettiquette!
          </Text>
          <Text style={styles.text}>
            By signing up, you are committing to receiving a ride. If you are unable to uphold this commitment, you must
            contact a ride coordinator or your driver at least 12 hours in
            advance. Failure to do so will result in a warning strike;
            repeated failure will lead to suspension from receiving rides from
            the church for the remainder of the semester/quarter.
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
              <Text style={styles.required}> *</Text>
            </Text>
          </View>
        </View>

        <View style={styles.question}>
          <Text style={styles.subtitle}>
            Any questions, comments, or concerns?
          </Text>

          <TextInput
            ref={commentsRef}
            onFocus={() => {
              setCommentsFocused(true);
              scrollRef.current?.scrollToFocusedInput(commentsRef.current, 120);
            }}
            onBlur={() => setCommentsFocused(false)}
            style={styles.input}
            placeholder="Enter here"
            placeholderTextColor="#888"
            value={comments}
            onChangeText={setComments}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={async () => {
            // Make sure all requried questions are filled out
            if (!role) {
              alert("Please select whether you are a Passenger or Driver.");
              return;
            }
            if (role === "Driver" && (!capacity || capacity.trim() === "")) {
              alert("Please enter how many passengers you can drive.");
              return;
            }

            if (!friday && !sunday) {
              alert("Please select at least one day you want a ride.");
              return;
            }

            if (!felly) {
              alert("Please select whether you are staying for lunch or going back early.");
              return;
            }

            if (!address || (address === "Apartment" && customAddress.trim() === "")) {
              alert("Please specify your pickup location.");
              return;
            }

            if (!acknowledge) {
              alert("You must acknowledge the ride commitment policy.");
              return;
            }

            const success = await addToRides();
            if (success) {
              navigation.navigate(role === "Driver" ? "Driver Home" : "Passenger Home", {
                phoneNumber,
              });
            } else {
              alert("Could not submit. Please fill all required fields.");
            }
          }}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
        {commentsFocused && <View style={{ height: 150 }} />}
      </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 20,
    paddingBottom: 120,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
  subsubtitle: {
    fontSize: 16,
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
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  required: {
    color: "#f01e2c", // red
  },
});

export default RidesSignUp;
