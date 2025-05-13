import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Chat = () => {
    return (
        <View style={styles.container}>
            <Text>Chat</Text>
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

export default Chat;