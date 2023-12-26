import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, Keyboard} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {Button, Header, LoadingOverlay} from '../../ReusableComponents';
import {Input} from '../../ReusableComponents/Input';
import {Box, fonts, os, palette, Text, TouchableBox} from '../../Theme/Index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useMutation} from 'react-query';
import {updatePin} from '../../Services/WalletApi';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';

const SetUpPin = ({route}) => {
  const progress = useSharedValue(0);
  const {params} = route;
  const {oldPinArray} = params;
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

  const initialState = {
    is_update_pin: false,
  };
  const [state, setState] = useState(initialState);

  const [updatePinArray, setUpdatePinArray] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    setState({
      ...state,

      is_update_pin: false,
    });
    setUpdatePinArray(['', '', '', '', '', '']);

    setShowPassword(true);
  }, [isFocused]);

  const updateFirstTextInputRef = useRef(null);
  const updateSecondTextInputRef = useRef(null);
  const updateThirdTextInputRef = useRef(null);
  const updateFourthTextInputRef = useRef(null);
  const updateFifthTextInputRef = useRef(null);
  const updateSixthTextInputRef = useRef(null);

  const onUpdatePinKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      if (value === 'Backspace' && updatePinArray[index] === '') {
        if (index === 1) {
          updateFirstTextInputRef.current.focus();
        } else if (index === 2) {
          updateSecondTextInputRef.current.focus();
        } else if (index === 3) {
          updateThirdTextInputRef.current.focus();
        } else if (index === 4) {
          updateFourthTextInputRef.current.focus();
        } else if (index === 5) {
          updateFifthTextInputRef.current.focus();
        }
        if (!os.ios && index > 0) {
          const otpArrayCopy = updatePinArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setUpdatePinArray(otpArrayCopy);
        }
      }
    };
  };

  const onUpdatePinChange = index => {
    return value => {
      const otpArrayCopy = updatePinArray.concat();
      otpArrayCopy[index] = value;
      setUpdatePinArray(otpArrayCopy);
      if (value !== '') {
        if (index === 0) {
          updateSecondTextInputRef.current.focus();
        } else if (index === 1) {
          updateThirdTextInputRef.current.focus();
        } else if (index === 2) {
          updateFourthTextInputRef.current.focus();
        } else if (index === 3) {
          updateFifthTextInputRef.current.focus();
        } else if (index === 4) {
          updateSixthTextInputRef.current.focus();
        }
      }
    };
  };

  const refreshUpdate = () => {
    const {params} = route;
    const {refresh} = params;
    navigation.goBack(null);
    refresh();
  };

  const updatePinRefCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Header left />
      <ScrollView contentContainerStyle={{flex: 1}}>
        <Box flex={1}>
          <Box justifyContent={'center'} alignItems={'center'}>
            <Text
              variant={'blackshade18500'}
              fontWeight={'bold'}
              style={{marginTop: wp(5)}}>
              Update your PIN
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
              updateFirstTextInputRef,
              updateSecondTextInputRef,
              updateThirdTextInputRef,
              updateFourthTextInputRef,
              updateFifthTextInputRef,
              updateSixthTextInputRef,
            ].map((textInputRef, index) => (
              <Input
                otp
                value={updatePinArray[index]}
                onKeyPress={onUpdatePinKeyPress(index)}
                onChangeText={onUpdatePinChange(index)}
                otpIndex={updatePinArray[index]}
                maxLength={1}
                autoFocus={index === 0 ? true : false}
                refCallback={updatePinRefCallback(textInputRef)}
                key={index}
                keyboardType={'numeric'}
                style={{
                  fontWeight: '500',
                  color: !showPassword ? palette.black : palette.primary,
                  backgroundColor:
                    updatePinArray[index] && showPassword
                      ? palette.primary
                      : palette?.white,
                  fontFamily: fonts.regular,
                  borderColor:
                    updatePinArray[index] && showPassword
                      ? palette.primary
                      : palette?.placeholder,
                  fontSize: 14,
                  borderWidth: showPassword ? 0.5 : 0,
                  borderBottomWidth:
                    updatePinArray[index] && !showPassword ? 0 : 0.5,
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
              disabled={oldPinArray.join('').length != 6}
              onPress={() => {
                navigation.navigate('ConfirmPin', {
                  oldPinArray: oldPinArray,
                  updatePinArray: updatePinArray,
                  refreshUpdate: refreshUpdate,
                });
              }}
            />
          </Animated.View>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default SetUpPin;
