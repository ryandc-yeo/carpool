import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useState, useRef } from "react";
import Checkbox from "expo-checkbox";
import { useRoute, useNavigation } from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import fetchUserData from "../../src/util/utilities";
import { useAuth } from "../../src/util/AuthContext";

const RidesSignUp = () => {
  const scrollRef = useRef(null);
  const capacityRef = useRef(null);
  const locationRef = useRef(null);
  const commentsRef = useRef(null);

  const roleOptions = ["Passenger", "Driver"];
  const fridayOptions = [
    "Early (5pm)",
    "Regular (6:30pm)",
    "No time preference",
  ];
  const sundayOptions = [
    "Early (8am)",
    "Regular (10:45am)",
    "No time preference",
  ];
  const fellyOptions = ["Yes", "No, go back early", "No preference"];
  const addressOptions = [
    { label: "Hill (De Neve Turn Around)", value: "Hill" },
    { label: "Apartment (Enter Address)", value: "Apartment" },
  ];

  const [role, setRole] = useState("");
  const [friday, setFriday] = useState("");
  const [sunday, setSunday] = useState("");
  const [felly, setFelly] = useState("");
  const [address, setAddress] = useState("");
  const [customAddress, setCustomAddress] = useState("");
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
  const { setGoingFriday, setGoingSunday } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await fetchUserData(phoneNumber);
      setUserData(data);
      if (data.address) {
        if (
          data.address === "Hill (De Neve Turn Around)" ||
          data.address === "Hill"
        ) {
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

    if (friday !== "") {
      setGoingFriday(true);
    } else {
      setGoingFriday(false);
    }
    if (sunday !== "") {
      setGoingSunday(true);
    } else {
      setGoingSunday(false);
    }

    const finalAddress = address === "Apartment" ? customAddress : address;

    const timeValue = (slot) => {
      if (slot === "No preference" || slot === "") return "no_preference";
      return slot === "Early (5pm)" || slot === "Early (8am)"
        ? "early"
        : "regular";
    };

    if (friday !== "" && role === "Driver") {
      await setDoc(
        doc(db, "Friday Drivers", phoneNumber),
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
        doc(db, "Friday Passengers", phoneNumber),
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

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading your information...</Text>
        </View>
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
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Rides Signup</Text>
        <Text style={styles.subtitle}>Join us this week! 🚗</Text>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome!</Text>
        <Text style={styles.welcomeText}>
          So excited that you are going to be joining us this week. If you need
          a ride, please sign up!
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.eventSection}>
              <Text style={styles.eventTitle}>Sunday Gathering</Text>
              <Text style={styles.eventText}>
                Every Sunday we gather from all walks of life and all parts of
                the city. After service, we eat lunch together as a college
                ministry at nearby restaurants.
              </Text>

              <Text style={styles.eventTitle}>Friday Community</Text>
              <Text style={styles.eventText}>
                Friday nights we meet as a community to share our walk in life.
                Also watch for occasional fellowships in place of weekly
                community groups!
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.deadlineAlert}>
          <Text style={styles.deadlineIcon}>⚠️</Text>
          <View style={styles.deadlineContent}>
            <Text style={styles.deadlineTitle}>Important Deadlines</Text>
            <Text style={styles.deadlineText}>
              • Friday rides: Thursday at 10PM
            </Text>
            <Text style={styles.deadlineText}>
              • Sunday rides: Friday at 10PM
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>
          Are you a...
          <Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.optionsContainer}>
          {roleOptions.map((r) => (
            <Pressable
              key={r}
              style={[styles.optionButton, role === r && styles.selectedOption]}
              onPress={() => setRole(r)}
            >
              <View
                style={[
                  styles.radioButton,
                  role === r && styles.radioButtonSelected,
                ]}
              >
                {role === r && <View style={styles.radioButtonInner} />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  role === r && styles.selectedOptionText,
                ]}
              >
                {r}
              </Text>
            </Pressable>
          ))}
        </View>

        {role === "Driver" && (
          <View style={styles.driverSection}>
            <Text style={styles.inputLabel}>
              How many passengers can you drive? (Excluding yourself)
              <Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              ref={capacityRef}
              onFocus={() =>
                scrollRef.current?.scrollToFocusedInput(
                  capacityRef.current,
                  120
                )
              }
              style={styles.textInput}
              placeholder="e.g., 4"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
            />
          </View>
        )}
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>
          Select which days you want a ride
          <Text style={styles.required}> *</Text>
        </Text>

        <View style={styles.daySection}>
          <Text style={styles.dayTitle}>Friday</Text>
          <View style={styles.optionsContainer}>
            {fridayOptions.map((f) => (
              <Pressable
                key={f}
                style={[
                  styles.optionButton,
                  friday === f && styles.selectedOption,
                ]}
                onPress={() => setFriday(f)}
              >
                <View
                  style={[
                    styles.radioButton,
                    friday === f && styles.radioButtonSelected,
                  ]}
                >
                  {friday === f && <View style={styles.radioButtonInner} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    friday === f && styles.selectedOptionText,
                  ]}
                >
                  {f}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.daySection}>
          <Text style={styles.dayTitle}>Sunday</Text>
          <View style={styles.optionsContainer}>
            {sundayOptions.map((s) => (
              <Pressable
                key={s}
                style={[
                  styles.optionButton,
                  sunday === s && styles.selectedOption,
                ]}
                onPress={() => setSunday(s)}
              >
                <View
                  style={[
                    styles.radioButton,
                    sunday === s && styles.radioButtonSelected,
                  ]}
                >
                  {sunday === s && <View style={styles.radioButtonInner} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    sunday === s && styles.selectedOptionText,
                  ]}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>
          Would you like to join us for lunch?
          <Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.optionsContainer}>
          {fellyOptions.map((f) => (
            <Pressable
              key={f}
              style={[
                styles.optionButton,
                felly === f && styles.selectedOption,
              ]}
              onPress={() => setFelly(f)}
            >
              <View
                style={[
                  styles.radioButton,
                  felly === f && styles.radioButtonSelected,
                ]}
              >
                {felly === f && <View style={styles.radioButtonInner} />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  felly === f && styles.selectedOptionText,
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>
          Where are you located?
          <Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.optionsContainer}>
          {addressOptions.map((a) => (
            <Pressable
              key={a.value}
              style={[
                styles.optionButton,
                address === a.value && styles.selectedOption,
              ]}
              onPress={() => setAddress(a.value)}
            >
              <View
                style={[
                  styles.radioButton,
                  address === a.value && styles.radioButtonSelected,
                ]}
              >
                {address === a.value && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  address === a.value && styles.selectedOptionText,
                ]}
              >
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {address === "Apartment" && (
          <View style={styles.addressInputSection}>
            <Text style={styles.inputLabel}>Apartment Address</Text>
            <TextInput
              ref={locationRef}
              onFocus={() =>
                scrollRef.current?.scrollToFocusedInput(
                  locationRef.current,
                  120
                )
              }
              style={styles.textInput}
              placeholder="Enter your apartment address"
              placeholderTextColor="#9ca3af"
              value={customAddress}
              onChangeText={setCustomAddress}
            />
          </View>
        )}
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>Newcomer Status</Text>
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setisNewcomer(!isNewcomer)}
        >
          <Checkbox
            style={styles.checkbox}
            value={isNewcomer}
            onValueChange={setisNewcomer}
          />
          <Text style={styles.checkboxText}>I am a newcomer!</Text>
        </Pressable>
      </View>

      <View style={styles.termsCard}>
        <View style={styles.termsHeader}>
          <Text style={styles.termsIcon}>📋</Text>
          <Text style={styles.termsTitle}>Ride Commitment Policy</Text>
        </View>

        <Text style={styles.termsSubtitle}>
          Rides are a privilege that requires mutual respect and proper car
          etiquette.
        </Text>

        <Text style={styles.termsText}>
          By signing up, you are committing to receiving a ride. If you cannot
          uphold this commitment, you must contact a ride coordinator or your
          driver at least 12 hours in advance. Failure to do so will result in a
          warning strike; repeated failure will lead to suspension from
          receiving rides for the remainder of the semester/quarter.
        </Text>

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAcknowledge(!acknowledge)}
        >
          <Checkbox
            style={styles.checkbox}
            value={acknowledge}
            onValueChange={setAcknowledge}
          />
          <Text style={styles.acknowledgmentText}>
            I understand if I give less than 24 hrs for a cancellation, I will
            be given a warning strike (or suspension, if I already have a
            strike)
            <Text style={styles.required}> *</Text>
          </Text>
        </Pressable>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>
          Any questions, comments, or concerns?
        </Text>
        <TextInput
          ref={commentsRef}
          onFocus={() => {
            setCommentsFocused(true);
            scrollRef.current?.scrollToFocusedInput(commentsRef.current, 120);
          }}
          onBlur={() => setCommentsFocused(false)}
          style={styles.textAreaInput}
          placeholder="Share any questions or special requests..."
          placeholderTextColor="#9ca3af"
          value={comments}
          onChangeText={setComments}
          multiline={true}
          numberOfLines={4}
        />
      </View>

      <Pressable
        style={styles.submitButton}
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
            alert(
              "Please select whether you are staying for lunch or going back early."
            );
            return;
          }

          if (
            !address ||
            (address === "Apartment" && customAddress.trim() === "")
          ) {
            alert("Please specify your pickup location.");
            return;
          }

          if (!acknowledge) {
            alert("You must acknowledge the ride commitment policy.");
            return;
          }

            const success = await addToRides();
            if (success) {
              navigation.navigate("Rides");
            } else {
              alert("Could not submit. Please fill all required fields.");
            }
          }}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
        {commentsFocused && <View style={{ height: 150 }} />}
      </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#4f46e5",
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "500",
  },
  welcomeCard: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 22,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fefbf3",
    marginBottom: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ea580c",
  },
  eventSection: {
    // marginBottom: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9a3412",
    marginBottom: 3,
  },
  eventText: {
    fontSize: 14,
    color: "#9a3412",
    lineHeight: 20,
    marginBottom: 25,
  },
  deadlineAlert: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  deadlineIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 4,
  },
  deadlineText: {
    fontSize: 13,
    color: "#7f1d1d",
  },
  questionCard: {
    backgroundColor: "white",
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  selectedOption: {
    borderColor: "#4f46e5",
    backgroundColor: "#eef2ff",
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: "#4f46e5",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#4f46e5",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  selectedOptionText: {
    color: "#4f46e5",
    fontWeight: "500",
  },
  driverSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  daySection: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
  },
  textAreaInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
    minHeight: 100,
    textAlignVertical: "top",
  },
  addressInputSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    marginTop: 2,
  },
  checkboxText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
    lineHeight: 22,
  },
  termsCard: {
    backgroundColor: "#f0f9ff",
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  termsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  termsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0369a1",
  },
  termsSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0369a1",
    marginBottom: 12,
  },
  termsText: {
    fontSize: 14,
    color: "#0c4a6e",
    lineHeight: 20,
    marginBottom: 16,
  },
  acknowledgmentText: {
    fontSize: 14,
    color: "#0c4a6e",
    flex: 1,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: "#4f46e5",
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  required: {
    color: "#dc2626",
    fontWeight: "600",
  },
});

export default RidesSignUp;
