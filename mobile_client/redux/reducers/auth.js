import { 
  LOGOUT_USER,
  AUTHENTICATE,
  VERIFY_OTP } from '../actions/auth';

const initialState = {
  token: null,
  otp : null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        token: action.token
      };
    case VERIFY_OTP :
      return {
        ...state,
        otp : action.otp
      }
    case  LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};
