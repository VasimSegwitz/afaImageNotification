/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch} from 'react-redux';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import authStore from '../../../Zustand/store';
import {wp} from '../../Helpers/responsive-ratio';
import Button from '../../ReusableComponents/Button';
import Header from '../../ReusableComponents/Header';
import {usekeyBoardOpen} from '../../ReusableComponents/Hooks';
import {Input} from '../../ReusableComponents/Input';
import LoadingOverlay from '../../ReusableComponents/LoadingOverlay';
import GeneralModal from '../../ReusableComponents/Modals/GeneralModal';
import {
  forgotPassword,
  login,
  reSendOtp,
  verifyForgotOtp,
  verifyOtp,
} from '../../Services/AuthService';
import {verifyEmailOTP} from '../../Services/ProfileApi';
import {Box, fonts, os, palette, Text, TouchableBox} from '../../Theme/Index';
import {styles} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthConstants} from '../../../Redux';
import {googleApiKey} from '../../Helpers/constants';
import Geocoder from 'react-native-geocoding';

export default props => {
  Geocoder.init(googleApiKey, {language: 'en'});

  const {navigation, route} = props;
  const {type, userinfo} = route?.params;
  const keyboardStatus = usekeyBoardOpen();
  const [phoneNumber, setPhoneNumber] = useState(route?.params?.phone);
  const [password, setPassword] = useState(route?.params?.password);
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [otpError, setOtperror] = useState('');
  const [counter, setCounter] = useState(59);

  const [fcmToken, setFcmToken] = useState();
  const setToken = authStore(state => state.setToken);
  const setFcmTokenStore = authStore(state => state.setFcmToken);
  const [keyboardOff, setKeyboardOff] = useState(0);
  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);
  const fifthTextInputRef = useRef(null);
  const sixthTextInputRef = useRef(null);

  const setGreeting = authStore(state => state?.setGreeting);

  const [data, setData] = useState();

  // {"data": {"max_resend": 5, "max_tries": 10, "next_timeout": "2022-12-23T06:45:03.555825Z", "request_type_name": "phone", "resend": 0, "seconds_remaining_seconds": 599, "tries": 0, "validity": "2022-12-23 12:24:03"}, "message": "Verification OTP sent to phone", "success": 1}

  const togglePicker = () => setOpenPicker(prev => !prev);
  const [openPicker, setOpenPicker] = useState(false);

  const dispatch = useDispatch();

  /**
   * @function useEffect
   * @description it will set the timeout first time when the screen focus
   */

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter, data]);

  const getfcmToken = async () => {
    let token = await AsyncStorage.getItem('fcmToken');
    setFcmTokenStore({fcmToken: token});
    setFcmToken(token);
  };

  useEffect(() => {
    getfcmToken();
  }, []);

  const updateUserInfo = data => {
    setGreeting({greeting: data?.data?.gender ? true : false});
    dispatch({
      type: AuthConstants.USER_INFO_RECEIVED,
      user: data,
    });
    dispatch({
      type: AuthConstants.USERSPORT,
      sport: data?.data?.favorite_sports?.map(item => item?.category),
    });

    data?.data?.user_info?.location_lat &&
      data?.data?.user_info?.location_long &&
      Geocoder.from(
        data?.data?.user_info?.location_lat,
        data?.data?.user_info?.location_long,
      )
        .then(json => {
          var location = json.results[0]?.formatted_address;

          const passedPlace = {
            location_lat: data?.data?.user_info?.location_lat,
            location_long: data?.data?.user_info?.location_long,
            name: location,
            info: {address: location},
          };

          dispatch({
            type: AuthConstants?.USERLOCATION,
            location: passedPlace,
          });
          dispatch({
            type: AuthConstants?.LOCATION,
            location: passedPlace,
          });
        })
        .catch(error => console.error(error));

    displaySuccessToast('Login Successful');
    setToken({token: data?.api_key});
    ``;
    AsyncStorage.setItem('Auth_token_Expiry', JSON.stringify(data));
    AsyncStorage.setItem('Auth_token', data?.api_key);
  };

  /**
   * @function verifyOtp
   * @description mutation for the verifyOtp
   */

  const {mutate} = useMutation('verifyOtp', verifyOtp, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
      }
      if (data?.success == 1) {
        displaySuccessToast(data?.message || 'User successfully verified');
        setGreeting({greeting: false});
        if (type == 'profilePhoneEdit') {
          navigation.navigate('Tabs', {initialRoute: 'Profile'});
        } else if (type == 'signup') {
          updateUserInfo(userinfo);
        } else navigation.navigate('Login');
      }
    },
  });

  const disable = otpArray.some(item => item == '');

  /**
   * @function otpResend
   * @description mutation for the reSendOtp
   */

  const otpResend = useMutation('reSendOtp', reSendOtp, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
      }
      if (data?.success == 1) {
        setCounter(60);
        setData(data?.data);

        displaySuccessToast(data?.message || 'Verification code has been sent');
      }
    },
  });

  /**
   * @function verifyForgot
   * @description mutation for the verifyForgotOtp
   */

  const verifyForgot = useMutation('verifyForgotOtp', verifyForgotOtp, {
    onSuccess: data => {
      // setOpenPicker(false);

      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
        setOtperror(data?.data?.message);
        return;
      }
      if (data?.success == 1) {
        setOtperror();
        displaySuccessToast(data?.message || 'Sent the Otp');
        navigation?.navigate('Reset', {
          otp: otpArray.join(''),
          phone: route?.params?.phone,
          phone_prefix: route?.params?.phone_prefix,
        });
      } else displayErrorToast(data?.data?.message || 'Invalid OTP');
    },
  });

  const verifyEmailOtpMutation = useMutation('verifyEmailOTP', verifyEmailOTP, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
        setOtperror(data?.data?.message);
        return;
      }
      if (data?.success == 1) {
        displaySuccessToast('Email successfully verified');
        AsyncStorage.setItem('is_email_verified', 'true');
        if (type == 'emailverification') {
          navigation.navigate('Tabs', {initialRoute: 'Wallet'});
        } else {
          navigation.navigate('Tabs', {initialRoute: 'Profile'});
        }
      }
    },
  });

  /**
   * @function onComplete
   * @description check the resend types for forgot or signup
   */

  const onComplete = e => {
    if (type == 'signup') {
      const body = {
        otp: otpArray.join(''),
      };
      mutate(body);
    } else if (type == 'profilePhoneEdit') {
      const body = {
        otp: otpArray.join(''),
      };
      mutate(body);
    } else if (type == 'profileEmailEdit') {
      const body = {
        otp: otpArray.join(''),
      };
      verifyEmailOtpMutation.mutate(body);
    } else if (type == 'emailverification') {
      const body = {
        otp: otpArray.join(''),
      };
      verifyEmailOtpMutation.mutate(body);
    } else if (type == 'forgotWalletPin') {
      navigation.navigate('PinVerification', {
        otp: otpArray.join(''),
        type: 'forgotWalletPin',
      });
    } else {
      const body = {
        phone_prefix: route?.params?.phone_prefix,
        phone: route?.params?.phone,
        otp: otpArray.join(''),
      };
      verifyForgot.mutate(body);
    }
  };

  /**
   * @function useEffect
   * @description will call the otpsend api for to send the otp on user device
   */

  useEffect(() => {
    const body = {
      otpType: '',
    };
    if (route?.parmas?.type == 'signup') otpResend.mutate(body);
  }, []);

  /**
   * @function onOtpChange
   * @param index
   * @description wil change the otp input via index params
   */

  const onOtpChange = index => {
    return value => {
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      setOtpArray(otpArrayCopy);

      for (var i = 0; i < otpArrayCopy.length; i++) {
        if (otpArrayCopy[i] == '') {
          setSubmittingOtp(true);
        } else {
          setSubmittingOtp(false);
        }
      }

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        if (index === 0) {
          secondTextInputRef.current.focus();
        } else if (index === 1) {
          thirdTextInputRef.current.focus();
        } else if (index === 2) {
          fourthTextInputRef.current.focus();
        } else if (index === 3) {
          fifthTextInputRef.current.focus();
        } else if (index === 4) {
          sixthTextInputRef.current.focus();
        }
      }
    };
  };

  /**
   * @function refCallback
   * @description a ref for the each of the input
   */

  const refCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  /**
   * @function onOtpKeyPress
   * @param index
   * @description will check for the key press if its backspace
   */

  const onOtpKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      // auto focus to previous InputText if value is blank and existing value is also blank

      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1) {
          firstTextInputRef.current.focus();
        } else if (index === 2) {
          secondTextInputRef.current.focus();
        } else if (index === 3) {
          thirdTextInputRef.current.focus();
        } else if (index === 4) {
          fourthTextInputRef.current.focus();
        } else if (index === 5) {
          fifthTextInputRef.current.focus();
        }

        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */

        if (!os.ios && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setOtpArray(otpArrayCopy);
        }
      }
    };
  };

  /**
   * @function resendForgot
   * @description mutation for the forgotpasword to resend the otp
   */

  const resendForgot = useMutation('forgotPassword', forgotPassword, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
      }
      if (data?.success == 1) {
        setCounter(60);
        setData(data?.data);

        displaySuccessToast(data?.message || 'Verification code has been sent');
      }
    },
  });

  /**
   * @function resend
   * @description will clear the otp array and focused on first input then call the resend mutate
   */

  const resend = () => {
    if (type == 'signup') {
      if (firstTextInputRef) {
        setOtpArray(['', '', '', '', '', '']);
        firstTextInputRef.current.focus();
        const body = {
          otpType: '',
        };
        otpResend.mutate(body);
      }
    } else {
      if (firstTextInputRef) {
        setOtpArray(['', '', '', '', '', '']);
        firstTextInputRef.current.focus();
        const body = {
          phone_prefix: route?.params?.phone_prefix,
          phone: route?.params?.phone,
        };
        resendForgot.mutate(body);
      }
    }
  };

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : null}
    //   style={{flex: 1}}
    //   >
    <Box
      flex={1}
      style={{backgroundColor: palette.white}}
      onStartShouldSetResponder={Keyboard.dismiss}>
      {otpResend?.isLoading ? <LoadingOverlay /> : null}
      <Header left navigation={navigation} />
      <Box flex={1} p="l">
        <Box style={styles.topImageWrap}>
          <Text style={styles.title}>{`Verify your ${
            type == 'emailverification' ? 'email' : 'phone number'
          }`}</Text>
        </Box>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flexGrow: 1, marginBottom: 10}}
          contentContainerStyle={{
            flexGrow: 1,
            // marginBottom: route?.params?.space?.bottom,
            // paddingBottom: route?.params?.space?.bottom,
          }}
          keyboardShouldPersistTaps="handled">
          <Box backgroundColor={'white'} flex={1} style={styles.whiteCard}>
            <Text style={styles.subtitle}>
              {`We sent a code to this ${
                type == 'emailverification' ? 'email.' : 'phone number.'
              }`}
            </Text>
            <Text style={styles.number}>
              {route?.params?.phone_prefix} {phoneNumber}
            </Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              {[
                firstTextInputRef,
                secondTextInputRef,
                thirdTextInputRef,
                fourthTextInputRef,
                fifthTextInputRef,
                sixthTextInputRef,
              ].map((textInputRef, index) => (
                <Input
                  otp
                  value={otpArray[index]}
                  onKeyPress={onOtpKeyPress(index)}
                  onChangeText={onOtpChange(index)}
                  otpIndex={otpArray[index]}
                  maxLength={1}
                  inputStyle={{
                    fontWeight: '500',
                    color: palette.primary,
                    fontFamily: fonts.regular,
                    borderColor: otpArray[index]
                      ? palette.primary
                      : 'rgba(0,0,0,.2)',
                    fontSize: 18,
                    borderWidth: 1,
                    borderRadius: 5,
                    width: wp(13),
                    height: wp(25),

                    textAlign: 'center',
                  }}
                  autoFocus={index === 0 ? true : false}
                  refCallback={refCallback(textInputRef)}
                  key={index}
                  keyboardType={'numeric'}
                />
              ))}
            </View>
            {otpError && (
              <Text variant={'destructive16400'} textAlign="center">
                Incorrect code. You can try 2 more times
              </Text>
            )}
            {/* {!keyboardStatus && ( */}

            {/* )} */}
          </Box>
        </ScrollView>
        <Box
          style={{
            // position: 'absolute',
            // bottom: wp(20),
            bottom: 10,
            justifyContent: 'flex-end',
            width: wp(100) - 40,
          }}>
          <Text style={styles.timerText} textAlign="center">
            0:{counter}
          </Text>
          {data && (
            <Text
              style={{
                color: palette?.primary,
                fontSize: 15,
                fontFamily: fonts?.medium,
                fontWeight: '500',
              }}
              textAlign="center"
              mb="s">
              Try Remains :
              <Text
                style={{
                  color: palette?.primary,
                  fontSize: 15,
                  fontFamily: fonts?.medium,
                  fontWeight: '500',
                }}>
                {data && data?.max_resend - data?.resend}
              </Text>
            </Text>
          )}

          <Button
            label="Verify"
            onPress={() => onComplete()}
            disabled={disable}
            buttonStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Box>
        {/* )} */}
        {/* {!keyboardStatus && ( */}
        <Box
          alignSelf="center"
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingBottom: 10,
            bottom: 10,
            // position: 'absolute',
          }}>
          <Text variant={'blackshade14400'}>Didn’t receive the code? </Text>
          <TouchableBox onPress={() => resend()}>
            <Text
              variant={'blackshade14400'}
              style={{
                textDecorationLine: 'underline',
                textAlign: 'center',
              }}>
              Resend
            </Text>
          </TouchableBox>
        </Box>
        <GeneralModal
          visible={openPicker}
          onClose={togglePicker}
          title={'Exceeded Maximum Tries'}
          detail="Please try again in 1 minute"
          buttonLabel={'ok'}
          onPress={() => {
            togglePicker();
          }}
        />
      </Box>
    </Box>
    // </KeyboardAvoidingView>
  );
};
