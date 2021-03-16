
import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity,TouchableNativeFeedback, SafeAreaView, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import HomeScreen from './src/screens/Home';
import OtherScreen from './src/screens/Other';


import { Feather } from '@expo/vector-icons';
import { TouchableWithoutFeedback, TouchableHighlight } from 'react-native-gesture-handler';

import TouchFeedback from './src/components/TouchFeedback';
import styles, { otherStyles } from './src/styles';
import SearchScreen from './src/screens/Search';
import { GlobalContext, initialGlobalState, setUpdate, AppMouted } from './src/GlobalState';
import LoginScreen from './src/screens/Login';
import Blog from './src/screens/Blogs';
import { getUA } from './src/logic/data';
import { playVideo } from './src/logic/util';
import Ripple from 'react-native-material-ripple';
import { processScreenOptions } from './src/components/StackItems';

export default class App extends React.Component {
  state=Object.assign({},initialGlobalState);
  componentDidMount(){
    
    setUpdate((o)=>{
      this.update(o);
    });
    
    getUA().then(()=>{
      AppMouted();
    })
    console.log("App mounted");
  }
  update(o){
    this.setState(o);
  }
  render(){

    return (
      <View
        style={{
          backgroundColor: styles.container.backgroundColor,
          flex:1
        }}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaProvider
          style={{
            flex:1
          }}
        >
        <GlobalContext.Provider value={{state:this.state, update:(o)=>{this.update(o)}}}>
        
          <GlobalContext.Consumer>
              {({state, update}) => {
                if (state.loggedIn === true){
                  return (
                  
                      <NavigationContainer>
                        
                        <Tab.Navigator
                          initialRouteName="Home"
                          tabBar = {props => <MyTabBar {...props} />}
                          forceInset={{top:'always'}}
                          screenOptions={{
                            
                          }}
                          tabBarOptions={{
                            keyboardHidesTabBar: true,
                          }}
                        >
                          <Tab.Screen options={{ title:"Kezdőlap" }} name="Home" component={HomeScreen} />
                          <Tab.Screen options={{ title:"Keresés" }} name="Search" component={SearchScreen} />
                          <Tab.Screen options={{ title:"Blog" }} name="Blog" component={Blog} />
                          <Tab.Screen options={{ title:"Fiók" }} name="Other" component={OtherScreen} />
                        </Tab.Navigator>
                      
                        
                      </NavigationContainer>
                    
                  );
                } else if (state.loggedIn === false){
                  return <LoginScreen></LoginScreen>
                } else {
                  return (<View></View>);
                }
              }}
          </GlobalContext.Consumer>
        

        </GlobalContext.Provider>
        </SafeAreaProvider>
      </View>
    );
  }
}


function MyTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        shadowColor: "#000",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
        // background color must be set
        backgroundColor: otherStyles.theme.backgroundColor
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        var iconName = ({
          "Home":"home",
          "Other":"user",
          "Search":"search",
          "Blog":"layout",
        })[route.name];

        var color = isFocused ? otherStyles.colors.theme : otherStyles.theme.text.nav;
        var iconSize = 22;

        return (
          <TouchFeedback
            rippleColor="rgba(255,255,255,0.5)"
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              height: 55,
            }}
            key={route.key}
          >
            <View
              style={{
                flex:1,
                justifyContent: "center",
                alignItems:"center",
                paddingVertical: 8
              }}
            >
              <Feather name={iconName} size={iconSize} color={color} />

              <Text style={{
                color: color,
                fontSize: 12
              }}>
                {label}
              </Text>
            </View>
          </TouchFeedback>
        );
      })}
    </View>
  );
}