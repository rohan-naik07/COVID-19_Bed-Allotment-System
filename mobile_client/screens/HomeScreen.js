import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as productsActions from '../redux/actions/auth';

const HomeScreen = props =>{
  const dispatch = useDispatch();

 return (
    <View style={styles.screen}>
        <Text>Welcome</Text>
        <Button title="Logout" onPress={()=>{
          dispatch(productsActions.logoutUser());
          props.navigation.navigate('Auth')
        }}></Button>
    </View>
    )   
}


const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

export default HomeScreen;