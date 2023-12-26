import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import theme, {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {Images} from '../../../Constant/Image';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const VoucherSelectionItem = ({navigation, route, item, selection}) => {
  const progress = useSharedValue(0);
  const {name, selected, id, number} = item;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        selection(id);
      }}
      style={{
        height: 50,
        marginLeft: 10,
        marginTop: 10,
      }}>
      <Box
        style={[
          styles.cardShadow,
          {
            borderColor: selected ? palette?.primary : 'white',
            borderWidth: selected ? 1 : 0,
            backgroundColor: 'white',
            alignItems: 'center',
            flexDirection: 'row',
            height: 40,
            marginRight: 10,
            borderRadius: 30,
            justifyContent: 'space-between',
          },
        ]}>
        <Text marginHorizontal="m" variant="blackshade14500">
          {name}
        </Text>
        <Box
          style={[
            {
              backgroundColor: selected ? 'white' : palette?.primary2,
              marginRight: 10,
              height: 25,
              width: 25,
              borderRadius: 25 / 2,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Text variant="blackshade14500">{number}</Text>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
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

export default VoucherSelectionItem;
