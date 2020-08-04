import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styles from '../styles';

export default function OtherScreen() {
    return (
      <View style={styles.screenCont}>
        <Text style={styles.h1}>Settings</Text>
      </View>
    );
}