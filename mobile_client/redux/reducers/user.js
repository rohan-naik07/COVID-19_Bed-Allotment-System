import { FETCH_PROFILE,EDIT_PROFILE } from '../actions/user';

const initialState = {
    profileData : null
};

export default (state = initialState, action) => {
    switch (action.type) {
      case EDIT_PROFILE:
        return {
          ...state,
          profileData : action.profileData
        };
      case FETCH_PROFILE:
        return {
          ...state,
          profileData : action.profileData
        }
      default:
        return state;
    }
  };
  


  