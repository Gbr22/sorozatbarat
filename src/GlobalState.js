import React from 'react';

export const initialGlobalState = {
    num: 0,
    text: "foo",
    bool: false,
};

export const GlobalContext = React.createContext({state:initialGlobalState, update:()=>{}});