import React, {useEffect, useRef} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import {palette, size} from '../../Theme/Index';
import checkmark from '../../../assets/lottie/Checkmark.json';
import Svg, {G, Circle} from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const Box = createBox();
const Text = createText();

export default ({
  radius = 15,
  strokeWidth = 2,
  color = palette.tertiary2,
  progress,
  reverse,
}) => {
  const ripple = useSharedValue(0);
  const ripple1 = useSharedValue(0);
  const circumference = 2 * Math.PI * radius;
  const circleCircumference = useSharedValue(0);
  const halfCircle = radius + strokeWidth;

  useEffect(() => {
    if (progress) {
      circleCircumference.value = withTiming(
        1,
        {
          duration: 1500,
          easing: Easing.linear,
        },
        () => {
          ripple.value = withRepeat(
            withTiming(1, {duration: 2000, easing: Easing.linear}),
            2000,
            false,
          );
        },
      );
    }
    // reverse will reverse the circle progress
  }, [progress]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{scale: ripple.value}],
      opacity: 0.9 - ripple.value,
    };
  });
  const style1 = useAnimatedStyle(() => {
    return {
      transform: [{scale: ripple.value}],
      opacity: 0.3 - ripple1.value,
    };
  });
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * circleCircumference.value,
    };
  });

  return (
    <View style={{height: 30, width: 30}}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation={`180`} origin={`${halfCircle} ,${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={progress ? '#DCDCDC' : color}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity={0.2}
          />
          <AnimatedCircle
            cx="50%"
            cy="50%"
            stroke={progress ? color : '#DCDCDC'}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
      <Animated.View
        style={[
          style,
          {
            position: 'absolute',
            height: progress ? 30 : 16,
            width: progress ? 30 : 16,
            borderRadius: progress ? 15 : 16 / 2,
            top: progress ? 0 : 7,
            left: progress ? 0 : 7,
            alignSelf: 'center',
            backgroundColor: progress ? color : '#DCDCDC',
          },
        ]}
      />
      <Animated.View
        style={[
          style1,
          {
            position: 'absolute',
            height: 20,
            width: 20,
            borderRadius: 20 / 2,
            top: 5,
            left: 5,
            alignSelf: 'center',
            backgroundColor: 'white',
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
