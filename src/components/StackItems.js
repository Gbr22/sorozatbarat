import React, { Fragment } from 'react';
import SeriesDetailsScreen from '../screens/SeriesDetails';
import LinksScreen from '../screens/LinksScreen';


export default function getStackItems(Stack){
    return (
        <Fragment>
            <Stack.Screen name="Details" component={SeriesDetailsScreen} options={{ title:"Sorozat" }} />
            <Stack.Screen name="Links" component={LinksScreen} options={{ title:"Linkek" }} />
        </Fragment>
    );
}