import { View, Text, StyleSheet, Pressable} from "react-native";
import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";

const RidesHome = () => {
    const navigation = useNavigation();

    const [fridayDate, setFridayDate] = useState('');
    const [sundayDate, setSundayDate] = useState('');


    const handleSignUp = () => {
        navigation.navigate("Rides SignUp");
    }
    // const handleAllRides = () => {
    //     navigation.navigate("Ride Details");
    // }

    useEffect(() => {
        const calculateDates = () => {
            const today = new Date();
            // 0 for Sunday, 6 for Saturday
            const day = today.getDay(); 
            
            //Calculate days until next friday
            const daysUntilFriday = (5 - day + 7) % 7;
            // If today is friday, use 0 instead of 7 because we want this friday
            const fridayDaysToAdd = daysUntilFriday === 0 ? 0 : daysUntilFriday;
            const daysUntilSunday = (0 - day + 7) % 7;
            const sundayDaysToAdd = daysUntilSunday === 0 ? 0 : daysUntilSunday;
            
            const fridayDateObj = new Date(today);
            fridayDateObj.setDate(today.getDate() + fridayDaysToAdd);
            const sundayDateObj = new Date(today);
            sundayDateObj.setDate(today.getDate() + sundayDaysToAdd);
            
            const formatDate = (date) => {
                return `${date.getMonth() + 1}/${date.getDate()}`;
            };
            
            setFridayDate(formatDate(fridayDateObj));
            setSundayDate(formatDate(sundayDateObj));
        };
        calculateDates()
    })
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rides Home</Text>
            <Text style={styles.text}>
                Welcome to the rides home screen! Here you can sign up for rides and view all available rides.
            </Text>
            <Text style={styles.redText}>Deadline for Friday {fridayDate} rides: Thursday at 10PM!</Text>
            <Text style={styles.redText}>Deadline for Sunday {sundayDate} rides: Friday at 10PM!</Text>
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