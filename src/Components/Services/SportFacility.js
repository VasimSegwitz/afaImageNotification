import {api} from './baseApi';

export const getFacility = async payload => {
  const [_, id] = payload?.queryKey;

  try {
    const {data} = await api.get(
      `/user_api/v1/sports_facility/gets?sports_complex_id=${id}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getSportFacility = async payload => {
  try {
    const {data} = await api.get(
      `/user_api/v1/sports_facility/get?id=${payload?.id}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};
