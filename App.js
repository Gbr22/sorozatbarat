import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity,TouchableNativeFeedback, SafeAreaView, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import HomeScreen from './src/screens/Home';
import OtherScreen from './src/screens/Other';

import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TouchableWithoutFeedback, TouchableHighlight } from 'react-native-gesture-handler';

import TouchFeedback from './src/components/TouchFeedback';
import { otherStyles } from './src/styles';
import SearchScreen from './src/screens/Search';
import { GlobalContext, initialGlobalState } from './src/GlobalState';


export default class App extends React.Component {
  state=Object.assign({},initialGlobalState);
  componentDidMount(){
    
  }
  update(o){
    this.setState(o);
  }
  render(){

    return (
      <GlobalContext.Provider value={{state:this.state, update:(o)=>{this.update(o)}}}>
      
      <NavigationContainer>
        
        <Tab.Navigator
          tabBar = {props => <MyTabBar {...props} />}
        >
          <Tab.Screen options={{ title:"Kezdőlap" }} name="Home" component={HomeScreen} />
          <Tab.Screen options={{ title:"Search" }} name="Search" component={SearchScreen} />
          <Tab.Screen options={{ title:"Fiók" }} name="Other" component={OtherScreen} />
        </Tab.Navigator>
        
      </NavigationContainer>

      </GlobalContext.Provider>
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
        backgroundColor : "#fff" // invisible color
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
          "Search":"search"
        })[route.name];

        var color = isFocused ? otherStyles.colors.theme : '#4f4f4f';
        var iconSize = 25;

        return (
          <TouchFeedback
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
            key={route.key}
          >
            <View
              style={{
                flex:1,
                justifyContent: "center",
                alignItems:"center",
                paddingVertical: 5
              }}
            >
              <Feather name={iconName} size={iconSize} color={color} />

              <Text style={{ color: color }}>
                {label}
              </Text>
            </View>
          </TouchFeedback>
        );
      })}
    </View>
  );
}