import {api} from './baseApi';

export const activateWallet = async () => {
  try {
    const {data} = await api.post('/user_api/v1/wallet/activate');
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getWalletTransactions = async form => {
  const [_, body] = form?.queryKey;
  try {
    const {data} = await api.get('/user_api/v1/wallet/get_transactions', {
      params: body,
    });
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const walletTopup = async form => {
  try {
    const {data} = await api.post('/user_api/v1/wallet/confirm_top_up', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const createPin = async form => {
  try {
    const {data} = await api.post('/user_api/v1/wallet/create_pin', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const updatePin = async form => {
  try {
    const {data} = await api.post('/user_api/v1/wallet/change_pin', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const verifyPin = async form => {
  try {
    const {data} = await api.post('/user_api/v1/wallet/verify_pin', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getWalletBalance = async form => {
  const [_, body] = form?.queryKey;
  try {
    const {data} = await api.get('/user_api/v1/wallet/get_transactions', {
      params: body,
    });
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};
