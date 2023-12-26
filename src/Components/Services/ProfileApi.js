import {api} from './baseApi';

export const getUserProfile = async () => {
  try {
    const {data} = await api.get('/user_api/v1/profile/get_profile');
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const editProfile = async form => {
  try {
    const {data} = await api.post('/user_api/v1/profile/update_profile', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const uploadProfileImage = async form => {
  try {
    const {data} = await api.post(
      '/user_api/v1/profile/upload_profile_picture',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const changePassword = async form => {
  try {
    const {data} = await api.post('/common/u/change-password', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const udpateFcm = async form => {
  try {
    const {data} = await api.post('/user_api/v1/profile/update_fcm', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const verifyEmailSendOTP = async () => {
  try {
    const {data} = await api.post('/user_api/v1/auth/verify_email_send_otp');
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const verifyEmailOTP = async form => {
  try {
    const {data} = await api.post('/user_api/v1/auth/verify_email_otp', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const updateGameSkill = async form => {
  try {
    const {data} = await api.post(
      '/user_api/v1/profile/update_game_skill',
      form,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getActivity = async form => {
  const [_, body] = form?.queryKey;
  try {
    const {data} = await api.get('/user_api/v1/activity', {params: body});
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getBooking = async form => {
  const [_, body] = form?.queryKey;
  try {
    const {data} = await api.get('/user_api/v1/booking/gets', {params: body});
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const invite = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/invite/${form?.id}`,
      form,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const going = async id => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/going/${id?.id}`,
      id?.body,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const updateFavouriteSport = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/profile/update_favorite_sports`,
      form,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const resetPassword = async form => {
  try {
    const {data} = await api.post(`/user_api/v1/profile/change_password`, form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const forgotWalletPin = async () => {
  try {
    const {data} = await api.post(`/user_api/v1/wallet/forgot_pin`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const forgotWalletPinChange = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/wallet/forgot_pin_change`,
      form,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const deleteAccount = async () => {
  try {
    const {data} = await api.post(`/user_api/v1/profile/delete_account`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getVariables = async () => {
  try {
    const {data} = await api.get('/user_api/v1/variable/get-all');
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

const ProfileApi = {};

export default ProfileApi;
