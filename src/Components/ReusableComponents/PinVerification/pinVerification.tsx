import React, {useState, useRef, useEffect} from 'react';
import {View, KeyboardAvoidingView, Platform, Keyboard} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useMutation, useQuery} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {wp} from '../../Helpers/responsive-ratio';
import {createBooking, payTheRemaining} from '../../Services/Booking';
import {
  Box,
  fonts,
  os,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import Header from '../Header';
import {Input} from '../Input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {verifyPin} from '../../Services/WalletApi';
import Button from '../Button';
import LoadingOverlay from '../LoadingOverlay';
import {forgotWalletPinChange, getUserProfile} from '../../Services/ProfileApi';
import {AuthConstants} from '../../../Redux';
import {useDispatch} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';

const PinVerification = ({route}) => {
  const {apiBody, otp, type, vanue, is_deposit, bookingData, is_insured} =
    route?.params;
  const [keyBoardOffsetHeight, setKeyboardOffsetHeight] = useState(0);
  // const keyboard = useAnimatedKeyboard();
  // const translateStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{translateY: -keyboard.height.value}],
  //   };
  // });

  useEffect(() => {
    function onKeyboardDidShow(e: KeyboardEvent) {
      // Remove type here if not using TypeScript
      setKeyboardOffsetHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setKeyboardOffsetHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const is_wallet_forgotpin = type == 'forgotWalletPin';
  const is_payremaining = type == 'is_payremaining';
  const dispatch = useDispatch();

  const [pinArray, setPinArray] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);
  const fifthTextInputRef = useRef(null);
  const sixthTextInputRef = useRef(null);

  useEffect(() => {
    setPinArray(['', '', '', '', '', '']);
  }, [isFocused]);

  const getUserProfileQuery = useQuery('getUserProfile', getUserProfile, {
    enabled: false,
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
      }
    },
    onError: error => {},
  });

  const createBook = useMutation('createBooking', createBooking, {
    onSuccess: data => {
      setIsLoading(false);
      if (data?.data?.success == 0) displayErrorToast(data?.data?.message);
      if (data?.success == 1) {
        getUserProfileQuery.refetch();
        navigation.navigate('PaymentSuccess', {
          booking: data?.data?.booking,
          vanue: vanue,
        });
      }
    },
  });

  const onSubmit = () => {
    const body = {
      ...apiBody,
      wallet_pin: pinArray.join(''),
      is_deposit: is_deposit,

      is_insured: is_insured !== undefined ? is_insured : null,
    };
    createBook?.mutate(body);
  };

  const {mutate} = useMutation('payTheRemaining', payTheRemaining, {
    onSuccess: data => {
      if (data?.success == 0) displayErrorToast(data?.message);
      if (data?.success == 1) {
        setIsLoading(false);
        displaySuccessToast(data?.message);
        navigation.navigate('BookingHistory');
      }
    },
    onError: error => {
      setIsLoading(false);

      displayErrorToast(
        'We are unable to process this payment. Please try other payment method.',
      );
    },
  });

  const onPayRemaining = () => {
    mutate({booking_id: bookingData?.id});
  };

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

  const refCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  const verifyPinMutation = useMutation('verifyPin', verifyPin, {
    onSuccess: data => {
      if (data?.success == 0) {
        setIsLoading(false);
        return displayErrorToast(data?.message);
      } else if (data?.success == 1) {
        !is_payremaining ? onSubmit() : onPayRemaining();
      } else {
        setIsLoading(false);
        return displayErrorToast('Something Went Wrong');
      }
    },
    onError: error => {
      setIsLoading(false);
      displayErrorToast(error?.data?.message);
    },
  });

  const forgotWalletPinChangeMutation = useMutation(
    'forgotWalletPinChange',
    forgotWalletPinChange,
    {
      onSuccess: data => {
        setIsLoading(false);
        if (data?.success == 0) {
          return displayErrorToast(data?.message);
        } else if (data?.success == 1) {
          setIsLoading(false);
          displaySuccessToast(data?.message);
          navigation.navigate('Tabs', {initialRoute: 'Profile'});
        } else {
          return displayErrorToast('Something Went Wrong');
        }
      },
      onError: error => {
        setIsLoading(false);
        displayErrorToast(error?.data?.message);
      },
    },
  );

  const handleSubmit = () => {
    setIsLoading(true);
    if (is_wallet_forgotpin) {
      const body = {pin: pinArray.join(''), otp: otp};
      forgotWalletPinChangeMutation.mutate(body);
    } else {
      const body = {pin: pinArray.join('')};
      verifyPinMutation.mutate(body);
    }
  };

  const handleForgotPin = () => navigation.navigate('ForgotPin');

  return (
    <Box style={[{flex: 1, backgroundColor: 'white'}]}>
      <Header left />

      <ScrollView
        //contentContainerStyle={{flex: 1}}
        style={{flex: 1, backgroundColor: 'white'}}>
        <Box flex={1} backgroundColor="white">
          <Text
            textAlign={'center'}
            variant={'blackshade16500'}
            style={{marginTop: wp(20)}}>
            Enter AFA PIN
          </Text>
          <Box
            style={[
              {
                marginVertical: wp(10),
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: wp(5),
              },
            ]}>
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
                  color: showPassword ? palette?.primary : palette.black,
                  backgroundColor:
                    pinArray[index] && showPassword
                      ? palette.primary
                      : palette?.white,
                  fontFamily: fonts.regular,
                  borderColor:
                    pinArray[index] && showPassword
                      ? palette.black
                      : palette?.placeholder,
                  fontSize: 14,
                  borderWidth: showPassword ? 0.5 : 0,
                  borderBottomWidth: pinArray[index] && !showPassword ? 0 : 0.5,
                  borderRadius: showPassword ? 30 : 0,
                  width: !showPassword ? wp(12) : wp(6),
                  height: !showPassword ? wp(12) : wp(6),
                }}
                textAlign={'center'}
                hidePassword={showPassword}
                pin
              />
            ))}
          </Box>
          <TouchableBox
            onPress={() => setShowPassword(!showPassword)}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={showPassword ? palette.primary : palette.placeholder}
            />
            <Text
              style={{marginTop: 2, marginLeft: 10}}
              variant={'primary14500'}>
              {showPassword ? 'Show PIN' : 'Hide PIN'}
            </Text>
          </TouchableBox>
          {!is_wallet_forgotpin && (
            <TouchableBox height={wp(30)} onPress={handleForgotPin}>
              <Text
                variant={'primary16500'}
                textAlign={'center'}
                style={{marginTop: wp(10)}}>
                FORGOT PIN?
              </Text>
            </TouchableBox>
          )}
        </Box>
      </ScrollView>

      <Box
        style={[
          Platform.OS === 'ios'
            ? {
                //flex: 1,
                //justifyContent: 'flex-end',
                //position: 'absolute',
                //bottom: 50,
                marginBottom: 20,
                //left: 0,
                //right: 0,
                marginHorizontal: 20,
              }
            : {
                //flex: 1,
                //justifyContent: 'flex-end',
                position: 'absolute',
                bottom: keyBoardOffsetHeight / 6.2,
                marginBottom: 10,
                left: 0,
                right: 0,
                marginHorizontal: 20,
              },
        ]}>
        <Box height={50}>
          <Button
            disabled={pinArray.join('').length != 6}
            label="Submit"
            onPress={handleSubmit}
          />
        </Box>
      </Box>
      {isLoading && <LoadingOverlay />}
    </Box>
  );
};

export default PinVerification;
