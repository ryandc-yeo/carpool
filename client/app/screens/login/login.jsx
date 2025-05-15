import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, {useState} from "react";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleLogin = () => {
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        if (regex.test(phoneNumber) || phoneNumber === "") {
            setPhoneNumber(phoneNumber);
        }
        else {
            alert("Please enter a valid phone number in the format xxx-xxx-xxxx");
        }
        console.log("Login pressed with phone number:", phoneNumber);
    }  

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome! Create your profile</Text>
            <Text style={styles.subtitle}>Phone Number</Text>
            <TextInput
                placeholder="000-000-0000"
                style={styles.input}
                onChanggeText={text => setPhoneNumber(text)}
                keyboardType="numeric"
            />
            <Pressable onPress={() => handleLogin} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
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
        marginBottom: 20,
    }, input: {
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
    }
});

export default Login;