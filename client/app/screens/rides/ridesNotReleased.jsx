import { View, Text, StyleSheet, Pressable} from "react-native";
import React, {useState, useEffect} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";


const RidesNotReleased = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { role} = route.params || {};

    const handleGoBack = () => {
      if (role === "Driver") {
        navigation.navigate("Driver Home", { role });
      } else {
        navigation.navigate("Passenger Home", { role });
      }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hang Tight!</Text>
            <Text style={styles.subtitle}>
                We&apos;re still working on finalizing the rides. Please check back a little later.
            </Text>
            <Text style={styles.text}>Rides are tentatively updated weekly at 8:00am Friday morning and 6:00pm Saturday night.</Text>
            <Pressable style={styles.button} onPress={handleGoBack}>
            <Text style={styles.buttonText}>← Back To Home</Text>
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

    textBox: {
        backgroundColor: '#e4f1ee',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#999",
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        alignSelf: 'stretch'
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

export default RidesNotReleased;