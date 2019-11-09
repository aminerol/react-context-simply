import React, { createContext, useContext, useReducer, useCallback } from 'react';

const augmentDispatch = (state, dispatch) => (input) => typeof input === 'function' ? input(state, dispatch) : dispatch(input);
export default function createStateContext(initialState, reducer, actions, middleware) {
    const middlewares = Array.isArray(middleware) ? middleware : (middleware && [middleware])
    const StateContext = createContext([initialState, () => null]);
    const StateProvider = ({children}) => {
        const chain = []
        const [state, dispatch] = middlewares ? middlewares.reduce(([st, agg], mw) => { 
          const newDis = action => {
            const types = Array.isArray(mw.action) ? mw.action : [mw.action]
            if(types.includes(action.type) || types.includes('*')){
              let [_, next] = mw.middleware([state, agg])
              return next(action)
            }else{
              return agg(action)
            }
          }
          chain.push(newDis)
          return [st, newDis]
        }, useReducer(reducer, initialState)) : useReducer(reducer, initialState)
        const composedDispatch = chain.length > 0 ? chain.reduce((result, next) => async (action) => action && await result(await next(action)), dispatch) : dispatch
        const enhancedDispatch = augmentDispatch(state, composedDispatch)
        const newActions = Object.keys(actions).reduce((result, action) => {
          result[action] = useCallback((payload) =>  enhancedDispatch(actions[action](payload)), [])
          return result;
        }, {});
        return <StateContext.Provider value={[state, newActions]}>{children}</StateContext.Provider>
    };
    const useStateValue = () => useContext(StateContext);
    return {useStateValue, StateProvider, StateContext}
}