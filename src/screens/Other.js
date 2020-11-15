import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import styles from '../styles';
import getStackItems from '../components/StackItems';
import { createStackNavigator } from '@react-navigation/stack';
import CustomButton from '../components/CustomButton';
import { getUser, getMe, logout } from '../logic/data';
import { GlobalContext } from '../GlobalState'
import { getNavigator } from '../components/StackItems';

const Stack = createStackNavigator();

export default function OtherScreen() {
  return getNavigator(Stack,Other,"Fiók");
}


class Other extends React.Component {
  state = {
    refreshing: true,
  };
  componentDidMount() {
    /* getMe().then(d=>{
      this.setState({
        user: d,
      })
    }) */
  }
  render(){
    /* const [state, dispatch] = useGlobalState(); */

    var user = this.state.user;
    var props = this.props;

    

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
        <GlobalContext.Consumer>
          {({state, update}) => (
           
              <Fragment>
                <View
                  style={{
                    justifyContent:"center",
                    alignItems:"center",
                  }}
                >
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 30,
                      overflow: "hidden"
                    }}
                  >
                    <Image source={{uri:state.user.avatar}} 
                      style={{
                        flex:1
                      }}
                    />
                  </View>
                  <Text style={styles.h1}>{state.user.username}</Text>
                  <View
                    style={{
                      width: 120
                    }}
                  >
                    <CustomButton title="Kijelentkezés"
                      onPress={()=>{
                        logout().then(()=>{
                          update({user:null,loggedIn:false})
                        })
                      }}
                    />
                  </View>
                </View>
              </Fragment>
              
          )}
        </GlobalContext.Consumer>
      </View>
    )
  }
}