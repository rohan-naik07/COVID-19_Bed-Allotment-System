import AsyncStorage from '@react-native-async-storage/async-storage';
export const AUTHENTICATE = 'AUTHENTICATE'; 
export const LOGOUT_USER = 'LOGOUT_USER';
export const VERIFY_OTP_PASSED = 'VERIFY_OTP_PASSED';
export const VERIFY_OTP_FAILED = 'VERIFY_OTP_FAILED'

const baseUrl = "http://192.168.1.101:8000/";

export const authenticate = (token) => {
  return dispatch => {
    dispatch({ 
      type: AUTHENTICATE,
      token: token
     });
  };
}

export const getOtp = (token)=>{
  return async ()=>{
    const response = await fetch(
       baseUrl + "auth/verify/",
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Token ${token.toString()}`, // otp sent to mail
          'Access-Control-Allow-Origin' : '*'
        }
      }
    );
    const responseData = await response.json();

    if (!responseData.success) {
      throw new Error(responseData.message);
    }
  }
}

export const verifyOtp = (otp,token)=>{
 
  return async dispatch=>{
    const response = await fetch(
      baseUrl + "auth/verify/",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Token ${token.toString()}`, // otp sent to mail
          'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
          otp : otp  // otp verification request after entering mailed otp
        })
      }
    );

    const responseData = await response.json();
    if (!responseData.success) {
      dispatch({
        type : VERIFY_OTP_FAILED
      });
      throw new Error(responseData.message);
    }

    dispatch({
      type : VERIFY_OTP_PASSED
    });
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
      const responseData = await response.json();
    
      if (!responseData.success) {
        throw new Error(responseData.message);
      }
  
      dispatch(
        authenticate(
          responseData.token
        )
      );
      saveDataToStorage(responseData.token);
    };
  };
  

export const loginUser = (email, password)=>{
    const loginUrl = baseUrl + "auth/login/";

    return async dispatch=>{
        const response = await fetch(loginUrl,{
            method: 'POST',
            headers : {
                'content-type' : 'application/json',
                'Access-Control-Allow-Origin' : '*'
            },
            body: JSON.stringify({
                email:email,
                password:password
            })

        });
        const responseData = await response.json();
    
        if (!responseData.success) {
          throw new Error(responseData.message);
        }

        if(!responseData.is_verified){
          dispatch({
            type : VERIFY_OTP_FAILED
          })
        } else{
          console.log('User is verified')
          dispatch({
            type : VERIFY_OTP_PASSED
          })
        }
        
        dispatch(
          authenticate(
            responseData.token
          )
        );
        saveDataToStorage(responseData.token);
    }
}

export const logoutUser = ()=>{
  AsyncStorage.removeItem('jwtToken');
  return ({ type : LOGOUT_USER })
}

const saveDataToStorage = (token) => {
  AsyncStorage.setItem(
    'jwtToken',
    JSON.stringify({
      token: token
    })
  );
};