import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { useState } from "react";

const RidesSignUp = () => {
    const [isChecked, setChecked] = useState(false);

    return (

        <View style={styles.container}>
            <Text>Ride Signup</Text>
            <Text>Are you a...</Text>
            <Text>If you are a driver, how many people can you drive (excluding you?) </Text>
            <TextInput
                styles={styles.input}
                placeholder="Insert Text"
            />
            <Text>Select which days you want a ride:</Text>
            
            <Text>Stay for lunch or go back immediately?</Text>

            <Text>Please check this box if you are a newcomer!</Text>

            <Text>Questions, comments, or concerns?</Text>
            <TextInput
                //styles={styles.input}
                placeholder="Insert Text"
            />

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