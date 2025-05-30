import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from './src/util/AuthContext';
import HamburgerMenu from './src/components/hamburgermenu';

export default function Layout() {
  return (
    <AuthProvider>
      <AppEntryPoint />
    </AuthProvider>
  );
}

const AppEntryPoint = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <HamburgerMenu />
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
