import React, {useEffect, useRef} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {size} from '../../Theme/Index';
import checkmark from '../../../assets/lottie/Checkmark.json';
const Box = createBox();
const Text = createText();

export default props => {
  const {item, progress} = props;
  const checkMarkRef = useRef(null);

  useEffect(() => {
    if (progress) {
      checkMarkRef.current.play();
    } else {
      checkMarkRef.current.play(49, 73);
    }
  }, [progress]);

  return (
    <View style={{height: 30, width: 30}}>
      {/* <LottieView
        ref={checkMarkRef}
        source={checkmark}
        autoPlay={false}
        loop={false}
      /> */}
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
