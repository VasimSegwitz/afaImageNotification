/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Keyboard, ScrollView} from 'react-native';
import {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {Input} from '../../ReusableComponents/Input';
import Button from '../../ReusableComponents/Button';
import {wp} from '../../Helpers/responsive-ratio';
import MobileConfirmation from '../../ReusableComponents/Modals/MobileConfirmation';
import authStore from '../../../Zustand/store';
import {useMutation} from 'react-query';
import {login} from '../../Services/AuthService';
import {displayErrorToast, displaySuccessToast, ios} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthConstants} from '../../../Redux';
import {useDispatch} from 'react-redux';
import Geocoder from 'react-native-geocoding';
import {googleApiKey} from '../../Helpers/constants';
import {requestUserPermission} from '../../../utils/notificationService';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

export default props => {
  Geocoder.init(googleApiKey, {language: 'en'});

  const {navigation, route} = props;
  const dispatch = useDispatch();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fcmToken, setFcmToken] = useState();
  const [signupCountryCode, SetSignupCountryCode] = useState('');
  const setToken = authStore(state => state.setToken);
  // const setswapToken = authStore((state) => state.setswapToken);
  const setGreeting = authStore(state => state?.setGreeting);

  const setFcmTokenStore = authStore(state => state.setFcmToken);
  const fcmTok = authStore(state => state?.fcmToken);
  const regex = /^[a-zA-Z ]+$/;

  /**
   * @function getfcmToken
   * @description it will fetch the fcm token from store
   */

  const getfcmToken = async () => {
    let token = await AsyncStorage.getItem('fcmToken');
    console.log('--------------token------------------');
    console.log(token);
    console.log('--------------token------------------');
    setFcmTokenStore({fcmToken: token});

    setFcmToken(token);
  };

  /**
   * @function useFocusEffect
   * @description it will get fcmtoken
   */
  useFocusEffect(
    useCallback(() => {
      requestUserPermission();

      getfcmToken();
    }, []),
  );

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  /**
   * @function onSubmit
   * @description it will call the Login function after validation done
   */

  const onSubmit = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    setPhoneError();
    setPasswordError();

    // if (!phone.includes('@') && phone?.length < 10) {
    if (!phone.includes('@') && phone?.length < 1) {
      setPhoneError(
        'Your phone number should be between 10 to 11 digits. Please enter a valid number.',
      );
      return;
    }

    if (phone.includes('@') && phone.trim().length === 0) {
      setPhoneError('Incorrect email');
      return;
    }
    if (phone.includes('@') && reg.test(phone) === false) {
      setPhoneError('Incorrect email');
      return;
    }

    if (password && password.trim().length === 0) {
      setPasswordError('Enter Password');
      return;
    }

    onLogin();
  };

  const d = parseInt(phone, 10);

  /**
   * @function onLogin
   * @description this function will call the login api
   */

  const onLogin = () => {
    const body = {
      email: phone.includes('@') ? phone : '',
      phone_prefix: signupCountryCode,
      phone: phone.includes('@') ? '' : d.toString(),
      password: password,
      fcm_token:
        fcmToken ||
        (fcmTok?.hasOwnProperty('fcmToken') ? fcmTok?.fcmToken : fcmTok) ||
        'test',
    };

    mutate(body);
    // togglePicker();
  };

  /**
   * @function mutate
   * @description login mutation of the login api
   */

  const {isLoading, mutate} = useMutation('login', login, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
        setPasswordError(data?.data?.message);
      }
      if (data?.success == 1) {
        setGreeting({greeting: data?.data?.gender ? true : false});

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

        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });

        dispatch({
          type: AuthConstants.USERSPORT,
          sport: data?.data?.favorite_sports?.map(item => item?.category),
        });
        setPasswordError();
        setTimeout(() => {
          setToken({
            token: data?.api_key,
          });
        }, 800);

        // setswapToken({
        //   token: data?.data?.tokens?.access?.token,
        // });

        AsyncStorage.setItem('Auth_token_Expiry', JSON.stringify(data));

        AsyncStorage.setItem('Auth_token', data?.api_key);
        // navigation?.navigate('Verification', {type: 'signup'});
      }
    },
    onError: error => {},
  });

  return (
    <Box
      flex={1}
      p="t"
      backgroundColor={'white'}
      style={{
        paddingTop: route?.params?.space?.top,
        paddingBottom: route?.params?.space?.bottom,
      }}
      onStartShouldSetResponder={Keyboard.dismiss}>
      <Box style={TypographyStyles?.grow}>
        <Box
          mb="xl"
          style={{
            marginTop: wp(30),
          }}>
          <Text variant={'blackshade28500'}>
            Welcome back! It's nice to see you again.
          </Text>
        </Box>

        <Input
          place="Enter your phone number"
          value={phone}
          error={phoneError}
          onChange={e => setPhone(e.replace(/[^0-9]/g, ''))}
          contact
          numberPad
          maxLength={11}
          SetSignupCountryCode={SetSignupCountryCode}
        />
        <Input
          place="Password"
          value={password}
          error={passwordError}
          onChange={e => setPassword(e)}
          hidePassword
        />
        <Box alignItems="flex-end" style={{marginTop: 0, marginBottom: 10}}>
          <TouchableBox
            onPress={() => {
              navigation.navigate('Forgot');
            }}>
            <Text variant={'blackshade14400'}>Forgot Password?</Text>
          </TouchableBox>
        </Box>

        <Box
          width={wp(100) - 30}
          height={size?.height / 2}
          // position={'absolute'}
          bottom={20}
          mt="m"
          flex={1}
          justifyContent="flex-end"
          alignSelf="flex-end">
          <Button
            onPress={() => onSubmit()}
            label={'Login'}
            buttonStyle={{
              height: wp(10),
            }}
          />
        </Box>

        <Box alignSelf={'center'} bottom={10} alignItems="center">
          <Text variant={'blackshade14400'}>
            Don't have an account?
            <Text
              variant="blackshade14400"
              textDecorationLine="underline"
              onPress={() => navigation?.navigate('Signup')}
              style={{
                marginLeft: 5,
              }}>
              {' register now'}
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
