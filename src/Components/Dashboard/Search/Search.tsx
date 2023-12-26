import React, {memo, useMemo} from 'react';
import {ScrollView, StyleSheet, TextInput} from 'react-native';
import theme, {
  Box,
  fonts,
  palette,
  Text,
  TouchableBox,
} from '../../Theme/Index';
const SearchI = require('../../../assets/Home/Search/Search.png');
const Banner2 = require('../../../assets/Home/Banner/BannerAnimation2.png');
const Banner3 = require('../../../assets/Home/Banner/BannerAnimation3.png');
import Carousel from 'react-native-reanimated-carousel';
import {size} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  Extrapolation,
  interpolate,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ios} from '../../../utils';

const Search = ({navigation, route, value, onChangeText}) => {
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
      // height={0}
      backgroundColor="white"
      borderRadius={10}
      flexDirection="row"
      // justifyContent="center"
      alignItems="center"
      style={changeSelectionColor}>
      <FastImage
        source={SearchI}
        style={styles.image}
        resizeMode={FastImage?.resizeMode?.stretch}
      />
      <TextInput
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        value={value}
        onChangeText={onChangeText}
        style={styles.text}
        placeholderTextColor={palette.blackshade1}
        placeholder="What are you searching for ?"
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
    flex: 1,
    marginTop: ios ? 0 : 2,
    paddingRight: 40,
    paddingLeft: 10,
    marginBottom: ios ? 0 : -5,
    height: 40,
    alignItems: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});

export default memo(Search);
