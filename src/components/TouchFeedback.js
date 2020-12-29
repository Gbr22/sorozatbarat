import { TouchableOpacity,TouchableNativeFeedback, Platform } from 'react-native';
import React from 'react';
import Ripple from 'react-native-material-ripple';

/* export default function TouchFeedback(props){
    return <Ripple {...props} />
} */
export default function TouchFeedback(props){
    var C = Platform.OS == 'android' ? TouchableNativeFeedback : TouchableOpacity;
    return (<C {...props} style={props.style} background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.2)", false)} />);
}