import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TextInput } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

import { FontAwesome5 } from '@expo/vector-icons'; 

export default class CustomTextInput extends React.Component {
    render(){
        return (
            <View
                style={[
                    this.props.style,
                    {
                        borderRadius: 8,
                        paddingHorizontal: 15,
                        paddingVertical: 6,
                        borderColor: "#d9d9d9",
                        borderWidth: 1,
                        flexDirection: "row",
                        alignItems: "center"
                    }
                ]}
            >
                { this.props.iconLeft ? 
                    <FontAwesome5 name={this.props.iconLeft}
                        size={15}
                        style={{
                            marginRight: 10
                        }}
                    /> : null }
                <TextInput

                    {...this.props}
                    style={{
                        padding:0
                    }}
                >

                </TextInput>
            </View>
        )
    }
}