import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, Keyboard} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {Button, Header, LoadingOverlay} from '../../ReusableComponents';
import {Input} from '../../ReusableComponents/Input';
import {
  Box,
  fonts,
  os,
  palette,
  size,
  Text,
  TouchableBox,
} from '../../Theme/Index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useMutation} from 'react-query';
import {verifyPin} from '../../Services/WalletApi';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';

const SetUpPin = () => {
  const progress = useSharedValue(0);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

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

  const [loading, setLoading] = useState(false);
  const initialState = {
    is_old_pin: true,
  };
  const [state, setState] = useState(initialState);

  const [oldPinArray, setOldPinArray] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    setState({
      ...state,
      is_old_pin: true,
    });
    setOldPinArray(['', '', '', '', '', '']);
    setShowPassword(true);
  }, [isFocused]);

  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);
  const fifthTextInputRef = useRef(null);
  const sixthTextInputRef = useRef(null);

  const onOldPinKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      if (value === 'Backspace' && oldPinArray[index] === '') {
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
        if (!os.ios && index > 0) {
          const otpArrayCopy = oldPinArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setOldPinArray(otpArrayCopy);
        }
      }
    };
  };

  const onOldPinChange = index => {
    return value => {
      const otpArrayCopy = oldPinArray.concat();
      otpArrayCopy[index] = value;
      setOldPinArray(otpArrayCopy);
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

  const oldPinRefCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  const refresh = () => {
    navigation.goBack(null);
  };

  const verifyPinMutation = useMutation('verifyPin', verifyPin, {
    onSuccess: data => {
      Keyboard.dismiss();
      setLoading(false);
      if (data?.success == 0) {
        return displayErrorToast(data?.message);
      } else if (data?.success == 1) {
        navigation.navigate('UpdatePin', {
          oldPinArray: oldPinArray,
          refresh: refresh,
        });
      } else {
        setLoading(false);
        return displayErrorToast('Something Went Wrong');
      }
    },
    onError: error => {
      setLoading(false);
      displayErrorToast(error?.data?.message);
    },
  });

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
      {loading ? <LoadingOverlay /> : null}
      <ScrollView contentContainerStyle={{flex: 1}}>
        <Animated.View style={[{flex: 1, backgroundColor: 'white'}]}>
          <Box justifyContent={'center'} alignItems={'center'}>
            <Text
              variant={'blackshade18500'}
              fontWeight={'bold'}
              style={{marginTop: wp(5)}}>
              Enter old PIN
            </Text>
          </Box>
          <Animated.View
            style={[
              {
                minHeight: 30,
                marginTop: wp(10),
                marginHorizontal: wp(5),
                flexDirection: 'row',
                justifyContent: 'space-around',
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
                value={oldPinArray[index]}
                onKeyPress={onOldPinKeyPress(index)}
                onChangeText={onOldPinChange(index)}
                otpIndex={oldPinArray[index]}
                maxLength={1}
                autoFocus={index === 0 ? true : false}
                refCallback={oldPinRefCallback(textInputRef)}
                key={index}
                keyboardType={'numeric'}
                style={{
                  fontWeight: '500',
                  color: !showPassword ? palette.black : palette.primary,
                  backgroundColor:
                    oldPinArray[index] && showPassword
                      ? palette.primary
                      : palette?.white,
                  fontFamily: fonts.regular,
                  borderColor:
                    oldPinArray[index] && showPassword
                      ? palette.primary
                      : palette?.placeholder,
                  fontSize: 14,
                  borderWidth: showPassword ? 0.5 : 0,
                  borderBottomWidth:
                    oldPinArray[index] && !showPassword ? 0 : 0.5,
                  borderRadius: showPassword ? 30 : 0,
                  width: !showPassword ? wp(12) : wp(6),
                  height: !showPassword ? wp(12) : wp(6),
                }}
                textAlign={'center'}
                hidePassword={showPassword}
                pin
              />
            ))}
          </Animated.View>
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
          <Animated.View
            style={[
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
              disabled={oldPinArray.join('').length != 6}
              onPress={() => {
                setLoading(true);
                const body = {pin: oldPinArray.join('')};
                verifyPinMutation.mutate(body);
              }}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </Box>
  );
};

export default SetUpPin;
