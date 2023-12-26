import axios from 'axios';
import {api} from './baseApi';

export const getCategory = async form => {
  const [_, body] = form?.queryKey;
  try {
    const {data} = await api.get(`/user_api/v1/sports_complex/category`, {
      params: body,
    });
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getSportComplex = async payload => {
  const [_, body] = payload?.queryKey;

  try {
    const {data} = await api.get(`/user_api/v1/sports_complex`, {
      params: body,
    });

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};
