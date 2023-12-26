import axios from 'axios';
import {emptyToken} from './AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authStore from '../../Zustand/store';
import {displayErrorToast, displaySuccessToast} from '../../utils';
import {envVars} from '../Helpers/constants';

export const api = axios.create({
  baseURL: envVars?.baseUrl,
});

api.interceptors.request.use(request => {
  return request;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  function (error) {
    if (error) {
      let e = JSON.parse(JSON.stringify(error));

      if (e.status == 403) {
        authStore.setState({token: ''});
        emptyToken();
        AsyncStorage.removeItem('Auth_token');
      } else if (e.status == 429) displayErrorToast('Too many request...');
      else if (e.status == 423) displayErrorToast('Retry After 50 seconds...');
      // else displayErrorToast('');
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);
