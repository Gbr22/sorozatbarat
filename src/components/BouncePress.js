import React from "react";
import { TouchableHighlight, Text, Alert, StyleSheet } from "react-native";
import { TouchableWithoutFeedback, TouchableOpacity } from "react-native-gesture-handler";


export default class TouchableButton extends React.Component {
    constructor(props) {
        super(props);
        this.children = props.children;
        this.state = {
            pressed: false,
        };
    }
    
    render() {
        var s = [styles.button];
        if (this.state.pressed){
            s.push(styles.buttonPressed);
        }
        return (
            <TouchableWithoutFeedback
                onPress={this.props.onPress}
                style={s}
                onPressOut={() => {
                    this.setState({ pressed: false });
                }}
                onPressIn={() => {
                    this.setState({ pressed: true });
                }}
            >
                {this.children}
            </TouchableWithoutFeedback>    
        );
        
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1
    },
    buttonPressed: {
        transform: [{
            scale: 0.97
        }],
    }
});