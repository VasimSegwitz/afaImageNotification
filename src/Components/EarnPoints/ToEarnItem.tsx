import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import theme, {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../Helpers/responsive-ratio';
import {Images} from '../../Constant/Image';

export const returnType = val => {
  let newVal = '';
  switch (parseInt(val)) {
    case 1:
      newVal = 'WALLET';
      break;
    case 2:
      newVal = 'BOOKING';
      break;
    case 3:
      newVal = 'ACTIVITY';
      break;
    case 4:
      newVal = 'FRIEND';
      break;
    case 5:
      newVal = 'OTHERS';
      break;
    default:
    // code block
  }
  return newVal;
};

const EarnedItem = ({navigation, item, route}) => {
  const {type, title, earning_type, earning_value, is_earned} = item;
  return (
    <TouchableBox
      onPress={() => {
        if (!is_earned) {
          navigation.navigate('ToEarnDetails', {item});
        }
      }}
      style={{marginLeft: 12, opacity: is_earned ? 0.5 : 1}}
      minHeight={152}
      width={size.width / 2 - 20}
      borderRadius={15}
      borderWidth={1}
      borderColor="primary"
      mb="m">
      <Box flex={1}>
        <Box flex={1} marginHorizontal="l" mt="l">
          <FastImage
            source={Images?.Booking}
            style={{
              height: wp(5),
              width: wp(5),
            }}
          />
          <Text variant="blackshade112500" mt="m">
            {returnType(type)}
          </Text>
          <Text mt="m" variant="blackshade14500">
            {title}
          </Text>
          <Box flex={1} justifyContent="flex-end">
            <Box
              marginVertical="m"
              width={size?.width / 3}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Box flexDirection="row" alignItems="center">
                <FastImage
                  tintColor={palette?.blackshade1}
                  source={Images?.Flash}
                  style={{
                    height: wp(4),
                    width: wp(4),
                  }}
                />
                <Text variant="tertiary412400">
                  {earning_type === 1
                    ? `${earning_value} points`
                    : `RM1 = ${earning_value} points`}
                </Text>
              </Box>
              <FastImage
                source={Images?.LeftArrow}
                tintColor={palette?.primary}
                style={{
                  marginLeft: 10,
                  height: wp(5),
                  width: wp(5),
                  transform: [
                    {
                      rotate: '180deg',
                    },
                  ],
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </TouchableBox>
  );
};

const styles = StyleSheet.create({
  points: {
    height: wp(5),
    width: wp(5),
  },
  dashed: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: palette?.primary,
  },
  boxx: {
    height: wp(22),
    width: wp(22),
  },
  content: {flexGrow: 1},
  headerImage: {
    height: wp(51),
    width: wp(100),
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 1,
  },
});

export default EarnedItem;
