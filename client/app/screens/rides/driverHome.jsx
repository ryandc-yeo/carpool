import { View, Text, StyleSheet, Pressable, TextInput} from "react-native";
import React, {useState} from "react";
import { useNavigation, useRoute} from "@react-navigation/native";

const DriverHome = () => {
    const [hasTime, setHasTime] = useState(false);
    const [time1, setTime1] = useState("");
    const [time2, setTime2] = useState("");
    const [time3, setTime3] = useState("");
    const [time4, setTime4] = useState("");
    const navigation = useNavigation();
    const route = useRoute(); 
    const { role } = route.params || {};

    const handleSetTime = () => {
        if (time1 && time2 && time3 && time4) {
            setHasTime(true);
        }
    }
    const handleAllRides = () => {
        navigation.navigate("Ride Details", {role: role});
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Driver Home</Text>
            <Text style={styles.text}>Thank you for being a driver!</Text>
            <Pressable style={styles.button} onPress={handleAllRides}>
                <Text style={styles.buttonText}>View All Rides</Text>
            </Pressable>
            <Text style={styles.text}>Set time for passengers</Text>
            <Text>Passenger 1: </Text>
            <TextInput placeholder="6:50PM" style={styles.input} onChangeText={text => setTime1(text)}/>
            <Text>Passenger 2: </Text>
            <TextInput placeholder="6:50PM" style={styles.input} onChangeText={text => setTime2(text)}/>
            <Text>Passenger 3: </Text>
            <TextInput placeholder="6:50PM" style={styles.input} onChangeText={text => setTime3(text)}/>
            <Text>Passenger 4: </Text>
            <TextInput placeholder="6:50PM" style={styles.input} onChangeText={text => setTime4(text)}/>
            {hasTime ? (
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Edit Time</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => navigation.navigate("Chat")}>
                        <Text style={styles.buttonText}>Open Chat</Text>
                    </Pressable>
                </View>
            ) : (
                <Pressable style={styles.button} onPress={handleSetTime}>
                    <Text style={styles.buttonText}>Send Times</Text>
                </Pressable>
            )}
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
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: "80%",
    },
    button: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        margin: 20,
    }, 
    buttonText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
    }
});

export default DriverHome;