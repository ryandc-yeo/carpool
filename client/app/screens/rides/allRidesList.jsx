import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import db from "../../src/firebase-config";

const AllRidesList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber, role, day } = route.params || {};

  const [carGroups, setCarGroups] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTextDisplay = (first, last, felly, time) => {
    return (
      first +
      " " +
      last +
      " - " +
      formatTime(time) +
      " - " +
      formatFellyDisplay(felly)
    );
  };

  const formatFellyDisplay = (felly) => {
    if (felly === "Yes") {
      return "Felly";
    } else if (felly === "No, go back early") {
      return "No Felly";
    }
    return felly;
  };

    const formatTime = (time) => {
        if (time === "regular") {
            return "Regular";
        } else if (time === "early") {
            return "Early";
        } else if (time === "no_preference") {
            return "No Preference"
        }
        return time;
    }

    const handleGoBack = () => {
        if (role === "Driver") {
            navigation.navigate("Driver Home", { phoneNumber: phoneNumber, day: day});
        } else {
            navigation.navigate("Passenger Home", { phoneNumber: phoneNumber, day: day});
        }
    };

    // grouping passengers for ubers
    function groupPassengers(passengers) {
        const groups = [];
        let i = 0;

        while (i < passengers.length) {
            const remaining = passengers.length - i;

            if (remaining === 5) {
                // group of five better than four 
                groups.push(passengers.slice(i, i + 5));
                i += 5;
            } else if (remaining >= 6) {
                // prefer groups of six
                groups.push(passengers.slice(i, i + 6));
                i += 6;
            } else if (remaining >= 4) {
                // otherwise do groups of four
                groups.push(passengers.slice(i, i + 4));
                i += 4;
            } else {
                // less than four, group as is
                groups.push(passengers.slice(i));
                break;
            }
        }

        return groups;
    }

  useFocusEffect(
    useCallback(() => {
      const configRef = doc(db, "meta", "config");

      const unsubscribe = onSnapshot(configRef, async (configSnap) => {
        const ridesGenerated =
          configSnap.exists() && configSnap.data().ridesGenerated;

        if (!ridesGenerated) {
          //alert("Rides are not generated yet. Please check back later.");
          navigation.navigate("Rides Not Released", { role: role });
          return;
        }

                const driversSnapshot = await getDocs(collection(db, `${day} Drivers`));
                const groups = driversSnapshot.docs.map(docSnap => {
                    const data = docSnap.data();
                    return {
                        driver: {
                            phoneNumber: docSnap.id,
                            fname: data.fname,
                            lname: data.lname, 
                            felly: data.felly,
                            time: data.time,
                        },
                        passengers: Array.isArray(data.passengers) ? data.passengers : []
                    };
                });

                const passengersSnapshot = await getDocs(collection(db, `${day} Passengers`));
                const waitlist = passengersSnapshot.docs.map(docSnap =>{
                    const data = docSnap.data(); 
                    if (data.driver == null) {
                        return {
                            id: docSnap.id,
                            ...data
                        };
                    }
                    return null;
                }).filter(p => p !== null);

        setWaitlist(waitlist);
        setCarGroups(groups);
        setLoading(false);
      });

            return () => unsubscribe(); // clean up on unmount
        }, [day, role])
    );
    

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading car assignments...</Text>
      </View>
    );
  }

  //   return (
  // <ScrollView contentContainerStyle={styles.container}>
  //   <View style={styles.headerRow}>
  //     <Pressable style={styles.backButton} onPress={handleGoBack}>
  //       <Text style={styles.backButtonText}>← Back</Text>
  //     </Pressable>
  //   </View>
  //   <Text style={styles.title}>Sunday Rides</Text>

  //   {carGroups.map((group, index) => (
  //     <View key={index} style={styles.card}>
  //       <Text style={styles.cardTitle}>
  //         🚗 Car {index + 1} - {formatTime(group.driver.time)} -{" "}
  //         {formatFellyDisplay(group.driver.felly)}{" "}
  //       </Text>
  //       <Text
  //         style={[
  //           styles.cardText,
  //           group.driver.phoneNumber === phoneNumber && {
  //             fontWeight: "bold",
  //             color: "#007AFF",
  //           },
  //         ]}
  //       >
  //         <Text style={{ fontWeight: "600" }}>Driver: </Text>
  //         {group.driver.fname} {group.driver.lname}
  //         {group.driver.phoneNumber === phoneNumber && " (You)"}
  //       </Text>

  //       <Text style={[styles.cardText, { fontWeight: "600", marginTop: 2 }]}>
  //         Passengers:
  //       </Text>
  //       {group.passengers.length > 0 ? (
  //         group.passengers.map((p, i) => {
  //           const isCurrentUser = p.phoneNumber === phoneNumber;
  //           return (
  //             <Text
  //               key={i}
  //               style={[
  //                 styles.cardText,
  //                 isCurrentUser && { fontWeight: "bold", color: "#007AFF" },
  //               ]}
  //             >
  //               {formatTextDisplay(p.fname, p.lname, p.felly, p.time)}
  //               {isCurrentUser && " (You)"}
  //             </Text>
  //           );
  //         })
  //       ) : (
  //         <Text style={styles.passenger}>None assigned</Text>
  //       )}
  //     </View>
  //   ))}
  //   <View style={styles.card}>
  //     <Text style={styles.cardTitle}>Waitlist</Text>
  //     {waitlist.map((passenger, index) => (
  //       <Text
  //         key={index}
  //         style={[
  //           styles.cardText,
  //           passenger.id === phoneNumber && {
  //             fontWeight: "bold",
  //             color: "#007AFF",
  //           },
  //         ]}
  //       >
  //         {formatTextDisplay(
  //           passenger.fname,
  //           passenger.lname,
  //           passenger.felly,
  //           passenger.time
  //         )}
  //         {passenger.id === phoneNumber && " (You)"}
  //       </Text>
  //     ))}
  //   </View>
  // </ScrollView>
  //   );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Sunday Rides</Text>
        <Text style={styles.subtitle}>All car assignments for this week</Text>
      </View>

      {/* Car Groups */}
      {carGroups.map((group, index) => (
        <View key={index} style={styles.carCard}>
          <View style={styles.carHeader}>
            <Text style={styles.carIcon}>🚗</Text>
            <View style={styles.carHeaderContent}>
              <Text style={styles.carTitle}>Car {index + 1}</Text>
              <View style={styles.carTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {formatTime(group.driver.time)}
                  </Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {formatFellyDisplay(group.driver.felly)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Driver */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Driver</Text>
            <Text
              style={[
                styles.personName,
                group.driver.phoneNumber === phoneNumber &&
                  styles.currentUserText,
              ]}
            >
              {group.driver.fname} {group.driver.lname}
              {group.driver.phoneNumber === phoneNumber && " [You]"}
            </Text>
          </View>

          {/* Passengers */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Passengers ({group.passengers.length})
            </Text>
            {group.passengers.length > 0 ? (
              group.passengers.map((p, i) => {
                const isCurrentUser = p.phoneNumber === phoneNumber;
                return (
                  <Text
                    key={i}
                    style={[
                      styles.personName,
                      isCurrentUser && styles.currentUserText,
                    ]}
                  >
                    {p.fname} {p.lname} ({formatTime(p.time)} •{" "}
                    {formatFellyDisplay(p.felly)}){isCurrentUser && " [You]"}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No passengers assigned</Text>
            )}
          </View>
        </View>
      ))}

      {groupPassengers(waitlist).map((group, index) => (
        <View key={index} style={styles.carCard}>
          <View style={styles.carHeader}>
            <Text style={styles.carIcon}>🚗</Text>
            <View style={styles.carHeaderContent}>
              <Text style={styles.carTitle}>Uber {index + 1}</Text>
              <View style={styles.carTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {formatTime("regular")}
                  </Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {formatFellyDisplay("No, go back early")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Passengers */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Passengers ({group.passengers.length})
            </Text>
            {group.passengers.length > 0 ? (
              group.passengers.map((p, i) => {
                const isCurrentUser = p.phoneNumber === phoneNumber;
                return (
                  <Text
                    key={i}
                    style={[
                      styles.personName,
                      isCurrentUser && styles.currentUserText,
                    ]}
                  >
                    {p.fname} {p.lname} ({formatTime(p.time)} •{" "}
                    {formatFellyDisplay(p.felly)}){isCurrentUser && " [You]"}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No passengers assigned</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
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
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  carCard: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 20,
    marginTop: 0,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  carHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  carIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  carHeaderContent: {
    flex: 1,
  },
  carTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  carTags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  personName: {
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 20,
  },
  currentUserText: {
    color: "#4f46e5",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  waitlistCard: {
    backgroundColor: "#fefbf3",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 16,
    margin: 20,
    marginTop: 0,
    padding: 20,
  },
  waitlistHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  waitlistIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  waitlistTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ea580c",
  },
});

export default AllRidesList;
