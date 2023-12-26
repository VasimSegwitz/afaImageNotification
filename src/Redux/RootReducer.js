import {combineReducers} from 'redux';
import {
  authReducers,
  AuthConstants,
  BookingConstants,
  bookReducers,
  activityReducers,
  ActivityConstants,
} from '../Redux/index';

const combinedReducer = combineReducers({
  auth: authReducers,
  book: bookReducers,
  activity: activityReducers,
});

const rootReducer = (state, action) => {
  let newState = {...state};
  if (action.type === AuthConstants.RESET_STATE) {
    newState = undefined;
  }
  return combinedReducer(newState, action);
};

export default rootReducer;
