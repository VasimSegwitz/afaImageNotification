import React, {memo, useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  size,
  TypographyStyles,
} from '../../../../Theme/Index';
const badminton = require('../../../../../assets/Home/badminton/badminton.png');
const Basketball = require('../../../../../assets/Booking/SearchVenues/Basketball/Basketball.png');
const Tennis = require('../../../../../assets/Booking/SearchVenues/Tennis/Tennis.png');
const Venues = require('../../../../../assets/Home/Categories/Venues.png');

import FastImage from 'react-native-fast-image';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';

const SelectSport = ({navigation, route}) => {
  const data = useMemo(
    () => [
      {
        id: 1,
        source: Basketball,
        name: 'Basketball',
      },
      {
        id: 2,
        source: Tennis,
        name: 'Tennis',
      },
      {
        id: 3,
        source: badminton,
        name: 'Hiking',
      },
    ],
    [],
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{flexGrow: 0, height: 45}}
        data={data}
        horizontal
        renderItem={({item, index}) => {
          const {source, name} = item;
          return (
            <Box
              justifyContent="center"
              alignItems="center"
              borderRadius={20}
              backgroundColor="white"
              style={TypographyStyles.cardShadow}
              borderWidth={index == 0 ? 1 : 0}
              borderColor="primary"
              // width={size.width / 2 - 40}
              mr="l"
              p="m"
              height={40}
              flexDirection="row">
              <FastImage
                source={source}
                style={{
                  height: 20,
                  width: 20,
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="m" variant="blackshade14400">
                {name}
              </Text>
            </Box>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  orangeDot: {
    backgroundColor: palette.primary,
    height: 8,
    borderRadius: 5,
    width: 20,
  },
  border: {
    width: 50,
    alignSelf: 'center',
    marginTop: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: palette.inputBorder,
  },
});

export default memo(SelectSport);
