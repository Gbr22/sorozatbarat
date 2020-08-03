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

function TouchFeedback(props){
  var C = Platform.OS == 'android' ? TouchableNativeFeedback : TouchableOpacity;
  return (<C {...props} />);
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar = {props => <MyTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Other" component={OtherScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
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
        shadowOffset: { width: 0, height: 0 },
        shadowColor: '#000',
        shadowOpacity: 0.6,
        shadowRadius: 2,
        elevation: 10,
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
          "Other":"info"
        })[route.name];

        var color = isFocused ? '#FFA600' : '#4f4f4f';
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