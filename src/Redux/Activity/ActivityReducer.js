import {combineReducers} from 'redux';
import ActivityConstants from './ActivityConstants';

export const activityReducer = (
  state = {
    body: [],
    totalPayable: 0,
    insufficient: false,
    clean: false,
    activityId: undefined,
  },
  action,
) => {
  switch (action.type) {
    case ActivityConstants?.CREATEACTIVITYBODY:
      return {
        ...state,
        body: action.body,
      };
    case ActivityConstants.TOTALPAYABLE:
      return {
        ...state,
        totalPayable: action.totalPayable,
      };
    case ActivityConstants.INSUFFICIENT:
      return {
        ...state,
        insufficient: action.insufficient,
      };
    case ActivityConstants.ACTIVITYCLEAN:
      return {
        ...state,
        clean: true,
      };
    case ActivityConstants.ACTIVITYID:
      return {
        ...state,
        activityId: action?.activityId,
      };
    default:
      return state;
  }
};

export const activityReducers = combineReducers({
  activity: activityReducer,
});
