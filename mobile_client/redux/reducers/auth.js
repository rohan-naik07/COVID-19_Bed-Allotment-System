import { 
  LOGOUT_USER,
  AUTHENTICATE,
  VERIFY_OTP_PASSED,
  VERIFY_OTP_FAILED } from '../actions/auth';

const initialState = {
  token: null,
  otpVerified : false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        token: action.token
      };
    case VERIFY_OTP_PASSED:
      return {
        ...state,
        otpVerified : true
      }
    case VERIFY_OTP_FAILED:
        return {
          ...state,
          otpVerified : false
        }
    case  LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};
