import {api} from './baseApi';

export const getToEarn = async () => {
  try {
    const {data} = await api.get('/user_api/v1/mission/to-earn');
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getEarned = async page => {
  try {
    const {data} = await api.get(
      `/user_api/v1/loyalty_point/transactions?page=${page}&pagePage=10`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getMyRewards = async type => {
  try {
    const {data} = await api.get(
      `/user_api/v1/user_rewards/get-rewards?perPage=10&page=1`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getStatusOfVouchers = async type => {
  try {
    const {data} = await api.get(`/user_api/v1/user_rewards/get-counts`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getMyVouchersList = async type => {
  try {
    const {data} = await api.get(
      `/user_api/v1/user_rewards/gets?perPage=500&page=1&type=${type}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const activeLevel = async type => {
  try {
    const {data} = await api.get(`/user_api/v1/activity/total_completed`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const redeemVoucher = async id => {
  try {
    const {data} = await api.post(`/user_api/v1/user_rewards/redeem/${id}`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

const RewardsApi = {};

export default RewardsApi;
