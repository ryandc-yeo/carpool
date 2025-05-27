import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const navigation = useNavigation();

    const handleLogin = () => {
        const regex = /^\d{3}\d{3}\d{4}$/;
        if (regex.test(phoneNumber)) {
            alert("Login pressed with phone number: " + phoneNumber);
            setLoggedIn(true);
            navigation.navigate("Phone Verification", { phoneNumber: phoneNumber });
        }
        else {
            alert("Please enter a valid phone number in the format XXX-XXX-XXXX");
            setPhoneNumber("");
            return;
        }
    }

    const handleLogout = () => {
        setPhoneNumber("")
        setLoggedIn(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{loggedIn ? "You are logged in" : "Welcome!"}</Text>
            <Text style={styles.subtitle}>
                {loggedIn ? `Phone Number: ${phoneNumber}` : "To get started, enter your mobile number"}
            </Text>           
            
            {!loggedIn && (
                <>
                <Text style={styles.subtitle}>We'll send you a code you can use to log in or create an account</Text>
                <TextInput
                    placeholder="0000000000"
                    style={styles.input}
                    onChangeText={text => setPhoneNumber(text)}
                    value={phoneNumber}
                    keyboardType="numeric"
                />
                <Pressable onPress={handleLogin} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Next</Text>
                </Pressable>
                </>
            )}

            {loggedIn && (
                <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
                </Pressable>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 50,
        marginTop: 100,
    }, 
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    }, 
    subtitle: {
        fontSize: 18,
        marginBottom: 10, 
        marginTop: 10,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 20,
    }, loginButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    }, loginButtonText: {
        color: 'white',
        fontSize: 18,
    },
    logoutButton: {
    backgroundColor: "#f01e2c",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    },
    logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    },
});

export default Login;