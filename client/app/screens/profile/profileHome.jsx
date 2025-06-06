import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "../../src/util/AuthContext";
import { useNavigation } from "@react-navigation/native";
import db from "../../src/firebase-config";
import { doc, onSnapshot } from "firebase/firestore";

const ProfileHome = () => {
  const navigation = useNavigation();
  const { phoneNumber, userData, setUserData, logout } = useAuth();

  useEffect(() => {
    if (!phoneNumber) return;
    const unsubscribe = onSnapshot(doc(db, "users", phoneNumber), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, [phoneNumber]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.name}>
          {userData?.fname} {userData?.lname}
        </Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Your Profile</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>
              {userData?.fname} {userData?.lname}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{phoneNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Grade:</Text>
            <Text style={styles.infoValue}>{userData?.grade || "Not set"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>
              {userData?.address || "Not set"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Pressable
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("Profile SignUp", {
              phoneNumber: phoneNumber,
              isEdit: true,
            })
          }
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={() => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  name: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
    flex: 1,
  },
  actionsSection: {
    gap: 16,
  },
  editButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#dc2626",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ProfileHome;
