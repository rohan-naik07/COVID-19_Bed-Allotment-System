import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import Colors from '../constants/Colors';
import StartScreen from '../screens/StartScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';

const defaultNavStyles = {
    headerStyle : {
        backgroundColor : 'white'
    },
    headerTintColor : Colors.primary
  }


const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },{
    defaultNavigationOptions : defaultNavStyles
  } 
)

const HomeNavigator = createStackNavigator(
    {
        Home: HomeScreen
      },{
        defaultNavigationOptions :defaultNavStyles
      } 
)


const MainNavigator = createSwitchNavigator({
  Start : StartScreen,
  Auth: AuthNavigator,
  Home: HomeNavigator
});

export default createAppContainer(MainNavigator);