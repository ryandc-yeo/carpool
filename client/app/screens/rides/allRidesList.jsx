import { View, Text, StyleSheet } from "react-native";
import React from "react";

const AllRidesList = () => {
    return (
        <View style={styles.container}>
            <Text>List of all Rides</Text>
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

export default AllRidesList;