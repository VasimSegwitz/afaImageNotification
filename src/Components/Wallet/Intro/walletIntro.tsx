import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ScrollView, ImageBackground, TextInput, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Button, Header, LoadingOverlay} from '../../ReusableComponents';
import {Box, fonts, os, palette, Text, TouchableBox} from '../../Theme/Index';
import styles from './styles';
import {useMutation} from 'react-query';
import {activateWallet, createPin} from '../../Services/WalletApi';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getIsEmailVerified} from '../../Helpers/utils';
import {Input} from '../../ReusableComponents/Input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WalletIntro = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const nameRegex = /^[a-zA-Z ]+$/;
  const {email, first_name, last_name} = useSelector(
    state => state?.auth?.user?.user?.data,
  );
  const {email_verified_datetime} = useSelector(
    state => state?.auth?.user?.user?.data?.user_info,
  );

  const initialState = {
    is_start: false,
    is_name: true,
    name: '',
    nameError: '',
    email: '',
    emailError: '',
    is_contact: false,
    is_pin: false,
    is_reenter_pin: false,
  };

  const [state, setState] = useState(initialState);
  const [isEmailVerified, setIsEmailVerified] = useState('false');
  const [pinArray, setPinArray] = useState(['', '', '', '', '', '']);
  const [rePinArray, setRePinArray] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);
  const fifthTextInputRef = useRef(null);
  const sixthTextInputRef = useRef(null);

  const rePinfirstTextInputRef = useRef(null);
  const rePinsecondTextInputRef = useRef(null);
  const rePinthirdTextInputRef = useRef(null);
  const rePinfourthTextInputRef = useRef(null);
  const rePinfifthTextInputRef = useRef(null);
  const rePinsixthTextInputRef = useRef(null);

  const IsEmailVerifiedHelper = async () => {
    return await getIsEmailVerified()
      .then(val => {
        setIsEmailVerified(val);
      })
      .catch(error => {});
  };

  /**
   * @function useEffect
   * @description It will reset to initial state
   */

  useEffect(() => {
    setState({
      ...state,
      is_start:
        isEmailVerified == 'true' || email_verified_datetime != null
          ? true
          : false,
      is_name:
        isEmailVerified == 'true' || email_verified_datetime != null
          ? false
          : true,
      name: '',
      email: '',
      emailError: '',
      nameError: '',
      is_contact: false,
      is_pin:
        isEmailVerified == 'true' || email_verified_datetime != null
          ? true
          : false,
      is_reenter_pin: false,
    });
    setPinArray(['', '', '', '', '', '']);
    setRePinArray(['', '', '', '', '', '']);
    IsEmailVerifiedHelper();
  }, [isFocused]);

  const handleStart = () => setState({...state, is_start: true});
  const onChangeName = value => setState({...state, name: value});
  const onChangeEmail = value => setState({...state, email: value});

  const handleNext = () => {
    if (first_name.length < 2 || !first_name?.match(nameRegex))
      return setState({
        ...state,
        nameError: 'Name accepts only alphabets and min length 2',
      });
    setState({...state, is_name: false, is_contact: true});
  };

  /**
   * @function activateWalletMutation
   * @description Invokes activate wallet api when valid email submitted.
   */

  const activateWalletMutation = useMutation('activateWallet', activateWallet, {
    onSuccess: data => {
      setIsLoading(false);
      if (data?.success == 0) {
        return displayErrorToast(data?.message);
      } else if (data?.success == 1) {
        AsyncStorage.setItem('is_wallet_activated', 'true');
        navigation.navigate('WalletTransaction' as never);
        displaySuccessToast('Wallet Activated Successfully');
      } else {
        return displayErrorToast('Something Went Wrong');
      }
    },
    onError: error => {
      setIsLoading(false);
      if (error?.data?.message == 'Wallet Already Activated')
        return displayErrorToast('Wallet Already Activated');
    },
  });

  const setPinMutation = useMutation('createPin', createPin, {
    onSuccess: data => {
      if (data?.success == 0) {
        return displayErrorToast(data?.message);
      } else if (data?.success == 1) {
        activateWalletMutation.mutate();
      } else {
        return displayErrorToast('Something Went Wrong');
      }
    },
    onError: error => {
      setIsLoading(false);
      displayErrorToast(error?.data?.message);
    },
  });

  const handleVerifyEmail = () => {
    if (email_verified_datetime == null && isEmailVerified != 'true')
      return navigation.navigate('VerifyEmail');
    if (email && email.trim().length === 0)
      return setState({...state, emailError: 'Fill in an email address'});
    if (emailRegex.test(email) === false)
      return setState({...state, emailError: 'Invalid email address'});
    setState({...state, is_contact: false, is_pin: true});
  };

  /**
   * @function onPinKeyPress
   * @param index
   * @description will check for the key press if its backspace
   */

  const onPinKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      // auto focus to previous InputText if value is blank and existing value is also blank

      if (value === 'Backspace' && pinArray[index] === '') {
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
         * clear the focused text box as well only on Android because on mweb onPinChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */

        if (!os.ios && index > 0) {
          const otpArrayCopy = pinArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setPinArray(otpArrayCopy);
        }
      }
    };
  };

  const onRePinKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      // auto focus to previous InputText if value is blank and existing value is also blank

      if (value === 'Backspace' && rePinArray[index] === '') {
        if (index === 1) {
          rePinfirstTextInputRef.current.focus();
        } else if (index === 2) {
          rePinsecondTextInputRef.current.focus();
        } else if (index === 3) {
          rePinthirdTextInputRef.current.focus();
        } else if (index === 4) {
          rePinfourthTextInputRef.current.focus();
        } else if (index === 5) {
          rePinfifthTextInputRef.current.focus();
        }

        /**
         * clear the focused text box as well only on Android because on mweb onPinChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */

        if (!os.ios && index > 0) {
          const otpArrayCopy = rePinArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setRePinArray(otpArrayCopy);
        }
      }
    };
  };

  /**
   * @function onPinChange
   * @param index
   * @description wil change the otp input via index params
   */

  const onPinChange = index => {
    return value => {
      const otpArrayCopy = pinArray.concat();
      otpArrayCopy[index] = value;
      setPinArray(otpArrayCopy);
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

  const onRePinChange = index => {
    return value => {
      const otpArrayCopy = rePinArray.concat();
      otpArrayCopy[index] = value;
      setRePinArray(otpArrayCopy);
      if (value !== '') {
        if (index === 0) {
          rePinsecondTextInputRef.current.focus();
        } else if (index === 1) {
          rePinthirdTextInputRef.current.focus();
        } else if (index === 2) {
          rePinfourthTextInputRef.current.focus();
        } else if (index === 3) {
          rePinfifthTextInputRef.current.focus();
        } else if (index === 4) {
          rePinsixthTextInputRef.current.focus();
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

  const rePinRefCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  const handleNextPin = () => {
    setState({...state, is_reenter_pin: true, is_pin: false});
  };

  const handleReenterPin = () => {
    if (pinArray.join('') === rePinArray.join('')) {
      setError(false);
      setIsLoading(true);
      const body = {pin: pinArray.join('')};
      setPinMutation.mutate(body);
    } else {
      setError(true);
    }
  };

  return (
    <Box flex={1} backgroundColor="white">
      {!state.is_start && <Header title="Activate Wallet" left />}
      {isLoading && <LoadingOverlay />}
      <ScrollView showsVerticalScrollIndicator={false}>
        {!state.is_start ? (
          <>
            <Box mt={'m'} alignItems={'center'}>
              <FastImage
                source={Images.ActivateWallet}
                style={{
                  height: wp(80),
                  width: wp(80),
                  marginLeft: wp(20),
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </Box>
            <Box p={'l'}>
              <Text variant={'primary24500'} mt={'m'}>
                Activate your Wallet
              </Text>
              <Text variant={'tertiary16400'} marginVertical={'m'}>
                Get AFA Pay and enjoy the full benefits of AFA App. This will
                only take a few minutes.
              </Text>
              <Text variant={'blackshade16400'}>
                • Seamless transactions for all bookings
              </Text>
              <Text variant={'blackshade16400'}>
                • Send, receive and split payments without worries
              </Text>
              <Text variant={'blackshade16400'}>
                • Get cashback and rewards
              </Text>
            </Box>
          </>
        ) : (
          <Box flex={1}>
            <ImageBackground
              source={Images?.ActivateWalletTopNav}
              style={{
                height: wp(60),
                width: '100%',
              }}
              resizeMode={FastImage?.resizeMode?.stretch}>
              <Header title="Activate Wallet" left white primary />
            </ImageBackground>
            <Box
              style={styles.activateWalletBottomContainer}
              backgroundColor="white">
              <Box
                flexDirection={'row'}
                justifyContent={'space-between'}
                marginHorizontal={'m'}
                mt={'l'}>
                <Box alignItems={'center'}>
                  <Box
                    style={styles.bottomHeader}
                    height={wp(2)}
                    backgroundColor={state.is_name ? 'primary' : 'tertiary4'}
                    mb={'s'}
                  />
                  <Text
                    variant={state.is_name ? 'primary14500' : 'tertiary14500'}
                    style={{fontWeight: 'bold'}}>
                    Full name
                  </Text>
                </Box>
                <Box alignItems={'center'}>
                  <Box
                    style={styles.bottomHeader}
                    height={wp(2)}
                    backgroundColor={state.is_contact ? 'primary' : 'tertiary4'}
                    mb={'s'}
                  />
                  <Text
                    variant={
                      state.is_contact ? 'primary14500' : 'tertiary14500'
                    }
                    style={{fontWeight: 'bold'}}>
                    Contact Info
                  </Text>
                </Box>
                <Box alignItems={'center'}>
                  <Box
                    style={styles.bottomHeader}
                    height={wp(2)}
                    backgroundColor={
                      state.is_pin || state.is_reenter_pin
                        ? 'primary'
                        : 'tertiary4'
                    }
                    mb={'s'}
                  />
                  <Text
                    variant={
                      state.is_pin || state.is_reenter_pin
                        ? 'primary14500'
                        : 'tertiary14500'
                    }
                    style={{fontWeight: 'bold'}}>
                    Create PIN
                  </Text>
                </Box>
              </Box>

              {state.is_name && (
                <Box pt={'l'} marginHorizontal={'m'}>
                  <Text
                    variant={'blackshade16500'}
                    style={{fontWeight: 'bold', marginBottom: 15}}>
                    Your full name
                  </Text>
                  <TextInput
                    placeholder={'Enter your full name as per your myKad.'}
                    style={[
                      styles.inputStyle,
                      {
                        borderColor:
                          state.nameError.length > 0
                            ? palette?.destructive
                            : palette.inputBorder,
                      },
                    ]}
                    placeholderTextColor={palette?.placeholder}
                    onChangeText={onChangeName}
                    value={first_name + ' ' + last_name}
                    editable={false}
                  />
                  {state.nameError.length > 0 && (
                    <Text variant={'destructive14400'}>{state.nameError}</Text>
                  )}
                </Box>
              )}

              {state.is_contact && (
                <Box pt={'l'} marginHorizontal={'m'}>
                  <Text
                    variant={'blackshade16500'}
                    style={{fontWeight: 'bold'}}>
                    Your email
                  </Text>
                  <Text variant={'tertiary16400'} marginVertical={'s'} mb={'m'}>
                    You will be required to verify your email adress before
                    activating your AFA Wallet
                  </Text>
                  <TextInput
                    placeholder={'Your email'}
                    style={[
                      styles.inputStyle,
                      {
                        borderColor:
                          state.emailError.length > 0
                            ? palette?.destructive
                            : palette.inputBorder,
                      },
                    ]}
                    placeholderTextColor={palette?.placeholder}
                    onChangeText={onChangeEmail}
                    value={email}
                    editable={false}
                  />
                  {state.emailError.length > 0 && (
                    <Text variant={'destructive14400'}>{state.emailError}</Text>
                  )}
                </Box>
              )}

              {state.is_pin && (
                <Box pt={'l'} marginHorizontal={'m'}>
                  <Text
                    variant={'blackshade16500'}
                    style={{fontWeight: 'bold'}}>
                    Set up PIN
                  </Text>
                  <Text variant={'tertiary16400'} marginVertical={'s'} mb={'m'}>
                    A PIN provides extra security and ensures that only you can
                    access and make transactions with AFA Pay.
                  </Text>
                  <Text
                    variant={'blackshade16500'}
                    textAlign={'center'}
                    style={{fontWeight: 'bold'}}>
                    {'Enter a new PIN'}
                  </Text>

                  <View
                    style={{
                      marginVertical: wp(3),
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
                        value={pinArray[index]}
                        onKeyPress={onPinKeyPress(index)}
                        onChangeText={onPinChange(index)}
                        otpIndex={pinArray[index]}
                        maxLength={1}
                        autoFocus={index === 0 ? true : false}
                        refCallback={refCallback(textInputRef)}
                        key={index}
                        keyboardType={'numeric'}
                        style={{
                          fontWeight: '500',
                          color: !showPassword
                            ? palette.black
                            : palette.primary,
                          backgroundColor:
                            pinArray[index] && showPassword
                              ? palette.primary
                              : palette?.white,
                          fontFamily: fonts.regular,
                          borderColor:
                            pinArray[index] && showPassword
                              ? palette.primary
                              : palette?.placeholder,
                          fontSize: 14,
                          borderWidth: showPassword ? 0.5 : 0,
                          borderBottomWidth:
                            pinArray[index] && !showPassword ? 0 : 0.5,
                          borderRadius: showPassword ? 30 : 0,
                          width: !showPassword ? wp(12) : wp(6),
                          height: !showPassword ? wp(12) : wp(6),
                        }}
                        textAlign={'center'}
                        hidePassword={showPassword}
                        pin
                      />
                    ))}
                  </View>
                  <Text
                    variant="placeholder12400"
                    textAlign={'center'}
                    style={{marginHorizontal: wp(3)}}>
                    {`Your PIN can't have repeating (e.g.1111) or \nconsecutive (e.g.12345) numbers`}
                  </Text>
                  <TouchableBox
                    flexDirection={'row'}
                    justifyContent={'center'}
                    mt={'l'}
                    alignItems={'center'}
                    onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={
                        showPassword ? palette.primary : palette.placeholder
                      }
                    />
                    <Text
                      style={{marginTop: 2, marginLeft: 10}}
                      variant={'primary14500'}>
                      {showPassword ? 'Show PIN' : 'Hide PIN'}
                    </Text>
                  </TouchableBox>
                </Box>
              )}

              {state.is_reenter_pin && (
                <Box pt={'l'} marginHorizontal={'m'}>
                  <Text
                    variant={'blackshade16500'}
                    style={{fontWeight: 'bold'}}>
                    Set up PIN
                  </Text>
                  <Text variant={'tertiary16400'} marginVertical={'s'} mb={'m'}>
                    A PIN provides extra security and ensures that only you can
                    access and make transactions with AFA Pay.
                  </Text>
                  <Text
                    variant={'blackshade16500'}
                    textAlign={'center'}
                    style={{fontWeight: 'bold'}}>
                    {'Re-enter your PIN'}
                  </Text>

                  <View
                    style={{
                      marginVertical: wp(3),
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    {[
                      rePinfirstTextInputRef,
                      rePinsecondTextInputRef,
                      rePinthirdTextInputRef,
                      rePinfourthTextInputRef,
                      rePinfifthTextInputRef,
                      rePinsixthTextInputRef,
                    ].map((textInputRef, index) => (
                      <Input
                        otp
                        value={rePinArray[index]}
                        onKeyPress={onRePinKeyPress(index)}
                        onChangeText={onRePinChange(index)}
                        otpIndex={rePinArray[index]}
                        maxLength={1}
                        autoFocus={index === 0 ? true : false}
                        refCallback={rePinRefCallback(textInputRef)}
                        key={index}
                        keyboardType={'numeric'}
                        style={{
                          fontWeight: '500',
                          color: !showPassword
                            ? palette.black
                            : palette.primary,
                          backgroundColor:
                            rePinArray[index] && showPassword
                              ? palette.primary
                              : palette?.white,
                          fontFamily: fonts.regular,
                          borderColor:
                            rePinArray[index] && showPassword
                              ? palette.primary
                              : palette?.placeholder,
                          fontSize: 14,
                          borderWidth: showPassword ? 0.5 : 0,
                          borderBottomWidth:
                            rePinArray[index] && !showPassword ? 0 : 0.5,
                          borderRadius: showPassword ? 30 : 0,
                          width: !showPassword ? wp(12) : wp(6),
                          height: !showPassword ? wp(12) : wp(6),
                        }}
                        textAlign={'center'}
                        hidePassword={showPassword}
                        pin
                      />
                    ))}
                  </View>

                  {!error ? (
                    <Text
                      variant="placeholder12400"
                      textAlign={'center'}
                      style={{marginHorizontal: wp(3)}}>
                      {`Your PIN can't have repeating (e.g.1111) or \nconsecutive (e.g.12345) numbers`}
                    </Text>
                  ) : (
                    <Text variant={'destructive14400'} textAlign={'center'}>
                      Incorrect PIN. Please try again.
                    </Text>
                  )}

                  <TouchableBox
                    flexDirection={'row'}
                    justifyContent={'center'}
                    mt={'l'}
                    alignItems={'center'}
                    onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={
                        showPassword ? palette.primary : palette.placeholder
                      }
                    />
                    <Text
                      style={{marginTop: 2, marginLeft: 10}}
                      variant={'primary14500'}>
                      {showPassword ? 'Show PIN' : 'Hide PIN'}
                    </Text>
                  </TouchableBox>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </ScrollView>
      <Box>
        {!state.is_pin && !state.is_reenter_pin && (
          <Box
            p={'s'}
            flexDirection={'row'}
            marginHorizontal={'m'}
            alignItems={'center'}
            marginVertical={'s'}>
            <FastImage
              source={Images.PrivacyPolicyShield}
              style={{
                height: wp(6),
                width: wp(6),
                marginLeft: -5,
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text variant={'blackshade112400'} ml={'m'}>
              Your details are protected in accordance with our Privacy Policy.
            </Text>
          </Box>
        )}
        {!state.is_start ? (
          <Box height={wp(14)} marginHorizontal={'m'} mb="m">
            <Button label="Start" onPress={handleStart} />
          </Box>
        ) : state.is_name ? (
          <Box height={wp(14)} marginHorizontal={'m'} mb="m">
            <Button label="Next" onPress={handleNext} />
          </Box>
        ) : state.is_contact ? (
          <Box height={wp(14)} marginHorizontal={'m'} mb="m">
            <Button label="Verify my Email" onPress={handleVerifyEmail} />
          </Box>
        ) : state.is_pin || state.is_reenter_pin ? (
          <Box height={wp(14)} marginHorizontal={'m'} mb="m">
            <Button
              label="Next"
              onPress={state.is_reenter_pin ? handleReenterPin : handleNextPin}
            />
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default WalletIntro;
