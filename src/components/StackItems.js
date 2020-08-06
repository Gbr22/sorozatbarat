import React, { Fragment } from 'react';
import SeriesDetailsScreen from '../screens/SeriesDetails';


export default function getStackItems(Stack){
    return (
        <Fragment>
            <Stack.Screen name="Details" component={SeriesDetailsScreen} options={{ title:"Sorozat" }} />
        </Fragment>
    );
}