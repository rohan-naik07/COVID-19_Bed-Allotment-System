import Colors from '../constants/Colors';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  View,
  Modal,
  Text
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as productsActions from '../redux/actions/auth';
import Input from '../components/Input';


const OTPModal=props => {
  const dispatch = useDispatch();
  const [otp,setOtp] = useState("");
  const onInputChange = (text)=>{
    setOtp(text);
  }

  const { open,toggleModal } = props

  useEffect(()=>{
    
    if(open){
      console.log('Sending OTP Request...');
      //dispatch(productsActions.getOtp());
    }
      
  },[open])

  
  const submitHandler = useCallback(() => {
    dispatch(productsActions.verifyOtp(parseInt(otp)));
  }, [dispatch]);

     return(
      <Modal
          animationType="fade"
          transparent={true}
          visible={props.open}>

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.textHeader}>Verify OTP</Text>
              </View>
              
              <Input
                id="OTP"
                label="We have emailed you an OTP. Please provide it below"
                errorText="Please enter a valid price!"
                keyboardType="decimal-pad"
                returnKeyType="next"
                initialValue = {0}
                onInputChange={onInputChange}
                required
              />

              <View style={{
                flexDirection:'row',
                width : '100%',
                padding : 5,
                margin :10,
                justifyContent : 'space-between'
              }}>
                <View style={{...styles.button,...styles.submit}}>
                    <Button
                      color={Colors.accent}
                      title="Verify"
                      onPress={submitHandler}/>
                  </View>
                  <View style={{...styles.button,...styles.submit}}>
                    <Button
                      color={Colors.primary}
                      title="Cancel"
                      onPress={() => {
                      props.toggleModal();
                    }}/>
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
        borderColor : Colors.primary,
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