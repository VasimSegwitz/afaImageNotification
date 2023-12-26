import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {palette, size} from '../../Theme/Index';
import checkmark from '../../../assets/lottie/Checkmark.json';
const Box = createBox();
const Text = createText();

export default props => {
  const {item, progress, reverse} = props;
  const Progress = useSharedValue(0);

  useEffect(() => {
    if (progress) {
      Progress.value = withTiming(size.width / 3, {duration: 2000});
    } else {
      Progress.value = withTiming(0, {duration: 2000});
    }
    // reverse will mode the value from 1 - 0
  }, [progress]);

  const style = useAnimatedStyle(() => {
    return {
      width: Progress.value,
    };
  });
  return (
    <View
      style={{height: 2, width: size.width / 3, backgroundColor: '#DDDDDD'}}>
      <Animated.View
        style={[
          style,
          {
            ...StyleSheet.absoluteFillObject,
            height: 2,
            backgroundColor: palette.tertiary2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignSelf: 'center',
    height: 137,
    width: size.width - 40,
  },
});
