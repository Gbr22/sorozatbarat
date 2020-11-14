import React from 'react';
import { getMe, fetchMe } from './logic/data';

export const initialGlobalState = {
    user:null,
    loggedIn:null
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
        console.log("user",user);
        if (user){
            UpdateGlobalState({user, loggedIn:true});
        }
    }).catch(err=>{
        console.log("user err",err);
        UpdateGlobalState({loggedIn:false});
    })
}

export const GlobalContext = React.createContext({state:initialGlobalState, update:()=>{}});