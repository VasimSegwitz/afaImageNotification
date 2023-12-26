import React from 'react';
import {Linking, Platform} from 'react-native';

export const CallNow = phone => {
  let phoneNumber = phone;
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.openURL(phoneNumber);
};
