import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, {useState} from "react";
import { useNavigation, useRoute} from "@react-navigation/native";


const PhoneVerification = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const route = useRoute();
    const {phoneNumber} = route.params;
    const navigation = useNavigation();

    const handleVerification = () => {
        const regex = /^\d{6}$/;
        if (regex.test(verificationCode)) {
            alert("Verification code pressed with code: " + verificationCode);
            // verify code with backend
            // go to profile screen
            navigation.navigate("Profile", { phoneNumber: phoneNumber });
        }
        else {
            alert("Please enter a valid six-digit verification code");
            setVerificationCode("");
            return;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please enter the six-digit code sent to {phoneNumber}</Text>
            <TextInput
                placeholder="000000"
                style={styles.input}
                onChangeText={text => setVerificationCode(text)}
                keyboardType="numeric"
            />
            <Pressable onPress={() => handleVerification()} style={styles.loginButton}>
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

export default PhoneVerification;