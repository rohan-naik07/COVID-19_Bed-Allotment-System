import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {combineReducers,createStore,applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import AuthReducer from './redux/reducers/auth';
import NavigationContainer from './navigation/NavigationContainer' // do not use curly brackets if single module is exported 
import ReduxThunk from 'redux-thunk';

const rootReducer = combineReducers({
  auth : AuthReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk)
);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
