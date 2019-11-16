import React, { createContext, useContext, useReducer, useCallback } from 'react';

const augmentDispatch = (state, dispatch) => (input) => typeof input === 'function' ? input(state, dispatch) : dispatch(input);

/**
   * creates the provider as well as the hook that returns store and actions
   *
   * @param {T} initialState The initial State to begin with
   * @param {Reducer<T>} reducer it describes how an action transforms the state into the next state
   * @param {IActions} actions sets of actions that holds information that send data to your store
   * @param {IMiddleware | IMiddleware[]} middleware array of objects, each contain the middleware function and action that will be hooked to it
   * @returns {IStateContext<T>} it return basically our provider also a hook function that will return our store and actions
   * @public
   */
export default function createStateContext(initialState, reducer, actions, middleware) {
    const middlewares = Array.isArray(middleware) ? middleware : (middleware && [middleware])
    const StateContext = createContext([initialState, () => null]);
    const StateProvider = ({children}) => {
        const chain = []
        const [state, dispatch] = middlewares ? middlewares.reduce(([st, agg], mw) => { 
          const newDis = action => {
            if(action){
              const types = Array.isArray(mw.action) ? mw.action : [mw.action]
              if(types.includes(action.type) || types.includes('*')){
                let [_, next] = mw.middleware([state, agg])
                return next(action)
              }else{
                return agg(action)
              }
            }
          }
          chain.push(newDis)
          return [st, newDis]
        }, useReducer(reducer, initialState)) : useReducer(reducer, initialState)
        const composedDispatch = chain.length > 0 ? chain.reduce((result, next) => async (action) => action && await result(await next(action)), dispatch) : dispatch
        const enhancedDispatch = augmentDispatch(state, composedDispatch)
        const newActions = Object.keys(actions).reduce((result, action) => {
          result[action] = useCallback((...payload) =>  enhancedDispatch(actions[action](...payload)), [])
          return result;
        }, {});
        return <StateContext.Provider value={[state, newActions]}>{children}</StateContext.Provider>
    };
    const useStateValue = () => useContext(StateContext);
    return {useStateValue, StateProvider, StateContext}
}