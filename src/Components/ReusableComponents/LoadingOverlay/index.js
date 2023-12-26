import React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet} from 'react-native';
import {Box, palette, Text} from '../../Theme/Index';

const LoadingOverlay = ({color, containerStyle = {}, text, size}) => {
  return (
    <Box style={[styles.loadingContainer, containerStyle]}>
      <ActivityIndicator
        color={color || palette.primary}
        size={size || 'large'}
      />
      <Text variant="primary12Regular" mt="s">
        {text || 'loading'}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    // flex: 1,
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.overlay,
    height: '100%',
    width: '100%',
    zIndex: 9999,
  },
});

export default LoadingOverlay;
