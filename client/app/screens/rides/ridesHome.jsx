import { View, Text, StyleSheet} from "react-native";
import React from "react";

const RidesHome = () => {
    return (
        <View style={styles.container}>
            <Text>Welcome!</Text>
            <Text>Rides Home</Text>
            <Text>Deadline Blah blah</Text>
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

export default RidesHome;