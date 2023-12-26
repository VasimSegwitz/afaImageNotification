import {combineReducers} from 'redux';
import authConstants from './AuthConstants';

export const userInfoReducer = (
  state = {
    user: undefined,
    dashData: {},
    loading: false,
    room: null,
    status: false,
    sport: [],
    location: null,
    userlocation: null,

    recentLocation: [],
    anothersport: [],
    searchedLocation: [],
    deeplink: undefined,
  },
  action,
) => {
  switch (action.type) {
    case authConstants.USER_INFO_RECEIVED:
      return {
        ...state,
        user: action.user,
      };
    case authConstants.SELECTED_USER_ACCOUNT:
      return {
        ...state,
        account: action.account,
      };
    case authConstants.DASHBOARD:
      return {
        ...state,
        dashData: action.dashData,
      };
    case authConstants.GET_PROFILE_STATUS:
      return {
        ...state,
        getStatus: action.dashData,
      };
    case authConstants.LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case authConstants.ROOM:
      return {
        ...state,
        room: action.room,
      };
    case authConstants.STATUS:
      return {
        ...state,
        status: action.status,
      };
    case authConstants.USERSPORT:
      return {
        ...state,
        sport: action.sport,
      };
    case authConstants.LOCATION:
      return {
        ...state,
        location: action.location,
      };
    case authConstants.USERLOCATION:
      return {
        ...state,
        userlocation: action.location,
      };
    case authConstants.RECENTLOCATION:
      return {
        ...state,
        recentLocation: action.recentLocation,
      };
    case authConstants.USERSEARCHEDLOCATION:
      return {
        ...state,
        searchedLocation: action.searchedLocation,
      };
    case authConstants.ANOTHERSPORT:
      return {
        ...state,
        anothersport: action.anothersport,
      };
    case authConstants.DEEPLINK:
      return {
        ...state,
        deeplink: action.deeplink,
      };
    default:
      return state;
  }
};

export const authReducers = combineReducers({
  user: userInfoReducer,
});
