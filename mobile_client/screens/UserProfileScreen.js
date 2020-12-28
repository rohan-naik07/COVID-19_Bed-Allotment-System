import React, { useState, useEffect, useReducer, useCallback  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import {HeaderButtons,Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import Input from '../components/Input';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import * as authActions from '../redux/actions/auth';
import DatePicker from 'react-native-datepicker'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const HomeScreen = props =>{
  const dispatch = useDispatch();
  const token = useSelector(state =>state.auth.token);
  const [editable,setEditable] = useState(false);
  const setProfileEdit = ()=> setEditable(editable=>!editable);
  const drawerHandler = useCallback(()=>{
    props.navigation.toggleDrawer();
   },[]) 

   const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      firstName : '',
      lastName : '',
      weight : 0,  // initialized input state values
      contact : 0,
      birthDate : "2016-05-15"
    },
    inputValidities: {
      email: false,
      firstName : false,
      lastName : false,// initialized input state validities
      weight : false,
      number : false,
      birthDate : false
    },
    formIsValid: false
  });

   const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

    useEffect(()=>{
    props.navigation.setParams({
        drawerHandler : drawerHandler
    })
    props.navigation.setParams({
        editHandler : setProfileEdit
    })
    },[drawerHandler])


    return (
        <View style={styles.screen}>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/profile.png')} style = {styles.image} resizeMode='cover'/>
            </View>
            <Card style={styles.card}>
            <ScrollView style={{flex : 1,width : '100%'}}>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              editable={!editable}
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue={formState.inputValues.email}
            />
            <Input
              id="firstName"
              label="First Name"
              required
              autoCapitalize="none"
              errorText="Please enter a valid name"
              editable={!editable}
              onInputChange={inputChangeHandler}
              initialValue={formState.inputValues.firstName}
            /> 
            <Input
              id="lastName"
              label="Last Name"
              required
              editable={!editable}
              autoCapitalize="none"
              errorText="Please enter a valid name"
              onInputChange={inputChangeHandler}
              initialValue={formState.inputValues.lastName}
            /> 
            <Input
              id="contact"
              label="Contact Number"
              keyboardType="number-pad"
              textContentType = 'telephoneNumber'
              required
              minLength={10}
              autoCapitalize="none"
              editable={!editable}
              errorText="Please enter a valid contact Number"
              onInputChange={inputChangeHandler}
              initialValue={formState.inputValues.contact}
            /> 
            
              <Input
              id="weight"
              label="Weight"
              keyboardType="number-pad"
              editable={!editable}
              required
              autoCapitalize="none"
              errorText="Please enter a valid weight"
              onInputChange={inputChangeHandler}
              initialValue={formState.inputValues.weight}
            /> 
            <DatePicker
              style={{width: '100%',marginTop:10}}
              mode="date"
              placeholder="Select your Birth Date"
              editable={!editable}
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                }
              }}
              onDateChange={(date)=>{
                dispatchFormState({
                  type: FORM_INPUT_UPDATE,
                  value: date,
                  isValid: true,
                  input: "birthDate"
                });
              }}
            />
            </ScrollView>
            </Card>
        </View>
    )   
}

HomeScreen.navigationOptions = navData=>{
  const drawerHandler = navData.navigation.getParam('drawerHandler');
  const editHandler = navData.navigation.getParam('editHandler');
  return {
      headerTitle : 'Profile',
      headerLeft : ()=> <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item title='Menu' 
          iconName='ios-menu'
          onPress={drawerHandler}/>
          </HeaderButtons>,
      headerRight : ()=> <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Edit' 
            iconName='ios-create'
            onPress={editHandler}/>
            </HeaderButtons>
  };
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    card : {
        flex: 1,
        width : '90%',
        padding : 5,
        marginBottom : 10,
        alignItems : 'center'
    },
    imageContainer : {
        width : Dimensions.get('window').width * 0.5,
        height : Dimensions.get('window').width * 0.5,
        borderRadius : (Dimensions.get('window').width * 0.6) / 2,
        borderWidth : 1,
        borderColor : 'black',
        overflow : "hidden",
        marginVertical : Dimensions.get('window').height / 40
    },
    image : {
        width : '100%',
        height : '100%'
    }
  });

export default HomeScreen;