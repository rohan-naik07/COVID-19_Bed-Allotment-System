import AsyncStorage from '@react-native-async-storage/async-storage';
export const AUTHENTICATE = 'AUTHENTICATE'; 
export const LOGOUT_USER = 'LOGOUT_USER';

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (email, password) => {
    return async dispatch => {
      const response = await fetch(
        'signup endpoint',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
          })
        }
      );
  
      if (!response.ok) {
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
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000 
      );
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
  };
  

export const loginUser = (email, password)=>{
    const loginUrl = 
    '';

    return async dispatch=>{
        const response = await fetch(loginUrl,{
            method: 'POST',
            headers : {
                'content-type' : 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })

        });
        if (!response.ok) {
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
          const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000 
          );
          saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

export const logoutUser = ()=>{
  clearLogoutTimer();
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

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};