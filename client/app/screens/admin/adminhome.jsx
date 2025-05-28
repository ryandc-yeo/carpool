import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import db from "../../src/firebase-config";

const AdminHome = () => {
    const [cars, setCars] = useState([]);

    const fetchPeople = async () => {
        const driversSnapshot = await getDocs(collection(db, "Sunday Drivers"));
        const passengersSnapshot = await getDocs(collection(db, "Sunday Passengers"));

        const drivers = driversSnapshot.docs.map(doc => ({
            phoneNumber: doc.id,
            ...doc.data()
        }));

        const passengers = passengersSnapshot.docs.map(doc => ({
            phoneNumber: doc.id,
            ...doc.data()
        }));

        return { drivers, passengers };
    };

    const assignCars = (drivers, passengers) => {
        const shuffledPassengers = passengers.sort(() => 0.5 - Math.random());
        const cars = [];

        let passengerIndex = 0;

        for (let i = 0; i < drivers.length; i++) {
            const car = {
                driver: drivers[i],
                passengers: []
            };

            for (let j = 0; j < 4 && passengerIndex < shuffledPassengers.length; j++) {
                car.passengers.push(shuffledPassengers[passengerIndex++]);
            }

            cars.push(car);
        }

        return cars;
    };

    const updateAssignmentsInFirestore = async (cars) => {
        for (const car of cars) {
            const driverRef = doc(db, "Sunday Drivers", car.driver.phoneNumber);

            await updateDoc(driverRef, {
                passengers: car.passengers.map(p => ({
                    phoneNumber: p.phoneNumber,
                    fname: p.fname,
                    lname: p.lname,
                    address: p.address
                }))
            });

            for (const passenger of car.passengers) {
                const passengerRef = doc(db, "Sunday Passengers", passenger.phoneNumber);
                await updateDoc(passengerRef, {
                    driver: {
                        phoneNumber: car.driver.phoneNumber,
                        fname: car.driver.fname,
                        lname: car.driver.lname,
                    }
                });
            }
        }
    };

    const organizeRides = async () => {
        try {
            const { drivers, passengers } = await fetchPeople();
            const cars = assignCars(drivers, passengers);
            await updateAssignmentsInFirestore(cars);
            alert("Cars have been assigned.");
            setCars(cars);
        } catch (error) {
            console.error("Failed to organize rides:", error);
        }

        await setDoc(doc(db, "meta", "config"), {
            ridesGenerated: true
        }, { merge: true });
    };

    const resetAssignments = async () => {
        try {
            const passengersSnapshot = await getDocs(collection(db, "Sunday Passengers"));
            for (const docSnap of passengersSnapshot.docs) {
                const passengerRef = doc(db, "Sunday Passengers", docSnap.id);
                await updateDoc(passengerRef, {
                    driver: null,
                    acknowledged: false,
                    pickupTime:"",
                });
            }

            const driversSnapshot = await getDocs(collection(db, "Sunday Drivers"));
            for (const docSnap of driversSnapshot.docs) {
                const driverRef = doc(db, "Sunday Drivers", docSnap.id);
                await updateDoc(driverRef, {
                    passengers: []
                });
            }

            alert("All assignments have been reset.");
            setCars([]);
        } catch (error) {
            console.error("Failed to reset assignments:", error);
            alert("Error resetting assignments.");
        }

        await setDoc(doc(db, "meta", "config"), {
            ridesGenerated: false
        }, { merge: true });

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rides Home</Text>

            {/* for sunday rides */}
            <Text style={styles.title}>Sunday Rides</Text>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={organizeRides}>
                    <Text style={styles.buttonText}>Generate Sunday Car Assignments</Text>
                </Pressable>

                <Pressable style={[styles.button, { backgroundColor: 'red' }]} onPress={resetAssignments}>
                    <Text style={styles.buttonText}>Reset Sunday Assignments</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'top',
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        marginRight: 8,
        flex: 1,
        alignItems: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    }
});

export default AdminHome;
