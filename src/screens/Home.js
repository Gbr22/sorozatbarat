import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
      <View style={styles.container}>
        <Text>Test</Text>
        <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#0006" translucent = {true}/>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
