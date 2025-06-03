import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import db from "../../src/firebase-config";

const AdminHome = () => {
    const [cars, setCars] = useState([]);

    const fetchPeople = async (day) => {
        const driversSnapshot = await getDocs(collection(db, `${day} Drivers`));
        const passengersSnapshot = await getDocs(collection(db, `${day} Passengers`));

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

    // car assignments
    // 1. same pickup time: "early"
    // 2. same felly: "felly" or "no felly"
    // 3. location: "hill", "south of wilshire", "north of wilshire"
    const assignCars = (drivers, passengers) => {
        const cars = [];
        let unassignedPassengers = [...passengers];

        // prioritize early drivers first
        const sortedDrivers = drivers.sort((a,b) => {
            if (a.time === "early" && b.time !== "early") return -1; 
            if (a.time === "early" && b.time === "early") return 1;
            return 0;
        })

        for (let i = 0; i < sortedDrivers.length; i++) {
            const driver = sortedDrivers[i];
            const car = {
                driver: driver,
                passengers: []
            };

            const priorityGroups = [];

            if (driver.time === "early") {
                // early drivers need to have early passengers
                const earlyPassengers = unassignedPassengers.filter(p => p.time === "early");
                const regularPassengers = unassignedPassengers.filter(p => p.time !== "early");
                priorityGroups.push(
                    // 1. early + same felly + same location
                    earlyPassengers.filter(p => p.felly === driver.felly && p.location === driver.location),
                    // 2. early + same felly + diff location
                    earlyPassengers.filter(p => p.felly === driver.felly && p.location !== driver.location),
                    // 3. early + diff felly + same location
                    earlyPassengers.filter(p => p.felly !== driver.felly && p.location === driver.location),
                    // 4. early + diff felly + diff location
                    earlyPassengers.filter(p => p.felly !== driver.felly && p.location !== driver.location),
                    // 5. reg + same felly + same location
                    regularPassengers.filter(p => p.felly === driver.felly && p.location === driver.location),
                    // 6. reg + same felly + diff location
                    regularPassengers.filter(p => p.felly === driver.felly && p.location !== driver.location),
                    // 7. reg + diff felly + same location
                    regularPassengers.filter(p => p.felly !== driver.felly && p.location === driver.location),
                    // 8. reg + diff felly + diff location
                    regularPassengers.filter(p => p.felly !== driver.felly && p.location !== driver.location)
                ); 
            } else {
                // regular drivers prioritize by felly and location only
                priorityGroups.push(
                    // 1. same felly + same location
                    unassignedPassengers.filter(p => p.felly === driver.felly && p.location === driver.location),
                    // 2. same felly + diff location
                    unassignedPassengers.filter(p => p.felly === driver.felly && p.location !== driver.location),
                    // 3. diff felly + same location
                    unassignedPassengers.filter(p => p.felly !== driver.felly && p.location === driver.location),
                    // 4. diff felly + diff location
                    unassignedPassengers.filter(p => p.felly !== driver.felly && p.location !== driver.location)
                );
            }

            let capacity = driver.capacity || 4;
            let assignedCount = 0;
            for (const group of priorityGroups) {
                if (assignedCount >= capacity) break;
                for (const passenger of group) {
                    if (assignedCount >= capacity) break;

                    // remove assigned passenger from unassigned list
                    if (unassignedPassengers.find(p => p.phoneNumber === passenger.phoneNumber)) {
                        car.passengers.push(passenger);
                        assignedCount++;
                        
                        unassignedPassengers = unassignedPassengers.filter(p => 
                            p.phoneNumber !== passenger.phoneNumber
                        );
                    }
                }
            }
        
            cars.push(car);
            if (unassignedPassengers.length === 0){
                break;
            }
        }

        return cars;
    };

    const updateAssignmentsInFirestore = async (cars, day) => {
        for (const car of cars) {
            const driverRef = doc(db, `${day} Drivers`, car.driver.phoneNumber);

            await updateDoc(driverRef, {
                passengers: car.passengers.map(p => ({
                    phoneNumber: p.phoneNumber || "",
                    fname: p.fname || "",
                    lname: p.lname || "",
                    address: p.address || "", 
                    felly: p.felly || "",
                    time: p.time || "",
                }))
            });

            for (const passenger of car.passengers) {
                const passengerRef = doc(db, `${day} Passengers`, passenger.phoneNumber);
                await updateDoc(passengerRef, {
                    driver: {
                        phoneNumber: car.driver.phoneNumber || "",
                        fname: car.driver.fname || "",
                        lname: car.driver.lname || ""
                    }
                });
            }
        }
    };

    const organizeRides = async (day) => {
        try {
            const { drivers, passengers } = await fetchPeople(day);
            const cars = assignCars(drivers, passengers);
            await updateAssignmentsInFirestore(cars, day);
            alert("Cars have been assigned.");
            setCars(cars);
        } catch (error) {
            console.error("Failed to organize rides:", error);
        }

        await setDoc(doc(db, "meta", "config"), {
            ridesGenerated: true
        }, { merge: true });
    };

    const resetAssignments = async (day) => {
        try {
            const passengersSnapshot = await getDocs(collection(db, `${day} Passengers`));
            for (const docSnap of passengersSnapshot.docs) {
                const passengerRef = doc(db, `${day} Passengers`, docSnap.id);
                await updateDoc(passengerRef, {
                    driver: null,
                    acknowledged: false,
                    pickupTime:"",
                });
            }

            const driversSnapshot = await getDocs(collection(db, `${day} Drivers`));
            for (const docSnap of driversSnapshot.docs) {
                const driverRef = doc(db, `${day} Drivers`, docSnap.id);
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

            {/* for friday rides */}
            <Text style={styles.title}>Friday Rides</Text>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => organizeRides("Friday")}>
                    <Text style={styles.buttonText}>Generate Friday Car Assignments</Text>
                </Pressable>

                <Pressable style={[styles.button, { backgroundColor: 'red' }]} onPress={() => resetAssignments("Friday")}>
                    <Text style={styles.buttonText}>Reset Friday Assignments</Text>
                </Pressable>
            </View>

            {/* for sunday rides */}
            <Text style={styles.title}>Sunday Rides</Text>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => organizeRides("Sunday")}>
                    <Text style={styles.buttonText}>Generate Sunday Car Assignments</Text>
                </Pressable>

                <Pressable style={[styles.button, { backgroundColor: 'red' }]} onPress={() => resetAssignments("Sunday")}>
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