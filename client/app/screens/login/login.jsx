import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Login = () => {
    return (
        <View style={styles.container}>
            <Text>Login</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'top',
        padding: 20,
    }
});

export default Login;