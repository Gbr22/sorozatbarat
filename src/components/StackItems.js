import React, { Fragment } from 'react';
import SeriesDetailsScreen from '../screens/SeriesDetails';
import LinksScreen from '../screens/LinksScreen';
import LoginScreen from '../screens/Login';
import { otherStyles } from '../styles';


export function getNavigator(Stack, Comp, title){
    return (
        <Stack.Navigator initialRouteName={"Home"}
            screenOptions={{
                headerStyle: {
                    backgroundColor: otherStyles.theme.backgroundColor,
                },
                headerTintColor: otherStyles.theme.text.normal,
                headerTitleStyle: {
                    color: otherStyles.theme.text.h1,
                },
            }}
        >
            <Stack.Screen name={"Home"} component={Comp} options={{ title }}/>
            { getStackItems(Stack) }
        </Stack.Navigator>
    );
}
export default function getStackItems(Stack){
    return (
        <Fragment>
            <Stack.Screen name="Details" component={SeriesDetailsScreen} options={{ title:"Sorozat" }} />
            <Stack.Screen name="Links" component={LinksScreen} options={{ title:"Linkek" }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title:"Bejelentkezés" }} />
        </Fragment>
    );
}