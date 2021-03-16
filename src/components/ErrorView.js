import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles, { otherStyles } from '../styles';

export default function ErrorView(){
    return <View
        style={[
            styles.container,
            {
                justifyContent: "center",
                alignItems: "center"
            }
        ]}
    >
        <Text>Hiba</Text>
    </View>;
}