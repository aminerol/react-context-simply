declare module 'react-context-simply' {

    import {
        FunctionComponent,
        Context,
        Dispatch
    } from 'react';


    export interface IActions
    {
        [action: string] : Function;
    } 
    export interface IAction {
        type: string;
        payload?: any;
    }
    export type StateMiddleware = <T>(stateContext: ContextState<T>) => ContextState<T> | void
    export interface IMiddleware {
        action: string;
        middleware: StateMiddleware;
    }
    export type ContextState<T> = [T, Dispatch<IAction>];
    export type Reducer<T> = (state: T, action: IAction) => T;
    export interface IStateContext<T> {
        useStateValue(): ContextState<T>;
        StateProvider: FunctionComponent;
        StateContext: Context<ContextState<T>>;
    }
    
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
    export default function createStateContext(initialState: T, reducer: Reducer<T>, actions: IActions, middleware?: IMiddleware | IMiddleware[]): IStateContext<T>
}