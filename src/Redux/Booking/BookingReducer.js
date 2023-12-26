import {combineReducers} from 'redux';
import BookingConstants from './BookingConstants';

export const bookReducer = (
  state = {
    category: [],
    url: null,
    wishData: [],
    recentSearch: [],
  },
  action,
) => {
  switch (action.type) {
    case BookingConstants?.CATEGORY:
      return {
        ...state,
        category: action.category,
      };
    case BookingConstants?.RECENTSEARCH:
      return {
        ...state,
        recentSearch: action.recentSearch,
      };
    case BookingConstants?.PAYMENTURL:
      return {
        ...state,
        url: action.url,
      };
    case BookingConstants?.WISHLISTDATA:
      return {
        ...state,
        wishData: action.wishData,
      };
    default:
      return state;
  }
};

export const bookReducers = combineReducers({
  booking: bookReducer,
});
