import React, {useEffect, useState} from 'react';
import {Platform, TextInput, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {hp, wp} from '../../Helpers/responsive-ratio';

import {
  Text,
  palette,
  Box,
  TouchableBox,
  fonts,
  TypographyStyles,
} from '../../Theme/Index';
import {AntDesignIcon} from '../Icons';
import {styles} from './styles';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
export const Input = props => {
  const {
    placeholder,
    value,
    onChange,
    numberPad,
    maxLength,
    editable,
    hidePassword,
    contact,
    error,
    inputStyle,
    onChangeHigh,
    onChangeLow,
    refCallback,
    otp = false,
    otpIndex = false,
    pin,
    rightArrow,
    SetSignupCountryCode,
    showLoader,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changeCountryCode, setChangeCountryCode] = useState(false);
  const [contryCode, setCountryCode] = useState('+60');
  const handleFocus = () => {
    // if (!value) {
    setIsFocused(false);
    // }
  };

  useEffect(() => {
    if (value?.length) {
      focus();
    }
  }, [value, contryCode]);

  const focus = () => {
    SetSignupCountryCode && SetSignupCountryCode(contryCode);
    setIsFocused(true);
  };

  const ios = Platform.OS === 'ios';

  const handleCountryCode = () => setChangeCountryCode(!changeCountryCode);
  const handleChangeCountryCode = () => {
    setCountryCode(contryCode == '+60' ? '+65' : '+60');
    setChangeCountryCode(false);
  };

  return (
    <Box
      style={{
        marginHorizontal: 1,
      }}>
      {/* {title ? (
        <Text
          style={[
            styles.inputLabel,
            {color: error ? palette.red : palette.placeholder},
          ]}>
          {title}
        </Text>
      ) : null} */}
      {!props.low && (
        <TextInput
          placeholder={
            isFocused ? props.place || '' : placeholder || props?.place
          }
          style={[
            styles.input,
            inputStyle,
            {
              height: props?.note ? hp(17) : otp ? wp(13) : wp(12),
              textAlignVertical: props?.note ? 'top' : 'auto',

              // paddingTop: props?.note
              //   ? 10
              //   : isFocused && !ios
              //   ? 25
              //   : isFocused && ios
              //   ? 10
              //   : ios
              //   ? 0
              //   : 10,
              paddingLeft: isFocused && contact ? 60 : 15,
              borderColor: error
                ? palette?.destructive
                : otpIndex
                ? palette?.primary
                : palette.inputBorder,
              shadowColor: error
                ? palette?.destructive
                : otpIndex
                ? palette?.primary
                : '#000',
              borderWidth: error ? 0 : otp ? 1 : 0,
              // borderStyle: error ? 'dotted' : 'solid',

              shadowOffset: {
                width: 1,
                height: 0.5,
              },
              shadowOpacity: error ? 0.4 : 0.2,
              shadowRadius: 3,

              elevation: 4,
              backgroundColor: 'white',
            },
          ]}
          placeholderTextColor={palette.placeholder}
          onFocus={focus}
          ref={refCallback}
          onChangeText={onChange}
          value={value}
          keyboardType={numberPad ? 'number-pad' : 'default'}
          maxLength={maxLength}
          editable={editable}
          secureTextEntry={showPassword ? true : hidePassword && false}
          {...rest}
        />
      )}

      {props.low && (
        <Box flexDirection={'row'} justifyContent="space-between">
          <TextInput
            placeholder={isFocused ? props.place || '' : props.place}
            style={[
              styles.input,
              inputStyle,
              {
                paddingTop:
                  isFocused && !ios ? 10 : isFocused && ios ? 10 : ios ? 0 : 10,
                paddingLeft: isFocused && contact ? 52 : 15,
                borderColor: error ? palette.red : palette.inputBorder,
                width: '48%',
                // height: 50,
              },
            ]}
            placeholderTextColor={palette.placeholder}
            onBlur={handleFocus}
            onFocus={focus}
            onChangeText={onChangeHigh}
            value={props.Highvalue}
            keyboardType={numberPad ? 'number-pad' : 'default'}
            maxLength={maxLength}
            editable={editable}
            secureTextEntry={showPassword ? false : hidePassword}
            {...rest}
          />

          <TextInput
            placeholder={isFocused ? props.Lowplace || '' : props.Lowplace}
            style={[
              styles.input,
              inputStyle,
              {
                paddingTop:
                  isFocused && !ios ? 10 : isFocused && ios ? 10 : ios ? 0 : 10,
                paddingLeft: isFocused && contact ? 52 : 15,
                borderColor: error ? palette.red : palette.inputBorder,
                width: '48%',
                // height: 50,
              },
            ]}
            placeholderTextColor={palette.placeholder}
            // onBlur={handleFocus}
            onFocus={focus}
            onChangeText={onChangeLow}
            value={props.Lowvalue}
            keyboardType={numberPad ? 'number-pad' : 'default'}
            maxLength={maxLength}
            editable={editable}
            secureTextEntry={showPassword ? false : hidePassword}
            {...rest}
          />
        </Box>
      )}

      <Box style={styles.phoneEye}>
        {isFocused && contact ? (
          <TouchableBox
            flexDirection={'row'}
            alignItems={'center'}
            style={{marginLeft: wp(-2)}}
            onPress={handleCountryCode}>
            <Text style={[styles.phoneCode]}>{contryCode}</Text>
            <Box style={{top: -1, marginLeft: 2}}>
              {AntDesignIcon('down', wp(4), palette?.black)}
            </Box>
          </TouchableBox>
        ) : null}
      </Box>

      {changeCountryCode && (
        <TouchableBox
          onPress={handleChangeCountryCode}
          style={[
            TypographyStyles.cardShadow,
            {
              top: wp(-4),
              width: 45,
              height: 30,
              marginLeft: wp(1),
            },
          ]}
          backgroundColor={'white'}
          justifyContent={'center'}>
          <Text style={[styles.phoneCode, {marginLeft: wp(1.5)}]}>
            {contryCode == '+60' ? '+65' : '+60'}
          </Text>
        </TouchableBox>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {hidePassword && !pin ? (
        <Box style={styles.eye}>
          <TouchableBox onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={!showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={!showPassword ? palette.primary : palette.placeholder}
            />
          </TouchableBox>
        </Box>
      ) : null}

      {rightArrow ? (
        <Box style={styles.eye}>
          <FastImage
            source={Images?.LeftArrow}
            tintColor={palette?.blackshade}
            style={{
              height: wp(5),
              width: wp(5),
              transform: [
                {
                  rotate: '-90deg',
                },
              ],
            }}
            resizeMode={FastImage?.resizeMode?.contain}
          />
        </Box>
      ) : null}
      {showLoader !== undefined ? (
        <>
          {showLoader.show ? (
            <Box style={styles.eye}>
              {showLoader.showLoading ? (
                <ActivityIndicator />
              ) : showLoader.value ? (
                <AntDesign
                  name={'closecircleo'}
                  size={20}
                  color={palette.primary}
                />
              ) : (
                <Box>
                  <AntDesign
                    name={'checkcircleo'}
                    size={20}
                    color={palette.lightGreen}
                  />
                </Box>
              )}
            </Box>
          ) : null}
        </>
      ) : null}
    </Box>
  );
};
