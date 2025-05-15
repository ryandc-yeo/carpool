import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import Checkbox from 'expo-checkbox';

const RidesSignUp = () => {
    const roleOptions = ["Passenger", "Driver"];
    const fridayOptions = ["Early (5pm)", "Regular (6:30pm"]
    const sundayOptions = ["Early (8am)", "Regular (10:45am)"]
    const fellyOptions = ["Yes", "No, go back early"]

    const [role, setRole] = useState("");
    const [friday, setFriday] = useState("");
    const [sunday, setSunday] = useState("");
    const [felly, setFelly] = useState("");
    const [isNewcomer, setisNewcomer] = useState(false);


    return (

        <View style={styles.container}>
            <Text style={styles.title}>Rides Signup</Text>

            <Text style={styles.subtitle}>Are you a...</Text>
            {roleOptions.map((r) => (
                <View key={r} style={styles.radioRow}>
                    <Pressable
                        style={[
                          styles.radioButtonOuter,
                          role === r && styles.radioButtonOuterSelected,
                        ]}
                        onPress={() => setRole(r)}
                    >
                        {role === r && <View style={styles.radioButtonInner} />}
                    </Pressable>
                    <Text style={styles.radioText}>{r}</Text>
                </View>
            ))}

            <Text style={styles.subtitle}>If you are a driver, how many people can you drive (excluding you?) </Text>
            <TextInput placeholder="Input here" style={styles.input} />
            

            <Text style={styles.subtitle}>Select which days you want a ride:</Text>
            <View style={styles.horizontalGroup}>
                <View>
                    <Text>Friday</Text>
                    {fridayOptions.map((f) => (
                        <View key={f} style={styles.radioRow}>
                            <Pressable
                                style={[
                                styles.radioButtonOuter,
                                friday === f && styles.radioButtonOuterSelected,
                                ]}
                                onPress={() => setFriday(f)}
                            >
                                {friday === f && <View style={styles.radioButtonInner} />}
                            </Pressable>
                            <Text style={styles.radioText}>{f}</Text>
                        </View>
                    ))}
                </View>

                <View>
                    <Text>Sunday</Text>
                    {sundayOptions.map((s) => (
                        <View key={s} style={styles.radioRow}>
                            <Pressable
                                style={[
                                styles.radioButtonOuter,
                                sunday === s && styles.radioButtonOuterSelected,
                                ]}
                                onPress={() => setSunday(s)}
                            >
                                {sunday === s && <View style={styles.radioButtonInner} />}
                            </Pressable>
                            <Text style={styles.radioText}>{s}</Text>
                        </View>
                    ))}
                </View>

            </View>

            
            
            <Text style={styles.subtitle}>Stay for lunch or go back immediately?</Text>

            {fellyOptions.map((f) => (
                <View key={f} style={styles.radioRow}>
                    <Pressable
                        style={[
                          styles.radioButtonOuter,
                          felly === f && styles.radioButtonOuterSelected,
                        ]}
                        onPress={() => setFelly(f)}
                    >
                        {felly === f && <View style={styles.radioButtonInner} />}
                    </Pressable>
                    <Text style={styles.radioText}>{f}</Text>
                </View>
            ))}

            <Text style={styles.subtitle}>Please check this box if you are a newcomer!</Text>
            <View style={styles.section}>
                <View style = {styles.horizontalGroup}>
                    <Checkbox style={styles.checkbox} value={isNewcomer} onValueChange={setisNewcomer} />
                    <Text style={styles.paragraph}>I am a newcomer!</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>Questions, comments, or concerns?</Text>
            <TextInput placeholder="Input here" style={styles.input} />

            <Pressable style={styles.button} onPress={() => console.log("Submit")}>
                <Text style={styles.buttonText}>Submit</Text>
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 20,
      },
    horizontalGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap:15
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 18,
        marginBottom: 10, 
        marginTop: 10,
    },
      input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        width: "80%",
        paddingLeft: 10,
      },
      radioRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      },
      radioText: {
        marginLeft: 10,
        fontSize: 16,
      },
      radioButtonOuter: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#999",
        alignItems: "center",
        justifyContent: "center",
      },
      radioButtonOuterSelected: {
        borderColor: "#007AFF",
      },
      radioButtonInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: "#007AFF",
      },
      button: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
      }, 
      buttonText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
      },
});

export default RidesSignUp;