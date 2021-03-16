import React, { Fragment } from 'react';
import SeriesDetailsScreen from '../screens/SeriesDetails';
import LinksScreen from '../screens/LinksScreen';
import LoginScreen from '../screens/Login';
import BlogScreen from '../screens/BlogScreen';
import { otherStyles } from '../styles';
import GallerysScreen from '../screens/Gallery';


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
            <Stack.Screen
                name="Gallery" component={GallerysScreen}
                options={{
                    title:"Képek", headerShown: false, 
                    mode: 'modal',
                    cardStyle: { opacity: 0 },
                    transparentCard: true,
                }}
            />
            <Stack.Screen name="Details" component={SeriesDetailsScreen} options={{ title:"Sorozat", headerShown: false, }} />
            <Stack.Screen name="Blog" component={BlogScreen} options={{ title:"Blog" }} />
            <Stack.Screen name="Links" component={LinksScreen} options={{ title:"Linkek" }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title:"Bejelentkezés" }} />
        </Fragment>
    );
}