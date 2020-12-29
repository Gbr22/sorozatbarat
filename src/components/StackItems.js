import React, { Fragment } from 'react';
import SeriesDetailsScreen from '../screens/SeriesDetails';
import LinksScreen from '../screens/LinksScreen';
import LoginScreen from '../screens/Login';
import { otherStyles } from '../styles';


export function getNavigator(Stack, Comp, title){
    return (
        <Stack.Navigator initialRouteName={"Home"}

            tabBarOptions={{
                keyboardHidesTabBar: true,
            }}
            screenOptions={{
                headerStyle: {
                    
                    backgroundColor: "hsl(0, 0%, 18%)",
                    shadowRadius: 0,
                    elevation: 0,
                },
                headerTintColor: otherStyles.theme.text.normal,
                headerTitleStyle: {
                    color: otherStyles.theme.text.h1,
                },
                cardStyle: { backgroundColor: 'transparent' },
                cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                        opacity: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    },
                    overlayStyle: {
                        opacity: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.5],
                            extrapolate: 'clamp',
                        }),
                    },
                }),
            }}
            mode="modal"
        >
            <Stack.Screen
                name={"Home"} component={Comp}
                options={{
                    title,
                    headerShown:true,
                    headerTitleStyle: { alignSelf: 'center' },
                    headerStyle: {
                        backgroundColor: otherStyles.theme.backgroundColor,
                        shadowRadius: 0,
                        elevation: 0,
                    }
                }}
            />
            { getStackItems(Stack) }
        </Stack.Navigator>
    );
}

export default function getStackItems(Stack){
    
    return (
        <Fragment>
            <Stack.Screen name="Details" component={SeriesDetailsScreen} options={{ title:"Sorozat", headerShown: false, }} />
            <Stack.Screen name="Links" component={LinksScreen} options={{ title:"Linkek" }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title:"Bejelentkezés" }} />
        </Fragment>
    );
}