import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import styles from '../styles';
import TouchFeedback from './TouchFeedback';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

export default class CustomButton extends React.Component {
    render(){
        return (
            <TouchableNativeFeedback
                {...this.props}
                style={[
                    ...(this.props.style || []),
                    {
                        justifyContent:"center",
                        alignItems:"center",
                        backgroundColor:this.props.color || "#fff",
                        borderRadius: 8,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                    }
                ]}
                background={TouchableNativeFeedback.Ripple('rgba(191, 191, 191, 0.5)', false)}
            >
                <Text
                    style={{
                        justifyContent:"center",
                        alignItems:"center"
                    }}
                >{this.props.title}</Text>
            </TouchableNativeFeedback>
        )
    }
  }