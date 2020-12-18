import Colors from '../constants/Colors';
import React, { useCallback, useEffect, useState,useReducer} from 'react';
import {
  Button,
  StyleSheet,
  View,
  Modal,
  Text,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import * as productsActions from '../redux/actions/auth';
import Input from '../components/Input';
import Snackbar from 'react-native-snackbar';


const OTPModal=props => {
  const dispatch = useDispatch();
  const [error,setError] = useState(null);
  const [otp,setOtp] = useState("");
  const [loading,setLoading] = useState(false);
  const token = useSelector(state=>state.auth.token)
  const isVerified = useSelector(state=>state.auth.otpVerified)

  const { open,toggleModal,isSignUp } = props

  useEffect(()=>{
    const sendOtp = async ()=>{
      if(open && token){
        console.log('Sending OTP Request...');
        Snackbar.show({
          text: 'Hello world',
          duration: Snackbar.LENGTH_SHORT,
        });
        try{
          setLoading(true);
          await dispatch(productsActions.getOtp(token));
        } catch (e){
          setError(e.message);
        }
        setLoading(false);
      } 
    }
    sendOtp();

  },[open,token])

  const cancelHandler = useCallback(() => {
    if(isSignUp){
      props.navigation.navigate("Home")
      return;
    }
    if(token ){
      console.log("LOGOUT")
      dispatch(productsActions.logoutUser())
    }
    toggleModal();
    //snackbar
  },[dispatch,token,toggleModal,isSignUp])

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submitHandler = async () => {
    console.log(otp)
    try{
      setLoading(true);
      await dispatch(productsActions.verifyOtp(parseInt(otp),token));
      Snackbar.show({
        text: 'Otp Verified Sucessfully',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (e){
      setLoading(false);
      setError(e.message);
      console.log(e.message)
      return;
    }
    setLoading(false);
    props.navigation.navigate('Home')
  }


  if(loading && open){
    //snackbar
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <ActivityIndicator size="small" color={Colors.accent} />
          </View>
        </View>
      </Modal>
    )
  }

  

  return(
      <Modal
          animationType="fade"
          transparent={true}
          visible={open}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.textHeader}>Verify OTP</Text>
              </View>

              <View style={styles.formControl}>
                <Text style={styles.label}>We have emailed you an OTP. Please provide it below</Text>
                  <TextInput
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                    style={styles.input}
                    value={otp}
                    onChangeText={text=>setOtp(text)}
                  />
              </View>

              <View style={{
                flexDirection:'row',
                width : '100%',
                padding : 5,
                margin :10,
                justifyContent : 'space-between'
              }}>
                <View style={{...styles.button,...styles.submit}}>
                    <Button
                      color={Colors.blue}
                      title="Verify"
                      onPress={submitHandler}/>
                  </View>
                  <View style={{...styles.button,...styles.submit}}>
                    <Button
                      color={Colors.accent}
                      title="Cancel"
                      onPress={cancelHandler}/>
                 </View>
              </View>  
            </View>
          </View>
        </Modal>
      )
  }

  const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        //alignItems: "center"
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      formControl: {
        width: '100%'
      },
      label: { 
        marginHorizontal: 5,
        marginVertical : 5
      },
      input: {
        padding: 5,
        borderColor: '#ccc',
        borderRadius : 10,
        borderWidth: 1
      },
      button: {
        width:'40%',
        borderRadius:20,
        overflow:'hidden'
      },
      modalHeader : {
        borderWidth : 1,
        borderRadius : 20,
        padding : 10
      },
      textHeader : {
        fontSize : 20,
        color : 'black'
      },
      submit : {
        width : '40%',
        justifyContent: "center",
        //alignItems: "center"
      }
})

export default OTPModal;