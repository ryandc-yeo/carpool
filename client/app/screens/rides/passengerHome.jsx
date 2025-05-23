import { View, Text, StyleSheet, Pressable} from "react-native";
import React, {useState} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Checkbox from 'expo-checkbox';
import carData from './carData.json'
import profileData from '../profile/profileData.json'


const PassengerHome = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { role } = route.params || {};  // fallback in case it's missing

    const [isConfirmed, setIsConfirmed] = useState(false);
    
    const handleAllRides = () => {
        navigation.navigate("Ride Details", {role: role});
    }

    const handleOpenChat = () => {
        navigation.navigate("Chat");
    }

    const handleEditSignUp = () => {
        navigation.navigate("Rides SignUp");
    }

    const handleConfirmToggle = () => {
        setIsConfirmed(prev => !prev);
    }


    return (
        <View style={styles.container}>

            <Pressable style={styles.button} onPress={handleAllRides}>
                <Text style={styles.buttonText}>View All Rides</Text>
            </Pressable>

            <Text style={styles.title}>Hello {profileData.profile.firstName} {profileData.profile.lastName}!</Text>

            <Text style={styles.subtitle}>Car Details for (insert date): </Text>
            <View style={styles.textBox}>
                <Text style={styles.subtitle}>Driver: {carData.cars[0].driver[0].name}</Text>
                <Text style={styles.text}>{carData.cars[0].driver[0].phone}</Text>
                <Text style={styles.text}>{carData.cars[0].driver[0].felly}</Text>  
            </View>


            <Text style={styles.subtitle}>Your driver will pick you up at:</Text>
            <View style={styles.textBox}>
                <Text style={styles.text}>Time: (insert time)</Text>
                <Text style={styles.text}>Location: {profileData.profile.address}</Text>

            </View>

            {/*<View style={styles.section}>
                <Checkbox style={styles.checkbox} value={isConfirmed} onValueChange={setIsConfirmed} />
                <Text style={styles.paragraph}>confirm</Text>
            </View>*/}

            <View style={styles.section}>
                <Pressable
                    style={styles.button}
                    onPress={handleConfirmToggle}
                    //disabled={isConfirmed}
                >
                    <Text style={styles.buttonText}>
                    {isConfirmed ? '✓ Confirmed' : 'Confirm'}
                    </Text>
                </Pressable>
                </View>

            <Text style={styles.text}>*If you don't confirm by (insert time), your ride may be replaced.</Text>

            <Pressable style={styles.button} onPress={handleOpenChat}>
                <Text style={styles.buttonText}>Open Chat</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleEditSignUp}>
                <Text style={styles.buttonText}>Edit Sign Up</Text>
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
        backgroundColor: '#e4f1ee',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#999",
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        alignSelf: 'stretch'
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