import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
export const AUTHENTICATE = 'AUTHENTICATE'; 
export const LOGOUT_USER = 'LOGOUT_USER';
export const VERIFY_OTP = 'VERIFY_OTP';

const baseUrl = "http://192.168.0.35:8000/";

let timer;

export const authenticate = (user, token) => {
  return dispatch => {
    dispatch({ 
      type: AUTHENTICATE, 
      userId: user, 
      token: token
     });
  };
}

export const getOtp = ()=>{
  const token = AsyncStorage.getItem('userData').token;
  return async dispatch=>{
    const response = await fetch(
      "http://192.168.0.35:3000/auth/verify/",
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : "Bearer " + token, // otp sent to mail
          'Access-Control-Allow-Origin' : '*'
        }
      }
    );
    console.log(response.json())
  }
}

export const verifyOtp = (otp)=>{
  const token = useSelector(state=>state.auth.token)
  return async dispatch=>{
    const response = await fetch(
      baseUrl + "auth/verify",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : "Bearer " + token,
          'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
          otp : otp  // otp verification request after entering mailed otp
        })
      }
    );

    console.log(response.json())
  }
}

export const signup = (
    firstName,
    lastName,
    email,
   password,
    number,
    birthDate,
    weight
   ) => {
    return async dispatch => {
      const response = await fetch(
        baseUrl + "auth/register/",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
          },
          body: JSON.stringify({
            first_name : firstName,
            last_name: lastName,
            email: email,
            password: password,
            contact : number,
            birthday : birthDate,
            weight : weight
          })
        }
      );

      console.log(response.json())
  
      /*if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_EXISTS') {
          message = 'This email exists already!';
        }
        throw new Error(message);
      }
  
      const resData = await response.json();
      console.log(resData);

      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn) *1000
        )
      );
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);*/
    };
  };
  

export const loginUser = (email, password)=>{
    const loginUrl = baseUrl + "login/";

    return async dispatch=>{
        const response = await fetch(loginUrl,{
            method: 'POST',
            headers : {
                'content-type' : 'application/json',
                'Access-Control-Allow-Origin' : '*'
            },
            body: JSON.stringify({
                email,
                password
            })

        });
        console.log(response.json());
        /*if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            let message = 'Something went wrong!';

            if (errorId === 'EMAIL_NOT_FOUND') {
              message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD') {
              message = 'This password is not valid!';
            }
            throw new Error(message);
          }
        
          const resData = await response.json();
          console.log(resData);
          dispatch(
            authenticate(
              resData.localId,
              resData.idToken,
              parseInt(resData.expiresIn) *1000
            )
          );
          saveDataToStorage(resData.idToken, resData.localId, expirationDate);*/
    }
}

export const logoutUser = ()=>{
  AsyncStorage.removeItem('userData');
  return ({ type : LOGOUT_USER })
}

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logoutUser());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, user) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      user: user
    })
  );
};