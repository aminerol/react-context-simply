# React Context Simply
A small package that will helps you manage your app state using react context api and hooks


# Installation

```
npm install react-context-simply --save
```

# Minimal Example

#### Before start please note : 

 1. state is an immutable object, can not be changed directly only by dispatching action

`constanst.js`
```
// file holds all our constants will be used in dispatching actions also in reducer
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

```

`actions.js`
```
import { INCREMENT, DECREMENT } from "./constants";
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

```

`reducers.js`
```
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
```
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
```
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

    ```
    import React, { Component } from 'react';
    import { CountStateContext } from './store';

    class Counter extends Component {
        static contextType = CountStateContext;  
        render() {
            const [state, actions] = this.context;
        }
    }

    ```

