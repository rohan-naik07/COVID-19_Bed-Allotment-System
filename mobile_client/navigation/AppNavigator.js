import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator,DrawerNavigatorItems} from 'react-navigation-drawer';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import { useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import StartScreen from '../screens/StartScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import UserProfileScreen from '../screens/UserProfileScreen'
import * as authActions from '../redux/actions/auth';

const defaultNavStyles = {
    headerStyle : {
        backgroundColor : Colors.blue
    },
    headerTintColor : Colors.accent
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
        Home: HomeScreen,
        Profile : UserProfileScreen
    },{
        navigationOptions: {
          drawerIcon: drawerConfig => (
            <Ionicons
              name= 'md-list'
              size={23}
              color={drawerConfig.tintColor}
            />
          )
        },
        defaultNavigationOptions :defaultNavStyles
      } 
)

const DrawerNavigator = createDrawerNavigator({
  Main : HomeNavigator
},{
  contentOptions:{
      activeTintColor : Colors.accent
  },
  contentComponent : (props)=>{
    const dispatch = useDispatch();
    return(
      <View style={{
        flex : 1,
        paddingTop : 20
      }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerNavigatorItems {...props}/>
          <Button
            title="Logout"
            color={Colors.blue}
            onPress={() => {
              dispatch(authActions.logoutUser());
              
            }}/>
        </SafeAreaView>
      </View>
    )
  }
})

const MainNavigator = createSwitchNavigator({
  Start : StartScreen,
  Auth: AuthNavigator,
  Home: DrawerNavigator
});

export default createAppContainer(MainNavigator);