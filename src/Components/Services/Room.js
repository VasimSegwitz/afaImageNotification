import {api} from './baseApi';

export const getRoom = async payload => {
  const [_, type] = payload?.queryKey;
  try {
    const {data} = await api.get(`/staff/room/list?filter=${type}`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};
