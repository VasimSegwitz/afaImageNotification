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
const Shared = ({navigation}) => {
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
      <Box style={{flex: 1, justifyContent: 'flex-end'}}>
        <Button
          title="Screen1"
          onPress={() => navigation.navigate('SharedView')}
        />
        <Animated.View
          style={{width: 100, height: 100, backgroundColor: 'green'}}
          sharedTransitionTag="sharedTag"
        />
      </Box>
    </Box>
  );
};

export default Shared;
