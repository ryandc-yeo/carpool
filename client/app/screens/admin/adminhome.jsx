import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { collection, getDocs, doc, updateDoc, setDoc, writeBatch } from "firebase/firestore";
import db from "../../src/firebase-config";

const AdminHome = () => {
    const [cars, setCars] = useState({});
    const [loading, setLoading] = useState({});

    const fetchPeople = async (day) => {
        const [driversSnapshot, passengersSnapshot] = await Promise.all([
            getDocs(collection(db, `${day} Drivers`)),
            getDocs(collection(db, `${day} Passengers`))
        ]);

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

    const assignCars = useCallback((drivers, passengers) => {
        const cars = [];
        let unassigned = [...passengers];
        
        // sort drivers
        const sortedDrivers = drivers.sort((a, b) => {
            if (a.time === "early" && b.time !== "early") return -1;
            if (a.time !== "early" && b.time === "early") return 1;
            return (b.capacity || 4) - (a.capacity || 4);
        });

        for (const driver of sortedDrivers) {
            const car = { driver, passengers: [] };
            const capacity = driver.capacity || 4;
            
            // priority-based passenger groups
            const groups = createPriorityGroups(driver, unassigned);
            
            // passengers assigned based on priority
            for (const group of groups) {
                if (car.passengers.length >= capacity) break;
                
                const needed = capacity - car.passengers.length;
                const toAssign = group.slice(0, needed);
                
                car.passengers.push(...toAssign);
                unassigned = unassigned.filter(p => 
                    !toAssign.some(assigned => assigned.phoneNumber === p.phoneNumber)
                );
            }
            
            cars.push(car);
            if (unassigned.length === 0) break;
        }
        
        return { cars, unassigned };
    }, []);

    const createPriorityGroups = (driver, passengers) => {
        const groups = [];
        
        if (driver.time === "early") {
            // early: prioritize early, then no-pref, then regular
            const early = passengers.filter(p => p.time === "early");
            const noPref = passengers.filter(p => p.time === "no_preference");
            const regular = passengers.filter(p => p.time === "regular");
            
            // sort each time group by compatibility (felly match + location match)
            groups.push(
                ...sortByCompatibility(early, driver),
                ...sortByCompatibility(noPref, driver),
                ...sortByCompatibility(regular, driver)
            );
        } else {
            // reg drivers: no-pref passengers, then regular
            const noPref = passengers.filter(p => p.time === "no_preference");
            const regular = passengers.filter(p => p.time === "regular");
            const early = passengers.filter(p => p.time === "early");
            
            groups.push(
                ...sortByCompatibility(noPref, driver),
                ...sortByCompatibility(regular, driver),
                ...sortByCompatibility(early, driver)
            );
        }
        
        return groups.filter(group => group.length > 0);
    };

    const sortByCompatibility = (passengers, driver) => {
        // compatibility: same felly + same location to diff felly + diff location
        const sameFellySameLocation = passengers.filter(p => 
            p.felly === driver.felly && p.location === driver.location
        );
        const sameFellyDiffLocation = passengers.filter(p => 
            p.felly === driver.felly && p.location !== driver.location
        );
        const diffFellySameLocation = passengers.filter(p => 
            p.felly !== driver.felly && p.location === driver.location
        );
        const diffFellyDiffLocation = passengers.filter(p => 
            p.felly !== driver.felly && p.location !== driver.location
        );
        
        return [
            sameFellySameLocation,
            sameFellyDiffLocation, 
            diffFellySameLocation,
            diffFellyDiffLocation
        ];
    };

    const updateAssignmentsInFirestore = async (assignmentResult, day) => {
        const batch = writeBatch(db);
        const { cars, unassigned } = assignmentResult;

        // update drivers w passengers
        for (const car of cars) {
            const driverRef = doc(db, `${day} Drivers`, car.driver.phoneNumber);
            batch.update(driverRef, {
                passengers: car.passengers.map(p => ({
                    phoneNumber: p.phoneNumber || "",
                    fname: p.fname || "",
                    lname: p.lname || "",
                    address: p.address || "", 
                    felly: p.felly || "",
                    time: p.time || "",
                    location: p.location || ""
                }))
            });

            // update passengers w driver
            for (const passenger of car.passengers) {
                const passengerRef = doc(db, `${day} Passengers`, passenger.phoneNumber);
                batch.update(passengerRef, {
                    driver: {
                        phoneNumber: car.driver.phoneNumber || "",
                        fname: car.driver.fname || "",
                        lname: car.driver.lname || ""
                    }
                });
            }
        }

        // for uber passengers
        for (const passenger of unassigned) {
            const passengerRef = doc(db, `${day} Passengers`, passenger.phoneNumber);
            batch.update(passengerRef, {
                driver: {
                    phoneNumber: "uber",
                    fname: "Uber",
                    lname: "Ride"
                }
            });
        }

        await batch.commit();
    };

    const organizeRides = async (day) => {
        setLoading(prev => ({ ...prev, [day]: true }));
        
        try {
            const { drivers, passengers } = await fetchPeople(day);
            
            if (drivers.length === 0) {
                Alert.alert("No Drivers", `No drivers found for ${day}. Please add drivers first.`);
                return;
            }
            
            if (passengers.length === 0) {
                Alert.alert("No Passengers", `No passengers found for ${day}. Please add passengers first.`);
                return;
            }

            const assignmentResult = assignCars(drivers, passengers);
            await updateAssignmentsInFirestore(assignmentResult, day);
            setCars(prev => ({ ...prev, [day]: assignmentResult }));
            
            // rides generated flag
            await setDoc(doc(db, "meta", "config"), {
                ridesGenerated: true,
                [`${day.toLowerCase()}RidesGenerated`]: true
            }, { merge: true });

            const { cars, unassigned } = assignmentResult;
            let message = `Cars assigned successfully!\n\n`;
            message += `• ${cars.length} cars created\n`;
            message += `• ${cars.reduce((sum, car) => sum + car.passengers.length, 0)} passengers assigned\n`;
            if (unassigned.length > 0) {
                message += `• ${unassigned.length} passengers unassigned`;
            }
            
            Alert.alert("Success", message);
            
        } catch (error) {
            console.error("Failed to organize rides:", error);
            Alert.alert("Error", "Failed to organize rides. Please try again.");
        } finally {
            setLoading(prev => ({ ...prev, [day]: false }));
        }
    };

    const resetAssignments = async (day) => {
        Alert.alert(
            "Confirm Reset",
            `Are you sure you want to reset all ${day} assignments? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: () => performReset(day) }
            ]
        );
    };

    const performReset = async (day) => {
        setLoading(prev => ({ ...prev, [`${day}_reset`]: true }));
        
        try {
            const batch = writeBatch(db);

            // reset passengers
            const passengersSnapshot = await getDocs(collection(db, `${day} Passengers`));
            for (const docSnap of passengersSnapshot.docs) {
                const passengerRef = doc(db, `${day} Passengers`, docSnap.id);
                batch.update(passengerRef, {
                    driver: null,
                    acknowledged: false,
                    pickupTime: "",
                });
            }

            // reset drivers
            const driversSnapshot = await getDocs(collection(db, `${day} Drivers`));
            for (const docSnap of driversSnapshot.docs) {
                const driverRef = doc(db, `${day} Drivers`, docSnap.id);
                batch.update(driverRef, {
                    passengers: []
                });
            }

            // update meta config
            batch.set(doc(db, "meta", "config"), {
                ridesGenerated: false,
                [`${day.toLowerCase()}RidesGenerated`]: false
            }, { merge: true });

            await batch.commit();

            setCars(prev => ({ ...prev, [day]: null }));
            Alert.alert("Success", "All assignments have been reset.");
            
        } catch (error) {
            console.error("Failed to reset assignments:", error);
            Alert.alert("Error", "Failed to reset assignments. Please try again.");
        } finally {
            setLoading(prev => ({ ...prev, [`${day}_reset`]: false }));
        }
    };

    const renderDaySection = (day) => {
        const isGenerating = loading[day];
        const isResetting = loading[`${day}_reset`];
        const dayData = cars[day];

        return (
            <View key={day} style={styles.daySection}>
                <Text style={styles.sectionTitle}>{day} Rides</Text>
                
                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={[styles.button, isGenerating && styles.buttonDisabled]} 
                        onPress={() => organizeRides(day)}
                        disabled={isGenerating || isResetting}
                    >
                        <Text style={styles.buttonText}>
                            {isGenerating ? "Generating..." : `Generate ${day} Assignments`}
                        </Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button, styles.resetButton, isResetting && styles.buttonDisabled]} 
                        onPress={() => resetAssignments(day)}
                        disabled={isGenerating || isResetting}
                    >
                        <Text style={styles.buttonText}>
                            {isResetting ? "Resetting..." : `Reset ${day} Assignments`}
                        </Text>
                    </Pressable>
                </View>

                {dayData && (
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsTitle}>Last Assignment Stats:</Text>
                        <Text style={styles.statsText}>
                            {dayData.cars.length} cars • {' '}
                            {dayData.cars.reduce((sum, car) => sum + car.passengers.length, 0)} passengers assigned
                            {dayData.unassigned.length > 0 && ` • ${dayData.unassigned.length} unassigned`}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Rides Home Admin</Text>
            <Text style={styles.subtitle}>Manage ride assignments for Friday and Sunday</Text>
            
            {renderDaySection("Friday")}
            {renderDaySection("Sunday")}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    daySection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
    },
    resetButton: {
        backgroundColor: '#FF3B30',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    statsContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    statsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
    },
});

export default AdminHome;