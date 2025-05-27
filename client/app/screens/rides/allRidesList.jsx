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
    const [loading, setLoading] = useState(true);

    const handleGoBack = () => {
        if (role === "Driver") {
            navigation.navigate("Driver Home", { phoneNumber: phoneNumber });
        } else {
            navigation.navigate("Passenger Home", { phoneNumber: phoneNumber });
        }
    };

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
                            lname: data.lname
                        },
                        passengers: Array.isArray(data.passengers) ? data.passengers : []
                    };
                });

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
            {carGroups.map((group, index) => (
                <View key={index} style={styles.card}>
                <Text style={styles.title}>🚗 Car {index + 1}</Text>
                <Text style={styles.driver}>
                    Driver: {group.driver.fname} {group.driver.lname}
                </Text>
                <Text style={styles.subheading}>Passengers:</Text>
                {group.passengers.length > 0 ? (
                    group.passengers.map((p, i) => (
                    <Text key={i} style={styles.passenger}>
                        - {p.fname} {p.lname}
                    </Text>
                    ))
                ) : (
                    <Text style={styles.passenger}>None assigned</Text>
                )}
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
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: "#007AFF",
    },
    card: {
    backgroundColor: "#f7f9fa",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
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
        fontSize: 18,
        fontWeight: "bold"
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
