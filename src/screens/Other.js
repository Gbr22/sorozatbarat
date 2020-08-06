import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import styles from '../styles';
import getStackItems from '../components/StackItems';
import { createStackNavigator } from '@react-navigation/stack';
import CustomButton from '../components/CustomButton';

const Stack = createStackNavigator();

export default function OtherScreen() {
    return (
      <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Other} options={{ title:"Fiók" }}/>
          { getStackItems(Stack) }
      </Stack.Navigator>
      
    );
}
class Other extends React.Component {
  render(){
    var loggedIn = false;
    function getInner(){
      if (loggedIn == false){
        return (
          <View
            style={{
              justifyContent:"center",
              alignItems:"center"
            }}
          >
            <Text style={styles.h1}>Nincs bejelentkezve</Text>
            <View
              style={{
                width: 120
              }}
            >
              <CustomButton title="Bejelentkezés" color="#ffd280" />
            </View>
          </View>
        )
      }
    }

    return (
      <View
        style={[
          styles.screenCont,
          {
            justifyContent:"center",
            alignItems:"center",
          }
        ]}
      >
        {
          getInner()
        }
      </View>
    )
  }
}