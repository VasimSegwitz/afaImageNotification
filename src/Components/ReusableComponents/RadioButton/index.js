import React from 'react';
import {memo} from 'react';

import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Box, fonts, palette} from '../../Theme/Index';
const CHECK = require('../../../assets/Radio/Icon1.png');
const NOCHECK = require('../../../assets/Radio/Icon.png');
const {width, height} = Dimensions.get('window');

const RadioButton = ({
  selected,
  onPress,
  style,
  textStyle,
  size = 20,
  text = '',
  radio = false,
  subnameStyle,
  subname,
  capital = 'capitalize',
  unanswered = false,
  ...props
}) => (
  <TouchableOpacity
    style={styles.style(subname ? true : false)}
    onPress={onPress}
    {...props}>
    {radio ? (
      <Image
        source={selected ? Images?.RadioCheck : Images?.RadioUnCheck}
        style={{
          height: wp(6),
          width: wp(6),
        }}
        resizeMode="contain"
      />
    ) : (
      <Image
        source={selected ? Images.CheckmarkCheck : Images.CheckmarkUncheck}
        style={{
          height: wp(6),
          width: wp(6),
        }}
        resizeMode="contain"
      />
    )}
    <Box ml="s" justifyContent="flex-start" width={unanswered ? 'auto' : '90%'}>
      <Text
        style={[styles.optionText, textStyle, {textTransform: capital}]}
        numberOfLines={2}>
        {text}{' '}
      </Text>
      {subname && (
        <Text style={[styles.optionText, subnameStyle]} numberOfLines={2}>
          {subname}{' '}
        </Text>
      )}
    </Box>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  style: flag => ({
    flexDirection: 'row',
    // width: width / 3,
    // flex: 1,
    // justifyContent: 'flex-start',
    alignItems: flag ? 'flex-start' : 'center',
  }),
  optionText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    // textTransform: capital,
    color: palette.black,
    marginLeft: 5,
    marginTop: -2,
  },
});

export default memo(RadioButton);
