import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React from "react";

const Login = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.title}>Enter phone number to login</Text>
            <TextInput style={styles.input}/>
            <Pressable onPress={() => console.log("Login pressed")} style={styles.loginButton}>
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