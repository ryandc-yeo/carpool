import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import carData from './carData.json'

const AllRidesList = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>List of all Rides</Text>
            <ScrollView style={styles.rideContainer} showsVerticalScrollIndicator={false}>
            {carData.cars.map((car, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                    {
                        car.driver?.map((d, index) => (
                            <View key={index} style={{ marginBottom: 5 }}>
                                <Text style={styles.driverText}>Driver: {d.name} - {d.felly}</Text>
                            </View>
                        ))
                    }
                    {
                        car.passenger?.map((passenger, index) => (
                            <Text key={index}> {index +1}. {passenger.name}</Text>
                        ))
                    }
                </View>
            ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'left',
        justifyContent: 'top',
        padding: 20,
    }, 
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    rideContainer: {
        display: "flex",
        padding: 10,
        borderRadius: 5,
    },
    driverText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue',
    }
});

export default AllRidesList;