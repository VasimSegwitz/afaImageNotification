import {api} from './baseApi';

export const getNotificationList = async payload => {
  const [_, body] = payload?.queryKey;

  try {
    const {data} = await api.get(`/user_api/v1/notification`, {
      params: body,
    });
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};
