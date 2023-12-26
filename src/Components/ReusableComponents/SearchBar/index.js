import React, {useState} from 'react';
import {TextInput, Image} from 'react-native';
// import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
// import BackSpace from '..';
import {AntDesignIcon, Back, BackSpace, feather, Ionicon} from '../Icons';
import Dropdown from '../../ReusableComponents/DropDown';

import {
  palette,
  Box,
  TouchableBox,
  TypographyStyles,
  Text,
  fonts,
} from '../../Theme/Index';
import {styles} from './styles';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  Extrapolation,
  interpolate,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {backgroundColor} from '@shopify/restyle';
import {ios} from '../../../utils';

const SearchBar = props => {
  const {
    placeholder,
    value,

    onChange,
    inputStyle,
    eyeStyle,
    searchIconn,
    searchStyle,
    onFilter = () => {},
    filter = false,
    primary = false,
    placeholderTextColor,
    renderRightComponent = () => {},
    editable,
    SetSignupCountryCode,
    signupCountryCode,
    contact,
    ...rest
  } = props;

  const progress = useSharedValue(0);

  const [isFocused, setIsFocused] = useState(false);

  const onFocus = () => {
    progress.value = withTiming(1);
    setIsFocused(false);

    SetSignupCountryCode && SetSignupCountryCode(contryCode);
  };

  const [changeCountryCode, setChangeCountryCode] = useState(false);

  const [contryCode, setCountryCode] = useState('+60');

  const onBlur = () => {
    progress.value = withTiming(0);
  };

  const onSubmitEditing = () => {
    progress.value = withTiming(0);
  };

  const handleCountryCode = () => setChangeCountryCode(!changeCountryCode);
  const handleChangeCountryCode = () => {
    setCountryCode(contryCode == '+60' ? '+65' : '+60');
    setChangeCountryCode(false);
  };

  const changeSelectionColor = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [palette.placeholder, palette.secondary],
    );

    const borderWidth = interpolate(progress.value, [0, 1], [1, 4], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      borderColor,
      borderWidth,
    };
  });

  return (
    <Animated.View
      // height={40}
      borderRadius={10}
      flexDirection="row"
      alignItems="center"
      backgroundColor="primary"
      style={changeSelectionColor}>
      <Box style={styles.eye}>
        <Image
          source={
            primary
              ? Images.Search
              : filter
              ? Images?.SearchPrimary
              : Images.Search
          }
          style={{height: wp(5), width: wp(5)}}
          resizeMode={'contain'}
        />
      </Box>
      {contact && (
        <Box width={wp(15)} style={styles.phoneEye}>
          <Dropdown
            sear={{
              backgroundColor: 'transparent',
              width: wp(15),
            }}
            texn={styles.phoneCodes}
            data={[
              {
                label: '+65',
                value: +65,
              },
              {
                label: '+60',
                value: +60,
              },
            ]}
            title={signupCountryCode}
            onSelect={data => SetSignupCountryCode(data?.value)}
          />
        </Box>
      )}

      {/* <Box style={styles.phoneEye}>
        {contact ? (
          <TouchableBox
            flexDirection={'row'}
            // width={wp(10)}
            alignItems={'center'}
            style={{marginLeft: wp(-2)}}
            onPress={handleCountryCode}>
            <Text style={[styles.phoneCodes]}>{contryCode}</Text>
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
              backgroundColor: 'white',

              // top: wp(-4),
              // width: 45,
              // height: 30,
              // paddingLeft: wp(0),
            },
          ]}
          backgroundColor={'white'}
          justifyContent={'center'}>
          <Text
            style={{
              // marginLeft: wp(-4),
              fontSize: 14,
              color: palette.black,
              fontWeight: '400',
              fontFamily: fonts.regular,
              position: 'absolute',
              top: 30,
              left: 2,
            }}>
            {contryCode == '+60' ? '+65' : '+60'}
          </Text>
        </TouchableBox>
      )} */}

      <TextInput
        placeholder={placeholder}
        style={[styles.input, inputStyle]}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : '#959595'
        }
        onChangeText={onChange}
        value={value}
        onSubmitEditing={onSubmitEditing}
        onFocus={props?.onFocus ? props?.onFocus : onFocus}
        onBlur={onBlur}
        clearButtonMode={filter ? 'never' : 'while-editing'}
        editable={editable ? false : true}
        {...rest}
      />
      {renderRightComponent()
        ? renderRightComponent()
        : filter && (
            <TouchableBox onPress={onFilter} style={styles.filter}>
              <Box>
                {
                  <Image
                    source={primary ? Images.OptionsGray : Images.Options}
                    style={{height: wp(5), width: wp(5)}}
                    resizeMode={'contain'}
                  />
                }
              </Box>
            </TouchableBox>
          )}
    </Animated.View>
  );
};

export default SearchBar;
