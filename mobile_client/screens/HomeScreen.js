import React, { useEffect,useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import {HeaderButtons,Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';


const HomeScreen = props =>{
  const dispatch = useDispatch();
  const token = useSelector(state =>state.auth.token);

  const drawerHandler = useCallback(()=>{
    props.navigation.toggleDrawer();
},[]) 
const profileHandler = useCallback(()=>{
  props.navigation.navigate('Profile');
},[]) 

useEffect(()=>{
  props.navigation.setParams({
      drawerHandler : drawerHandler
  })
  props.navigation.setParams({
    profileHandler : profileHandler
  })
},[drawerHandler,profileHandler])

useEffect(()=>{
  if(!token)
    props.navigation.navigate('Auth')
},[token])


 return (
    <View style={styles.screen}>
        <Text>Welcome</Text>
    </View>
    )   
}

HomeScreen.navigationOptions = navData=>{
  const drawerHandler = navData.navigation.getParam('drawerHandler');
  const profileHandler = navData.navigation.getParam('profileHandler');
  return {
      headerLeft : ()=> <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item title='Menu' 
          iconName='ios-menu'
          onPress={drawerHandler}/>
          </HeaderButtons>,
       headerRight : ()=> <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item title='Profile' 
          iconName='ios-contact'
          onPress={drawerHandler}/>
          </HeaderButtons>
  };
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

export default HomeScreen;