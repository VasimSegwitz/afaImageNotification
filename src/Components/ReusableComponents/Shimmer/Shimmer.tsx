import React, {useMemo, useEffect} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const getOutputRange = (width, isReversed) =>
  isReversed ? [width, -width] : [-width, width];

const BasedShimmerPlaceholder = React.memo(props => {
  const {
    width = 200,
    height = 15,
    borderRadius = 5,
    shimmerColors = ['#ebebeb', '#c5c5c510', '#ebebeb'],
    location = [0.3, 0.5, 0.7],
    isReversed = false,
    stopAutoRun = false,
    visible = false,
    style,
    contentStyle,
    shimmerStyle,
    children,
    animatedValue,
    beginShimmerPosition,
    containerProps,
    shimmerContainerProps,
    childrenContainerProps,
  } = props;

  const linearTranslate = useMemo(
    () =>
      beginShimmerPosition.interpolate({
        inputRange: [-1, 1],
        outputRange: getOutputRange(width, isReversed),
      }),
    [beginShimmerPosition, width, isReversed],
  );

  useEffect(() => {
    if (!stopAutoRun && !visible) {
      animatedValue.start();
      return () => {
        animatedValue.stop();
      };
    }
  }, [stopAutoRun, visible, animatedValue]);

  return (
    <View
      style={[!visible && {height, width}, !visible && shimmerStyle, style]}
      {...containerProps}>
      <View
        style={[
          !visible && {width: 0, height: 0, opacity: 0},
          visible && contentStyle,
        ]}
        {...childrenContainerProps}>
        {children}
      </View>

      {!visible && (
        <View
          style={{
            backgroundColor: shimmerColors[0],
            borderRadius,
            ...styles.container,
          }}
          {...shimmerContainerProps}>
          <Animated.View
            style={{flex: 1, transform: [{translateX: linearTranslate}]}}>
            <LinearGradient
              colors={shimmerColors}
              style={{flex: 1, width: width / 1.1}}
              start={{
                x: -1,
                y: 0.5,
              }}
              end={{
                x: 2,
                y: 0.5,
              }}
              locations={location}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
});

const ShimmerPlaceholder = ({
  delay = 0,
  duration = 1000,
  isInteraction = true,
  ...otherProps
}) => {
  const beginShimmerPosition = useMemo(() => new Animated.Value(-1), []);
  const animatedValue = useMemo(() => {
    return Animated.loop(
      Animated.timing(beginShimmerPosition, {
        toValue: 1,
        delay,
        duration,
        useNativeDriver: true,
        isInteraction,
      }),
    );
  }, [beginShimmerPosition, delay, duration, isInteraction]);

  useEffect(() => {
    animatedValue.start();
    return () => {
      animatedValue.stop();
    };
  }, [animatedValue]);

  return (
    <BasedShimmerPlaceholder
      {...otherProps}
      animatedValue={animatedValue}
      beginShimmerPosition={beginShimmerPosition}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
});

export default ShimmerPlaceholder;
