import {api} from './baseApi';

export const AddtoWishlist = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity_wishlist/add/${payload}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const RemovetoWishlist = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity_wishlist/remove/${payload}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const GetWishlist = async payload => {
  const [_, body] = payload?.queryKey;
  try {
    const {data} = await api.get(`/user_api/v1/activity_wishlist`, {
      params: payload,
    });
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};
