import { View, Text, StyleSheet } from "react-native";
import React from "react";

const RidesSignUp = () => {
    return (
        <View style={styles.container}>
            <Text>Ride Info</Text>
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

export default RidesSignUp;