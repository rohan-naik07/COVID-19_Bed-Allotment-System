import React from 'react';
import {combineReducers,createStore,applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import AuthReducer from './redux/reducers/auth';
import UserDataReducer from './redux/reducers/user'
import AppNavigator from './navigation/AppNavigator' // do not use curly brackets if single module is exported 
import ReduxThunk from 'redux-thunk';

const rootReducer = combineReducers({
  auth : AuthReducer,
  user : UserDataReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk)
);

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  );
}

