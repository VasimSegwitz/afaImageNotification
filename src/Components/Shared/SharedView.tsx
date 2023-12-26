import React, {memo, useEffect, useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  SectionList,
  FlatList,
  Linking,
  Button,
} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
} from '../Theme/Index';
import Animated from 'react-native-reanimated';
const SharedView = ({navigation}) => {
  return (
    <Box flex={1} backgroundColor="white">
      <TouchableBox
        onPress={() => {
          navigation.goBack(null);
        }}
        mt="xl"
        height={50}
        width={50}
        backgroundColor={'primary1'}
      />
      <Box flex={1}>
        <Animated.View
          style={{width: 150, height: 150, backgroundColor: 'green'}}
          sharedTransitionTag="sharedTag"
        />
        <Button title="Screen2" onPress={() => navigation.navigate('Shared')} />
      </Box>
    </Box>
  );
};

export default SharedView;
