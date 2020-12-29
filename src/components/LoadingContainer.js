import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles, { otherStyles } from '../styles';

export default function LoadingContainer(){
    return <View
        style={[
            styles.container,
            {
                justifyContent: "center",
                alignItems: "center"
            }
        ]}
    >
        <ActivityIndicator size="large" color={otherStyles.colors.theme} />
    </View>;
}