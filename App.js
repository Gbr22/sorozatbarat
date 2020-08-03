import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import HomeScreen from './src/screens/Home';
import OtherScreen from './src/screens/Other';

import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';


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
        borderTopColor: "#d1d1d1",
        borderTopWidth: 1,
        paddingVertical: 5
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
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex:1,
                justifyContent: "center",
                alignItems:"center"
              }}
            >
              <Feather name={iconName} size={iconSize} color={color} />

              <Text style={{ color: color }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}