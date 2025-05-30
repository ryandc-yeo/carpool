import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../src/util/AuthContext";

const Login = () => {
    const [pNumber, setPNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { phoneNumber, login } = useAuth();

    useEffect(() => {
        if (phoneNumber) {
            (async () => {
                const loggedIn = await login(phoneNumber);
                if (loggedIn) {
                    navigation.navigate("Rides");
                    setLoading(false);
                }
            })();
        }
        setLoading(false);
    }, []);

    const handleLogin = () => {
        const regex = /^\d{3}\d{3}\d{4}$/;
        if (regex.test(pNumber)) {
            alert("Login pressed with phone number: " + pNumber);
            navigation.navigate("Phone Verification", { phoneNumber: pNumber });
        }
        else {
            alert("Please enter a valid phone number in the format XXX-XXX-XXXX");
            setPNumber("");
            return;
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>To get started, enter your mobile number</Text>           
            
           <Text style={styles.subtitle}>We'll send you a code you can use to log in or create an account</Text>
            <TextInput
                placeholder="000-000-0000"
                style={styles.input}
                onChangeText={text => setPNumber(text)}
                value={pNumber}
                keyboardType="numeric"
            />
            <Pressable onPress={handleLogin} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Next</Text>
            </Pressable>
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
    },
    loginButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    loginButtonText: {
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
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
  },
});

export default Login;
