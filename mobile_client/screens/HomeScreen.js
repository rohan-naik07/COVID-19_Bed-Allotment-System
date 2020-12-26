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

useEffect(()=>{
  props.navigation.setParams({
      drawerHandler : drawerHandler
  })
},[drawerHandler])

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
  return {
      headerLeft : ()=> <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item title='Menu' 
          iconName='ios-menu'
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