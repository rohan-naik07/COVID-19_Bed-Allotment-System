import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../constants/Colors';
import * as authActions from '../redux/actions/auth';

const StartScreen = props =>{
    const dispatch = useDispatch();

    useEffect(()=>{
        const tryLogin = async () => { 
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
              console.log('id absent')
                props.navigation.navigate('Auth');
                return;
              }

              const transformedData = JSON.parse(userData);
              const { token, userId, expiryDate } = transformedData;
              const expirationDate = new Date(expiryDate);
        
              if (expirationDate <= new Date() || !token || !userId) { // token expired or token/userid is null
                console.log('token expired')
                props.navigation.navigate('Auth');
                return;
              }
        
              const expirationTime = expirationDate.getTime() - new Date().getTime(); // update the expiraation date

              console.log('id present')
              props.navigation.navigate('Home');
              dispatch(authActions.authenticate(userId, token, expirationTime)); // store updated values to store
        }
        tryLogin();
    },[dispatch])

    return (
        <View style={styles.screen}>
        <ActivityIndicator size="large" color={Colors.primary} />
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

export default StartScreen;