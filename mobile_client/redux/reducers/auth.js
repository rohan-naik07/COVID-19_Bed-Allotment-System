import { LOGOUT_USER,AUTHENTICATE } from '../actions/auth';

const initialState = {
  token: null,
  userId: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId
      };
    case  LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};
