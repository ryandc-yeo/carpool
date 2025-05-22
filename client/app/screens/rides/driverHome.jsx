import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../src/firebase-config";

const DriverHome = () => {
    const { phoneNumber } = useRoute().params;
    const [passengers, setPassengers] = useState([]);
    const [pickupTimes, setPickupTimes] = useState({});

    useEffect(() => {
        const loadDriverInfo = async () => {
            const driverRef = doc(db, "Sunday Drivers", phoneNumber);
            const driverSnap = await getDoc(driverRef);

            if (driverSnap.exists()) {
                const data = driverSnap.data();
                setPassengers(data.passengers || []);
                setPickupTimes(
                    Object.fromEntries(
                        (data.passengers || []).map(p => [p.phoneNumber, p.pickupTime || ""])
                    )
                );
            }
        };

        loadDriverInfo();
    }, []);

    const handleTimeChange = (phone, time) => {
        setPickupTimes(prev => ({ ...prev, [phone]: time }));
    };

    const handleSubmitTimes = async () => {
        const updatedPassengers = passengers.map(p => ({
            ...p,
            pickupTime: pickupTimes[p.phoneNumber] || "",
            acknowledged: false
        }));

        await updateDoc(doc(db, "Sunday Drivers", phoneNumber), {
            passengers: updatedPassengers
        });

        for (const p of updatedPassengers) {
            await updateDoc(doc(db, "Sunday Passengers", p.phoneNumber), {
                pickupTime: p.pickupTime,
                acknowledged: false
            });
        }

        alert("Pickup times saved!");
        setPassengers(updatedPassengers);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Your Passengers</Text>
            {passengers.map((p, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.name}>{p.fname} {p.lname}</Text>
                    <Text style={styles.address}>{p.address || "No address"}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter pickup time"
                        value={pickupTimes[p.phoneNumber] || ""}
                        onChangeText={text => handleTimeChange(p.phoneNumber, text)}
                    />
                    <Text style={styles.status}>
                        Acknowledged: {p.acknowledged ? "YES" : "NO"}
                    </Text>
                </View>
            ))}

            <Pressable title="Submit Pickup Times" onPress={handleSubmitTimes} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20
    },
    card: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16
    },
    name: {
        fontSize: 18,
        fontWeight: "bold"
    },
    address: {
        marginTop: 4,
        fontStyle: "italic"
    },
    input: {
        borderColor: "#ccc",
        borderWidth: 1,
        marginTop: 10,
        padding: 8,
        borderRadius: 6
    },
    status: {
        marginTop: 10,
        fontWeight: "600"
    }
});

export default DriverHome;
