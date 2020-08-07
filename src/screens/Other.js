import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import styles from '../styles';
import getStackItems from '../components/StackItems';
import { createStackNavigator } from '@react-navigation/stack';
import CustomButton from '../components/CustomButton';
import { getUser, getMe, logout } from '../logic/data';
import { GlobalContext } from '../GlobalState'

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
  state = {
    user:null,
    refreshing: true,
  };
  componentDidMount() {
    getMe().then(d=>{
      this.setState({
        user: d,
      })
    })
  }
  render(){
    /* const [state, dispatch] = useGlobalState(); */

    var user = this.state.user;
    var props = this.props;

    function afterLogout(){
      this.setState({
        user:null
      })
    }
    function getInner(){
      if (user == null){
        return (
          <View
            style={{
              justifyContent:"center",
              alignItems:"center"
            }}
          >
            <GlobalContext.Consumer>
              {({state, update}) => (
                <View>
                  <CustomButton 
                    title={state.num+""}
                    onPress={()=>{
                      update({
                        num: state.num+1
                      });
                    }}
                  />
                </View>
              )}
            </GlobalContext.Consumer>
            <Text style={styles.h1}>Nincs bejelentkezve</Text>
            <View
              style={{
                width: 120
              }}
            >
              
              <CustomButton title="Bejelentkezés"
                onPress={()=>{
                  props.navigation.navigate("Login", {});
                }}
              />
            </View>
          </View>
        )
      } else {
        return (
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
              <Image source={{uri:user.avatar}} 
                style={{
                  flex:1
                }}
              />
            </View>
            <Text style={styles.h1}>{user.username}</Text>
            <View
              style={{
                width: 120
              }}
            >
              <CustomButton title="Kijelentkezés"
                onPress={()=>{
                  logout().then(()=>{
                    afterLogout();
                  })
                }}
              />
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