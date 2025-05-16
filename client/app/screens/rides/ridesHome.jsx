import { View, Text, StyleSheet, Pressable} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const RidesHome = () => {
    const navigation = useNavigation();
    const handleSignUp = () => {
        navigation.navigate("Rides SignUp");
    }
    // const handleAllRides = () => {
    //     navigation.navigate("Ride Details");
    // }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rides Home</Text>
            <Text style={styles.text}>
                Welcome to the rides home screen! Here you can sign up for rides and view all available rides.
            </Text>
            <Text style={styles.redText}>Deadline for Friday rides: Thursday at 10PM!</Text>
            <Text style={styles.redText}>Deadline for Sunday rides: Friday at 10PM!</Text>
            <Text style={styles.text}>Please make sure to sign up on time!</Text>
            <Pressable style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up for a Ride</Text>
            </Pressable>
            {/* <Pressable style={styles.button} onPress={handleAllRides}>
                <Text style={styles.buttonText}>View All Rides</Text>
            </Pressable> */}
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: "#555",
    }, 
    redText: {
        fontSize: 16,
        marginBottom: 10,
        color: "red",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    }, 
    buttonText: {
        color: "white",
        fontSize: 18,
    }
});

export default RidesHome;