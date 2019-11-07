import React, { createContext, useContext, useReducer, useCallback } from 'react';

const augmentDispatch = (state, dispatch) => (input) => typeof input === 'function' ? input(state, dispatch) : dispatch(input);
export default function createStateContext(initialState, reducer, actions, middleware) {
    const middlewares = Array.isArray(middleware) ? middleware : [middleware]
    const StateContext = createContext([initialState, () => null]);
    const StateProvider = ({children}) => {
        const [state, dispatch] = middlewares.reduce((agg, mw) => mw ? mw(agg) : agg, useReducer(reducer, initialState));
        const enhancedDispatch = augmentDispatch(state, dispatch)
        const newActions = Object.keys(actions).reduce((result, action) => {
          result[action] = useCallback((payload) =>  enhancedDispatch(actions[action](payload)), [])
          return result;
        }, {});
        return <StateContext.Provider value={[state, newActions]}>{children}</StateContext.Provider>
    };
    const useStateValue = () => useContext(StateContext);
    return {useStateValue, StateProvider, StateContext}
}