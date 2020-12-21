import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch,useSelector } from 'react-redux';
import OTPModal from '../components/OTPModal'
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

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const isVerified = useSelector(state=>state.auth.otpVerified);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      firstName : '',
      lastName : '',
      weight : 0,  // initialized input state values
      contact : 0,
      birthDate : "2016-05-15"
    },
    inputValidities: {
      email: false,
      password: false,
      firstName : false,
      lastName : false,// initialized input state validities
      weight : false,
      number : false,
      birthDate : false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  useEffect(()=>{
    if(isVerified){
      props.navigation.navigate('Home')
    }
  },[isVerified])

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password,
        formState.inputValues.contact,
        formState.inputValues.birthDate,
        formState.inputValues.weight
      );
    } else {
      action = authActions.loginUser(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      if(isSignup)
        setModalVisible(true);
      await dispatch(action);
    } catch (err) {
      setModalVisible(false)
      setError(err.message);
      setIsLoading(false);
    }
  };

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


  return (
    <View
      style={styles.screen}>
        <LinearGradient colors={['white', 'white']} style={styles.gradient}>
        <OTPModal 
      open={modalVisible}
      navigation = {props.navigation}
      isSignup = {isSignup} 
      toggleModal={()=>{
          setModalVisible(!modalVisible);   
      }}/>
        <Card style={styles.authContainer}>
          <ScrollView >
          <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              password
              required
              minLength={5}
              autoCapitalize="none"
              autoCompleteType = 'password'
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />

          {isSignup ? 
            <Input
              id="firstName"
              label="First Name"
              required
              autoCapitalize="none"
              errorText="Please enter a valid name"
              onInputChange={inputChangeHandler}
              initialValue=""
            /> : <View></View> }
            {isSignup ? 
              <Input
              id="lastName"
              label="Last Name"
              required
              autoCapitalize="none"
              errorText="Please enter a valid name"
              onInputChange={inputChangeHandler}
              initialValue=""
            /> : <View></View>}
           
            {isSignup ? 
              <Input
              id="contact"
              label="Contact Number"
              keyboardType="number-pad"
              textContentType = 'telephoneNumber'
              required
              minLength={10}
              autoCapitalize="none"
              errorText="Please enter a valid contact Number"
              onInputChange={inputChangeHandler}
              initialValue=""
            /> : <View></View>
            }
            {isSignup ? 
              <Input
              id="weight"
              label="Weight"
              keyboardType="number-pad"
              required
              autoCapitalize="none"
              errorText="Please enter a valid weight"
              onInputChange={inputChangeHandler}
              initialValue=""
            /> : <View></View>
            }

            {isSignup ? 
            <DatePicker
              style={{width: '100%',marginTop:10}}
              mode="date"
              placeholder="Select your Birth Date"
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
            /> : null
            }
          <TouchableOpacity onPress={authHandler}>
            <View style={{...styles.buttonContainer,...{
              backgroundColor : Colors.blue,
              borderWidth : 1
            }}}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.accent} />
              ) : (
                
                  <Text style={{...styles.textContainer,...{
                    color : 'white'
                  }}}>{isSignup ? 'Sign Up' : 'Login'}</Text>
               
              )}
            </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}>
            <View style={{...styles.buttonContainer,...{
              backgroundColor : Colors.accent,
              borderWidth : 1
            }}}>
              <Text style={styles.textContainer}>{`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}</Text>
            </View>
            </TouchableOpacity>
          </ScrollView>
        </Card>
      </LinearGradient>
    </View>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: 'Covid Bed Allotment'
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: 500,
    padding: 20
  },
  textContainer:{
    color:'black',
    textAlign:'center',
    padding:5,
    fontSize:15
  },
  buttonContainer: {
    width:'100%',
    marginTop: 10,
    borderRadius : 20,
    overflow : 'hidden'
  }
});

export default AuthScreen;
