import {api} from './baseApi';

export const getMyWalkingBookings = async payload => {
  const [_, type] = payload?.queryKey;
  try {
    const {data} = await api.get(`/staff/allBookings?filter=${type}`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getHospitalStatus = async () => {
  try {
    const {data} = await api.get(`/staff/hospital/walkin/status`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const updateHospitalStatus = async payload => {
  // const [_, type] = payload?.queryKey;
  try {
    const {data} = await api.patch(`/staff/hospital/walkin/status`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const acceptReject = async payload => {
  try {
    const {data} = await api.patch(
      `/staff/booking/status?id=${payload?.id}`,
      payload?.body,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};
