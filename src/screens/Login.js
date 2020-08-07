import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import styles, { otherStyles } from '../styles';
import CustomButton from '../components/CustomButton';
import { getUser, getMe, logout, login, fetchUserData } from '../logic/data';
import { TextInput } from 'react-native-gesture-handler';
import CustomTextInput from '../components/CustomTextInput';
import { GlobalContext } from '../GlobalState';


export default class LoginScreen extends React.Component {
  
    state={
        username:"",
        password:""
    }

  render(){
    let goHome = ()=>{
        this.props.navigation.navigate("Home", {});
    }

    var {itemStyle, cont} = localstyles;
    let onChangeText = (input,text)=>{
        this.setState({
            [input]:text
        })
    }
    return (
        <GlobalContext.Consumer>
          {({state, update}) => (
            <View
                style={[
                styles.screenCont,
                {
                    justifyContent:"center",
                    alignItems:"center",
                }
                ]}
            >
            <View
                style={{
                    justifyContent:"center",
                    alignItems:"center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        marginBottom: 15
                    }}
                >
                    <Text
                        style={[
                            localstyles.title,
                            {
                                color: "#1a1a1a"
                            }
                        ]}
                    >Sorozat</Text>
                    <Text
                        style={[
                            localstyles.title,
                            {
                                color: otherStyles.colors.theme,
                            }
                        ]}
                    >Barát</Text>
                </View>
                <View style={cont}>
                    <CustomTextInput placeholder="Felhasználónév" iconLeft="user-alt" autoCompleteType="username" style={[itemStyle]}
                        onChangeText={text => onChangeText("username",text)}
                    />
                </View>
                <View style={cont}>
                    <CustomTextInput placeholder="Jelszó" iconLeft="key" autoCompleteType="password" secureTextEntry={true} style={[itemStyle]} 
                        onChangeText={text => onChangeText("password",text)}
                    />
                </View>
                <View style={cont}>
                    <CustomButton title="Bejelentkezés" style={[itemStyle]}
                        onPress={()=>{
                            var {username, password} = this.state;
                            
                            
                            login(username,password).then(()=>{
                                fetchUserData(username).then(user=>{
                                    update({user});
                                    goHome();
                                })
                                
                                
                            }).catch(err=>{
                                alert(err.message);
                            })
    
                        }}
                    />
                </View>
            </View>
            </View>
        
          )}
        </GlobalContext.Consumer>
    )
  }
}

var localstyles = StyleSheet.create({
    cont:{
        flexDirection: "row",
        marginVertical: 5
    },
    title: {
        fontSize: 30,
        fontWeight: "bold"
    },
    itemStyle:{
        width: 250,
    }
});