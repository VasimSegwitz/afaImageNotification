import React, {memo, useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
const badminton = require('../../../assets/Home/badminton/badminton.png');
const Book = require('../../../assets/Home/Categories/Book.png');
const Deals = require('../../../assets/Home/Categories/Deals.png');
const Venues = require('../../../assets/Home/Categories/Venues.png');
import Carousel from 'react-native-reanimated-carousel';
import {size} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';

const Categories = ({navigation, route}) => {
  const data = useMemo(
    () => [
      {
        id: 1,
        source: badminton,
        name: 'Book',
      },
      {
        id: 2,
        source: badminton,
        name: 'Activities',
      },
      {
        id: 3,
        source: badminton,
        name: 'Venues',
      },
      {
        id: 4,
        source: badminton,
        name: 'Deals',
      },
      {
        id: 5,
        source: badminton,
        name: 'Activities',
      },
      {
        id: 6,
        source: badminton,
        name: 'Venues',
      },
      {
        id: 7,
        source: badminton,
        name: 'Deals',
      },
    ],
    [],
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{flexGrow: 0, height: 60}}
        data={data}
        horizontal
        renderItem={({item, index}) => {
          const {source, name} = item;
          return (
            <Box
              justifyContent="space-around"
              alignItems="center"
              borderRadius={20}
              backgroundColor="white"
              style={TypographyStyles.cardShadow}
              borderWidth={index == 0 ? 1 : 0}
              borderColor="primary"
              width={size.width / 2 - 40}
              mr="l"
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
              <Text variant="blackshade14800">{name}</Text>
              <Text variant="blackshade14800">{index}</Text>
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

export default memo(Categories);
