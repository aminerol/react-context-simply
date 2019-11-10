# React Context Simply
A small package that will helps you manage your app state using react context api using hooks


# Installation

```
npm install react-context-simply --save
```

# Minimal Example

#### Before start please note : 

 1. state is an immutable object, can not be changed directly only by dispatching action

`constanst.js`
```js
// file holds all our constants will be used in dispatching actions also in reducer
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

```

`actions.js`
```js
import { INCREMENT, DECREMENT } from "./constants";
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

```

`reducers.js`
```js
import { INCREMENT, DECREMENT } from "./constants";
export default function countReducer(state, action) {
    switch (action.type){
      case INCREMENT:
        return state + 1;
      case DECREMENT:
        return state - 1;
      default:
        return state;
    }
}

```

`store.js`
```js
import createStateContext from 'react-context-simply';
import countReducer from './reducers';
import * as actions from './actions'

const {
    useStateValue,
    StateProvider,
    StateContext
} = createStateContext({}, countReducer, actions);

const useCountState = useStateValue;
const CountState = StateProvider;
const CountStateContext = StateContext

export {
    useCountState,
    CountState,
    CountStateContext
};

```

`app.js`
```js
import React from 'react';
import { CountState, useCountState } from './store.js';

function Counter() {
    const [state, actions] = useCountState()
    const {increment, decrement} = actions
    return (
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={()=>{
            increment()
          }}>
            <Text>Increment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            decrement()
          }}>
            <Text>Decrement</Text>
          </TouchableOpacity>
          <Text>{state}</Text>
      </View>
    );
}

export default class App extends React.Component {
  render() {
    return (
        <CountState>
          <Counter />
        </CountState>
    );
  }
}

```

for me i prefer to seperate the code into files but you can do it in one file, its all up to you

#### Limitation : 

 the consumer component it should be a functional component but its possible to acces state in class based component like this:

```js
    import React, { Component } from 'react';
    import { CountStateContext } from './store';

    class Counter extends Component {
        static contextType = CountStateContext;  
        render() {
            const [state, actions] = this.context;
        }
    }
```

# Dispatching Async Action

Of course in real world app you will need to make async calls wether requesting an api or writing to storage whatever the reason why it will be one for sure, With React Context Simply it has a redux-thunk like already built-in

`actions.js`
```js
export const callApi = () => (state, dispatch) => {
    dispatch({ type: CALL_API })
    try {
        // dispatching a loading action
        dispatch(loading())
        const res = await fetch('http://jsonplaceholder.typicode.com/todos')
        const todos = await res.json()
        
        // dispatching a sucess action
        dispatch(succes(todos))
      } catch (error) {
        // dispatching an error action
        dispatch(fail(error))
      }
    
}

```

# Middlewares

middlwares are known for extending with custom functionalities, basically its a function thats got passed a state and dispatch in arguments, in react context simply instead you return the next function will be called, it return the state along with the new dispatched action, also in sometime you want that middleware to be hooked only with one action or multiple actions or all actions, next section we will cover how you can do that by passing array of middlwares each contain the action will be associated with

```js
export const logger = ([state, dispatch]) => {
  const newDis = action => {
    console.log('Dispatching Action => ', action)
    return dispatch(action)
  }
  return [state, newDis]
}

````

# API Reference

## createStateContext

```js
createStateContext(initialState, reducer, actions, [middlewares])
```
`createStateContext` returns the provider as well as the hook that will be called inside the consumer to get the state and actions
* The `initialState` The initial State to begin withone.
* The `reducer` A pure function that takes the previous state and an action, and returns the next state. based on the action passed to it
* The `actions` sets of actions that holds information that send data to your store
* The `middlewares` are optioanl argument, is an array that hold objects, each contain the middlware and the action associated with it, for the action you can either pass the action constant or an array of actions, or an `*` which mean the middleware will be for all the actions

### Example

```js

const {
    useStateValue,
    StateProvider,
    StateContext
} = createStateContext([], todoReducer, actions, [
    
    {action: '*', middleware: logger},
    {action: [ADD_TODO], middleware: addTodo},
    {action: GET_TODOS, middleware: getTodos},
    
]);
```
# Example

A repo showing the usage of the package doing a Todo example and timer example

[React Context Simply Starter](https://github.com/aminerol/React-Native-Context-Api-Starter)

# Articles

[Rolling Your Own Redux with react hooks and context](https://medium.com/yld-blog/rolling-your-own-redux-with-react-hooks-and-context-bbeea18b1253)

[Writing Redux-like simple middleware for React Hooks](https://medium.com/front-end-weekly/writing-redux-like-simple-middleware-for-react-hooks-b163724a7058)

[State Management with React Hooks and Context API in 10 lines of code!](https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c)
