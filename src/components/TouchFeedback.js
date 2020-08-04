import { TouchableOpacity,TouchableNativeFeedback, Platform } from 'react-native';
import React from 'react';

export default function TouchFeedback(props){
    var C = Platform.OS == 'android' ? TouchableNativeFeedback : TouchableOpacity;
    return (<C {...props} />);
}