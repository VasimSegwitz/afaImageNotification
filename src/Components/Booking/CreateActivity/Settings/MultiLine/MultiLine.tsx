import React, {memo, useMemo} from 'react';
import {ScrollView, StyleSheet, TextInput} from 'react-native';
import theme, {
  Box,
  fonts,
  palette,
  Text,
  TouchableBox,
} from '../../../../Theme/Index';
const SearchI = require('../../../../../assets/Home/Search/Search.png');

import Carousel from 'react-native-reanimated-carousel';

import FastImage from 'react-native-fast-image';
import {wp} from '../../../../Helpers/responsive-ratio';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  Extrapolation,
  interpolate,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const MultiLine = ({navigation, route, value, onChangeText, placeholder}) => {
  const progress = useSharedValue(0);

  const onFocus = () => {
    progress.value = withTiming(1);
  };

  const onSubmitEditing = () => {
    progress.value = withTiming(0);
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
      height={104}
      borderRadius={10}
      flexDirection="row"
      alignItems="center"
      style={changeSelectionColor}>
      <TextInput
        multiline={true}
        placeholder={placeholder ? placeholder : 'Add more details '}
        //onSubmitEditing={onSubmitEditing}
        //onFocus={onFocus}
        value={value}
        onChangeText={onChangeText}
        style={styles.text}
        placeholderTextColor={palette.blackshade1}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  image: {
    marginLeft: 10,
    height: 22,
    width: 22,
  },
  text: {
    textAlignVertical: 'top',
    flex: 1,
    marginTop: 5,
    paddingLeft: 20,
    height: 104,
    alignSelf: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});

export default memo(MultiLine);
