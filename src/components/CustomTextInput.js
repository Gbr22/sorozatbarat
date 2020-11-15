import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TextInput } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import styles, {otherStyles} from '../styles';

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
                        borderColor: otherStyles.colors.divider,
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
                            marginRight: 10,
                            color: otherStyles.theme.color,
                        }}
                    /> : null }
                <TextInput

                    {...this.props}
                    placeholderTextColor={styles.textSmall.color}
                    style={{
                        padding:0,
                        color: styles.text.color,
                    }}
                >

                </TextInput>
            </View>
        )
    }
}