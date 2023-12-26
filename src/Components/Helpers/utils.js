import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @function getProp
 * @param {*} p
 * @desc it will get the data string from the repsonse
 */
export const getProp = p => o =>
  p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);

/**
 * @function setUserInfo
 * @param info
 * @returns Promise
 * @description Save user info into async storage
 */
export const setAuthToken = info => {
  AsyncStorage.setItem('Auth_token', JSON.stringify(info));
};

/**
 * @function removeAuthInfo
 * @description remove user info from async storage
 */
export const removeAuthToken = () => {
  AsyncStorage.removeItem('Auth_token');
};

/**
 * @function getToken
 * @returns userInfo
 * @description Returns user info if saved in async storage else null
 */
export const getToken = async () => {
  const token = await AsyncStorage.getItem('Auth_token').then(data => {
    try {
      const info = data;
      return info;
    } catch (e) {
      return null;
    }
  });
  return token;
};

/**
 * @function getrefreshToken
 * @returns userInfo
 * @description Returns user info if saved in async storage else null
 */
export const getrefreshToken = async () => {
  const token = await AsyncStorage.getItem('Auth_token_Expiry').then(data => {
    try {
      const info = data;
      return info;
    } catch (e) {
      return null;
    }
  });
  return token;
};

/**
 * @function getIsEmailVerified
 * @returns Boolean value
 * @description Returns is user email verified saved in async storage else null
 */
export const getIsEmailVerified = async () => {
  const is_email_verified = await AsyncStorage.getItem(
    'is_email_verified',
  ).then(data => {
    try {
      const info = data;
      return info;
    } catch (e) {
      return null;
    }
  });
  return is_email_verified;
};

/**
 * @function getIsWalletActivated
 * @returns Boolean value
 * @description Returns is user wallet activated saved in async storage else null
 */
export const getIsWalletActivated = async () => {
  const is_wallet_activated = await AsyncStorage.getItem(
    'is_wallet_activated',
  ).then(data => {
    try {
      const info = data;
      return info;
    } catch (e) {
      return null;
    }
  });
  return is_wallet_activated;
};

/**
 * @function vanueSets
 * @param info
 * @returns Promise
 * @description Save user info into async storage
 */
export const vanueSets = async info => {
  await AsyncStorage.setItem('vanue', info);
};

/**
 * @function removeVanueSets
 * @description remove vanue info from async storage
 */
export const removeVanueSets = async () => {
  await AsyncStorage.removeItem('vanue');
};

/**
 * @function getVanue
 * @returns userInfo
 * @description Returns user info if saved in async storage else null
 */
export const getVanue = async () => {
  const vanue = await AsyncStorage.getItem('vanue').then(data => {
    try {
      const info = data;
      return info;
    } catch (e) {
      return null;
    }
  });
  return vanue;
};
