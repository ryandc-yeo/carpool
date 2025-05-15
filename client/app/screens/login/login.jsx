import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigation = useNavigation();

    const handleLogin = () => {
        const regex = /^\d{3}\d{3}\d{4}$/;
        if (regex.test(phoneNumber)) {
            alert("Login pressed with phone number: " + phoneNumber);
            navigation.navigate("Phone Verification", { phoneNumber: phoneNumber });
        }
        else {
            alert("Please enter a valid phone number in the format XXX-XXX-XXXX");
            setPhoneNumber("");
            return;
        }
    }  

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>To get started, enter your mobile number</Text>
            <Text style={styles.subtitle}>We&apos;ll send you a code you can use to log in or create an account</Text>
            <TextInput
                placeholder="000-000-0000"
                style={styles.input}
                onChangeText={text => setPhoneNumber(text)}
                keyboardType="numeric"
            />
            <Pressable onPress={() => handleLogin()} style={styles.loginButton}>
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