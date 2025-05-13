import { View, Text, StyleSheet, Pressable} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const RidesHome = () => {
    const navigation = useNavigation();
    const handleSignUp = () => {
        navigation.navigate("Rides SignUp");
    }
    const handleAllRides = () => {
        navigation.navigate("Ride Details");
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rides Home</Text>
            <Text style={styles.text}>Welcome to Citizens LA! So excited that you are going to be worshipping with us this week. If you need a ride, please sign up!
            </Text>
            <Text style={styles.text}>Every Sunday we gather from all walks of life and all parts of the city. Every week we share the story of Jesus. This includes worshiping God through song, hearing Scripture preached, and responding in prayer, communion, and closing songs. After service, we will eat lunch together as a college ministry, usually at restaurants nearby. Hope to see you this week!
            </Text>
            <Text style={styles.text}>At the end of every week, on Friday nights, we meet together as a community to share our walk in life. We will be creating smaller community groups (CG&apos;s) to facilitate an environment that empowers and equips a collegiate community specifically to follow the example of Jesus in all that we do. Throughout the year, the mission is to become more intimate with Christ -- whether through praise, Q&A sessions/seminars, or times of prayer and discussion. Also be on the lookout for the occasional fellowship in place of the weekly community groups! 
            </Text>
            <Text style={styles.text}>
                Deadline for Friday rides is Thursday at 10PM and deadline for Sunday rides is Friday at 10PM. Please make sure to sign up on time!! 
            </Text>
            <Pressable
                style={{
                    backgroundColor: "#007BFF",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 20,
                }}
                onPress={handleSignUp}
            >
                <Text style={{ color: "#fff", fontSize: 16 }}>Sign Up for a Ride</Text>
            </Pressable>
            <Pressable
                style={{
                    backgroundColor: "#007BFF",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 20,
                }}
                onPress={handleAllRides}  
                >
                <Text style={{ color: "#fff", fontSize: 16 }}>View All Rides</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'top',
        padding: 20,
    }, 
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        marginBottom: 10,
        color: "#555",
    }
});

export default RidesHome;