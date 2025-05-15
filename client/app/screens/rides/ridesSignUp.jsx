import { View, Text, TextInput, StyleSheet, Pressable, ScrollView} from "react-native";
import React, { useState } from "react";
import Checkbox from 'expo-checkbox';

const RidesSignUp = () => {
    const roleOptions = ["Passenger", "Driver"];
    const fridayOptions = ["Early (5pm)", "Regular (6:30pm"]
    const sundayOptions = ["Early (8am)", "Regular (10:45am)"]
    const fellyOptions = ["Yes", "No, go back early"]
    const addressOptions = ["Hill (De Neve Turn Around)", "North of Wilshire", "South of Wilshire"];

    const [role, setRole] = useState("");
    const [friday, setFriday] = useState("");
    const [sunday, setSunday] = useState("");
    const [felly, setFelly] = useState("");
    const [address, setAddress] = useState("");
    const [isNewcomer, setisNewcomer] = useState(false);


    return (

        <View style={styles.container}>
            <ScrollView 
                horizontal={false}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
            <View style={styles.question}>
                <Text style={styles.title}>Rides Signup</Text>
                <Text style={styles.text}>Welcome to Citizens LA! So excited that you are going to be worshipping with us this week. If you need a ride, please sign up!
                </Text>
                <Text style={styles.text}>Every Sunday we gather from all walks of life and all parts of the city. Every week we share the story of Jesus. This includes worshiping God through song, hearing Scripture preached, and responding in prayer, communion, and closing songs. After service, we will eat lunch together as a college ministry, usually at restaurants nearby. Hope to see you this week!
                </Text>
                <Text style={styles.text}>At the end of every week, on Friday nights, we meet together as a community to share our walk in life. We will be creating smaller community groups (CG&apos;s) to facilitate an environment that empowers and equips a collegiate community specifically to follow the example of Jesus in all that we do. Throughout the year, the mission is to become more intimate with Christ -- whether through praise, Q&A sessions/seminars, or times of prayer and discussion. Also be on the lookout for the occasional fellowship in place of the weekly community groups! 
                </Text>
                <Text style={styles.text}>
                    Deadline for Friday rides is Thursday at 10PM and deadline for Sunday rides is Friday at 10PM. Please make sure to sign up on time!! 
                </Text>
            </View>

            <View style={styles.question}>
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
            </View>

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

            <Text style={styles.subtitle}>Where are you located?</Text>
                  {addressOptions.map((a) => (
                    <View key={a} style={styles.radioRow}>
                      <Pressable
                        style={[
                          styles.radioButtonOuter,
                          address === a && styles.radioButtonOuterSelected,
                        ]}
                        onPress={() => setAddress(a)}
                      >
                        {address === a && <View style={styles.radioButtonInner} />}
                      </Pressable>
                      <Text style={styles.radioText}>{a}</Text>
                    </View>
                  ))}

            <Text style={styles.subtitle}>Please check this box if you are a newcomer!</Text>
            <View style={styles.section}>
                <Checkbox style={styles.checkbox} value={isNewcomer} onValueChange={setisNewcomer} />
                <Text style={styles.paragraph}>I am a newcomer!</Text>
            </View>

            <Text style={styles.subtitle}>Rides are a privilege and gift, not a right that everyone is entitled to. Rides coords, drivers, and the church all come together to try our best to accommodate transportation. Each individual's action matters. </Text>
            <Text style={styles.subtitle}>By signing up, you are committing to receiving a ride for Friday and/or Sunday. If you are unable to uphold this commitment, you must email citizenslacollege@gmail.com at least 24 hours in advance. Failure to do so will first result in a warning strike; repeated failure will lead to suspension from receiving rides from the church for the remainder of the semester/quarter. </Text>
            <View style={styles.section}>
                <Checkbox style={styles.checkbox} value={isNewcomer} onValueChange={setisNewcomer} />
                <Text style={styles.paragraph}>I understand if I give less than 24 hrs for a cancellation, I will be given a warning strike (or suspension, if I already have a strike)</Text>
            </View>

            <Text style={styles.subtitle}>Any questions, comments, or concerns?</Text>
            <TextInput placeholder="Input here" style={styles.input} />

            <Pressable style={styles.button} onPress={() => console.log("Submit")}>
                <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
            </ScrollView>
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
      question: {
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
        width: "100%",
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
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
    },
    text: {
        fontSize: 14,
        marginBottom: 10,
        color: "#555",
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
      }
});

export default RidesSignUp;