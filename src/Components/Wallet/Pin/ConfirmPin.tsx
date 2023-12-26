import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, Keyboard, InputAccessoryView} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {Button, Header, LoadingOverlay} from '../../ReusableComponents';
import {Input} from '../../ReusableComponents/Input';
import {Box, fonts, os, palette, Text, TouchableBox} from '../../Theme/Index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useMutation} from 'react-query';
import {updatePin} from '../../Services/WalletApi';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const ConfirmPin = ({route}) => {
  const inputAccessoryViewID = 'uniqueID';
  const progress = useSharedValue(0);
  const {params} = route;
  const {oldPinArray, updatePinArray} = params;
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [confirmPinArray, setConfirmPinArray] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [keyBoardOffsetHeight, setKeyboardOffsetHeight] = useState(0);

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -progress.value}],
    };
  });

  useEffect(() => {
    progress.value = withTiming(keyBoardOffsetHeight);
  }, [keyBoardOffsetHeight]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      e => {
        setKeyboardOffsetHeight(e.endCoordinates.height);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardOffsetHeight(0);
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  useEffect(() => {
    setConfirmPinArray(['', '', '', '', '', '']);
    setShowPassword(true);
    setError(false);
    setIsLoading(false);
  }, [isFocused]);

  const confirmFirstTextInputRef = useRef(null);
  const confirmSecondTextInputRef = useRef(null);
  const confirmThirdTextInputRef = useRef(null);
  const confirmFourthTextInputRef = useRef(null);
  const confirmFifthTextInputRef = useRef(null);
  const confirmSixthTextInputRef = useRef(null);

  const onConfirmPinKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      if (value === 'Backspace' && confirmPinArray[index] === '') {
        if (index === 1) {
          confirmFirstTextInputRef.current.focus();
        } else if (index === 2) {
          confirmSecondTextInputRef.current.focus();
        } else if (index === 3) {
          confirmThirdTextInputRef.current.focus();
        } else if (index === 4) {
          confirmFourthTextInputRef.current.focus();
        } else if (index === 5) {
          confirmFifthTextInputRef.current.focus();
        }
        if (!os.ios && index > 0) {
          const otpArrayCopy = confirmPinArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setConfirmPinArray(otpArrayCopy);
        }
      }
    };
  };

  const onConfirmPinChange = index => {
    return value => {
      const otpArrayCopy = confirmPinArray.concat();
      otpArrayCopy[index] = value;
      setConfirmPinArray(otpArrayCopy);
      if (value !== '') {
        if (index === 0) {
          confirmSecondTextInputRef.current.focus();
        } else if (index === 1) {
          confirmThirdTextInputRef.current.focus();
        } else if (index === 2) {
          confirmFourthTextInputRef.current.focus();
        } else if (index === 3) {
          confirmFifthTextInputRef.current.focus();
        } else if (index === 4) {
          confirmSixthTextInputRef.current.focus();
        }
      }
    };
  };

  const refreshConfirm = () => {
    const {params} = route;
    const {refreshUpdate} = params;
    navigation.goBack(null);
    refreshUpdate();
  };

  const confirmPinRefCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  const setPinMutation = useMutation('updatePin', updatePin, {
    onSuccess: data => {
      setIsLoading(false);
      if (data?.success == 0) {
        return displayErrorToast(data?.message);
      } else if (data?.success == 1) {
        navigation.navigate('PinSuccess', {refreshConfirm: refreshConfirm});
      } else {
        return displayErrorToast('Something Went Wrong');
      }
    },
    onError: error => {
      console.log(error);
      setIsLoading(false);
      displayErrorToast(error?.data?.message);
    },
  });

  const handleConfirmPin = () => {
    if (updatePinArray.join('') == confirmPinArray.join('')) {
      setError(false);
      setIsLoading(true);
      const body = {
        pin: oldPinArray.join(''),
        new_pin: confirmPinArray.join(''),
      };
      setPinMutation.mutate(body);
    } else {
      setError(true);
      displayErrorToast('Error');
    }
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Header
        onback={() => {
          Keyboard.dismiss();
          setTimeout(() => {
            navigation.goBack(null);
          }, 200);
        }}
        left
      />
      {isLoading && <LoadingOverlay />}
      <ScrollView contentContainerStyle={{flex: 1}}>
        <Box flex={1} backgroundColor="white">
          <Box justifyContent={'center'} alignItems={'center'}>
            <Text
              variant={'blackshade18500'}
              fontWeight={'bold'}
              style={{marginTop: wp(5)}}>
              Confirm your PIN
            </Text>
          </Box>
          <View
            style={{
              marginTop: wp(10),
              marginHorizontal: wp(5),
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            {[
              confirmFirstTextInputRef,
              confirmSecondTextInputRef,
              confirmThirdTextInputRef,
              confirmFourthTextInputRef,
              confirmFifthTextInputRef,
              confirmSixthTextInputRef,
            ].map((textInputRef, index) => (
              <Input
                otp
                value={confirmPinArray[index]}
                onKeyPress={onConfirmPinKeyPress(index)}
                onChangeText={onConfirmPinChange(index)}
                otpIndex={confirmPinArray[index]}
                maxLength={1}
                autoFocus={index === 0 ? true : false}
                refCallback={confirmPinRefCallback(textInputRef)}
                key={index}
                keyboardType={'numeric'}
                style={{
                  fontWeight: '500',
                  color: !showPassword ? palette.black : palette.primary,
                  backgroundColor:
                    confirmPinArray[index] && showPassword
                      ? palette.primary
                      : palette?.white,
                  fontFamily: fonts.regular,
                  borderColor:
                    confirmPinArray[index] && showPassword
                      ? palette.primary
                      : palette?.placeholder,
                  fontSize: 14,
                  borderWidth: showPassword ? 0.5 : 0,
                  borderBottomWidth:
                    confirmPinArray[index] && !showPassword ? 0 : 0.5,
                  borderRadius: showPassword ? 30 : 0,
                  width: !showPassword ? wp(12) : wp(6),
                  height: !showPassword ? wp(12) : wp(6),
                }}
                inputStyle={{
                  marginTop: wp(4),
                }}
                textAlign={'center'}
                hidePassword={showPassword}
                pin
              />
            ))}
          </View>
          <TouchableBox
            mt={'l'}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            onPress={() => setShowPassword(!showPassword)}>
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
          {error && (
            <Text mt={'m'} variant={'destructive14400'} textAlign={'center'}>
              Incorrect PIN. Please try again.
            </Text>
          )}

          <Animated.View
            style={[
              //Platform.OS === 'ios' ? translateStyle : {},
              Platform.OS === 'ios'
                ? {
                    position: 'absolute',
                    bottom: 50,
                    marginBottom: 20,
                    left: 0,
                    right: 0,
                    marginHorizontal: 20,
                  }
                : {
                    flex: 1,
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    bottom: 50,
                    marginBottom: 20,
                    left: 0,
                    right: 0,
                    marginHorizontal: 20,
                  },
            ]}>
            <Button
              label="Next"
              disabled={confirmPinArray.join('').length != 6}
              onPress={handleConfirmPin}
            />
          </Animated.View>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default ConfirmPin;
