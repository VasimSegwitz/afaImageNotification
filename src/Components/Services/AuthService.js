import {api} from './baseApi';

export const setToken = token => {
  if (api) {
    api.defaults.headers.common = {
      'api-key': token,
    };
    // = `Bearer ${token}`;
  }
};

// export const setToken = token => {
//   if (api) {
//     api.defaults.headers.Authorization = `Bearer ${token}`;
//   }
// };

export const emptyToken = () => {
  if (api) {
    delete api.defaults.headers.common['api-key'];
    delete api.defaults.headers.Authorization;
  }
};

export const login = async form => {
  try {
    const {data} = await api.post('/user_api/v1/auth/login', form);
    if (data?.api_key) {
      setToken(data?.api_key);
    }
    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const refreshToken = async form => {
  try {
    setToken(form?.refresh);

    const {data} = await api.post('/common/u/refresh-tokens');
    if (data?.data?.tokens?.access?.token) {
      setToken(data?.data?.tokens?.access?.token);
    }
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const userSignUp = async form => {
  try {
    const {data} = await api.post('/user_api/v1/auth/register', form);

    if (data?.api_key) {
      // emptyToken();
      setToken(data?.api_key);
    }
    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const userCheckPhoneNumber = async form => {
  try {
    const {data} = await api.post('/user_api/v1/auth/check-phone-number', form);
    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const verifyOtp = async form => {
  try {
    const {data} = await api.post(
      '/user_api/v1/auth/verify_phone_number_otp',
      form,
    );
    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const reSendOtp = async () => {
  try {
    const {data} = await api.post(
      '/user_api/v1/auth/verify_phone_number_send_otp',
    );
    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const verifyForgotOtp = async form => {
  try {
    const {data} = await api.post(
      '/user_api/v1/auth/forgot_password_phone_number_verify_otp',
      form,
    );
    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const completeProfile = async form => {
  try {
    const {data} = await api.post('/user/completeProfile', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const termsPrivacyAccept = async form => {
  try {
    const {data} = await api.post('/user/termsPrivacyAccept', form);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const forgotPassword = async form => {
  try {
    const {data} = await api.post(
      '/user_api/v1/auth/forgot_password_phone_number_send_otp',
      form,
    );
    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const resetPassword = async form => {
  try {
    const {data} = await api.post(
      '/user_api/v1/auth/forgot_password_phone_number_change_password',
      form,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const logoutUser = async form => {
  try {
    const {data} = await api.post('/common/u/logout', form);
    emptyToken();
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

const AuthService = {};

export default AuthService;
