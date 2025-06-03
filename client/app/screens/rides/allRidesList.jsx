import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useNavigation, useRoute, useFocusEffect} from "@react-navigation/native";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import db from "../../src/firebase-config";

const AllRidesList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber, role } = route.params || {};

    const [carGroups, setCarGroups] = useState([]);
    const [waitlist, setWaitlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatTextDisplay = (first, last, felly, time) => {
        return first + " " + last + " - " + formatTime(time) + " - " + formatFellyDisplay(felly);
    }

    const formatFellyDisplay = (felly) => {
        if (felly === "Yes"){
            return "Felly";
        } else if (felly === "No, go back early") {
            return "No Felly";
        } 
        return felly;
    }

    const formatTime = (time) => {
        if (time === "regular") {
            return "Regular";
        } else if (time === "early") {
            return "Early";
        } 
        return time;
    }

    const handleGoBack = () => {
        if (role === "Driver") {
            navigation.navigate("Driver Home", { phoneNumber: phoneNumber });
        } else {
            navigation.navigate("Passenger Home", { phoneNumber: phoneNumber });
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
                const ridesGenerated = configSnap.exists() && configSnap.data().ridesGenerated;

                if (!ridesGenerated) {
                    //alert("Rides are not generated yet. Please check back later.");
                    navigation.navigate("Rides Not Released", {role: role});
                    return;
                }

                const driversSnapshot = await getDocs(collection(db, "Sunday Drivers"));
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

                const passengersSnapshot = await getDocs(collection(db, "Sunday Passengers"));
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
        }, [role])
    );
    

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text>Loading car assignments...</Text>
        </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>
            </View>
            <Text style={styles.title}>Sunday Rides</Text>

            {carGroups.map((group, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.cardTitle}>🚗 Car {index + 1} - {formatTime(group.driver.time)} - {formatFellyDisplay(group.driver.felly)} </Text>
                    <Text
                        style={[
                        styles.cardText,
                        group.driver.phoneNumber === phoneNumber && {
                            fontWeight: "bold",
                            color: "#007AFF",
                        },
                        ]}
                    >
                        <Text style={{ fontWeight: '600' }}>Driver: </Text>
                        {group.driver.fname} {group.driver.lname}
                        {group.driver.phoneNumber === phoneNumber && " (You)"}
                    </Text>

                    <Text style={[styles.cardText, { fontWeight: '600', marginTop: 2 }]}>Passengers:</Text>
                    {group.passengers.length > 0 ? (
                        group.passengers.map((p, i) => {
                        const isCurrentUser = p.phoneNumber === phoneNumber;
                        return (
                            <Text
                            key={i}
                            style={[
                                styles.cardText,
                                isCurrentUser && { fontWeight: "bold", color: "#007AFF" }, 
                            ]}
                            >
                            {formatTextDisplay(p.fname, p.lname, p.felly, p.time)}
                            {isCurrentUser && " (You)"}
                            </Text>
                        );
                        })
                    ) : (
                        <Text style={styles.passenger}>None assigned</Text>
                    )}
                </View>
            ))}

            {groupPassengers(waitlist).map((group, groupIndex) => (
                <View key={groupIndex} style={styles.card}>
                    <Text style={styles.cardTitle}>Uber Group {groupIndex + 1}</Text>
                    {group.map((passenger, index) => (
                        <Text 
                            key={index} 
                            style={[
                                styles.cardText, 
                                passenger.id === phoneNumber && { fontWeight: "bold", color: "#007AFF" }
                            ]}
                        >
                            {formatTextDisplay(passenger.fname, passenger.lname, passenger.felly, passenger.time)}
                            {passenger.id === phoneNumber && " (You)"}
                        </Text>
                    ))}
            </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: "#007AFF",
    },
    card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.01,
    shadowRadius: 5,
    marginBottom: 16,
    width: "100%",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },

  cardText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },
    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold", 
        marginBottom: 20,
    },
    driver: {
        marginTop: 8,
        fontWeight: "600"
    },
    subheading: {
        marginTop: 8,
        fontWeight: "bold"
    },
    passenger: {
        marginLeft: 12
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default AllRidesList;
