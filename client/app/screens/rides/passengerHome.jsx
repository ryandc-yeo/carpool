import { View, Text, StyleSheet, Pressable} from "react-native";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import Checkbox from 'expo-checkbox';
import carData from './carData.json'
import profileData from '../profile/profileData.json'


const PassengerHome = () => {
    const navigation = useNavigation();
    const [isConfirmed, setIsConfirmed] = useState(false);
    
    const handleAllRides = () => {
        navigation.navigate("Ride Details");
    }

    const handleOpenChat = () => {
        navigation.navigate("Chat");
    }

    const handleEditSignUp = () => {
        navigation.navigate("Rides SignUp");
    }

    return (
        <View style={styles.container}>

            <Pressable style={styles.button} onPress={handleAllRides}>
                <Text style={styles.buttonText}>View All Rides</Text>
            </Pressable>

            <Text style={styles.title}>Hello {profileData.profile.firstName} {profileData.profile.lastName}!</Text>

            <Text style={styles.subtitle}>Car Details: </Text>
            <View style={styles.textBox}>
                <Text style={styles.subtitle}>Driver: {carData.cars[0].driver[0].name}</Text>
                <Text style={styles.text}>{carData.cars[0].driver[0].phone}</Text>
                <Text style={styles.text}>{carData.cars[0].driver[0].felly}</Text>
            </View>


            <Text style={styles.subtitle}>Your driver will pick you up at:</Text>
            <View style={styles.textBox}>
                <Text style={styles.text}>Pickup time: 6:50pm</Text>
                <Text style={styles.text}>Location: DNTA</Text>

            </View>
            <View style={styles.section}>
                <Checkbox style={styles.checkbox} value={isConfirmed} onValueChange={setIsConfirmed} />
                <Text style={styles.paragraph}>confirm</Text>
            </View>

            <Text style={styles.text}>*If you don't confirm by 6:30pm, your ride will be replaced.</Text>


            <Pressable style={styles.button} onPress={handleEditSignUp}>
                <Text style={styles.buttonText}>Edit Sign Up</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleOpenChat}>
                <Text style={styles.buttonText}>Open Chat</Text>
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 20,
      },
      question: {
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
        width: "100%",
      },
    horizontalGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap:15
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
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
    },
    text: {
        fontSize: 14,
        marginBottom: 10,
        color: "#555",
    },

    textBox: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#999",
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        width: "80%",
        paddingLeft: 10,
      },
      radioRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      },
      radioText: {
        marginLeft: 10,
        fontSize: 16,
      },
      radioButtonOuter: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#999",
        alignItems: "center",
        justifyContent: "center",
      },
      radioButtonOuterSelected: {
        borderColor: "#007AFF",
      },
      radioButtonInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: "#007AFF",
      },
      button: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
      }, 
      buttonText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
      }
    
});

export default PassengerHome;