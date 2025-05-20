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
   
    // Not sure how this function works entirely, so can change later. For now, updates fine
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
                Welcome to the rides page! You can sign up and view available rides here.
            </Text>
            <View style={styles.question}>
                <Text style={styles.text}>Please fill out this form each week. The deadlines for this week are:</Text>  
                <Text style={styles.redText}>• THURSDAY EVENING at 10PM for Friday rides ({fridayDate})</Text>
                <Text style={styles.redText}>• FRIDAY EVENING at 10PM for Sunday rides ({sundayDate})</Text>
            
            </View>
            <Text style={styles.text}>Be sure to sign up before the deadline — spots may not be guaranteed afterward.</Text>

            <Pressable style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up for a Ride</Text>
            </Pressable>
           
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
    subtitle: {
        fontSize: 18,
        marginBottom: 10, 
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: "#555",
    }, 
    redText: {
        fontSize: 16,
        marginBottom: 10,
        color: "#f01e2c",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    }, 

    buttonText: {
        color: "white",
        fontSize: 18,
    },
    question: {
        marginBottom: 20,
        padding: 30,
        justifyContent: "center",
        alignItems: "left",
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
        width: "100%",
      },
});

export default RidesHome;