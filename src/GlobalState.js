import React from 'react';
import { getMe, fetchMe } from './logic/data';

export const initialGlobalState = {
    user:null
};

var _update;
export function setUpdate(func){
    _update = func;
}
export function UpdateGlobalState(){
    _update(...arguments);
}
export function AppMouted(){
    fetchMe().then(user=>{
        UpdateGlobalState({user});
    })
}

export const GlobalContext = React.createContext({state:initialGlobalState, update:()=>{}});