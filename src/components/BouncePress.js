import React from "react";
import { TouchableHighlight, Text, Alert, StyleSheet } from "react-native";
import { TouchableWithoutFeedback, TouchableOpacity } from "react-native-gesture-handler";
import * as Animatable from 'react-native-animatable';

export default class TouchableButton extends React.Component {
    constructor(props) {
        super(props);
        this.children = props.children;
        
    }
    viewRef;
    
    render() {
        var s = {
            flex: 1,
            transform: [{
                scale:1,
            }]
        }
        
        var transition = (v)=>{
            this.viewRef.transitionTo({ scale: v });
        }
        
        return (
            
                <TouchableWithoutFeedback
                    onPress={this.props.onPress}
                    style={{
                        flex:1,
                    }}
                    onPressOut={() => {
                        transition(1);
                    }}
                    onPressIn={() => {
                        transition(0.95);
                    }}
                >
                    <Animatable.View
                        style={s}
                        transition="scale"
                        easing="ease"
                        ref={e=>this.viewRef=e}
                    >
                        {this.children}
                    </Animatable.View>
                    
                </TouchableWithoutFeedback>    
            
        );
        
    }
}

const styles = StyleSheet.create({
    
});