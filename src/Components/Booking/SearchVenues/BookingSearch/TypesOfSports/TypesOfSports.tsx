import React, {memo, useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../../Theme/Index';
const badminton = require('../../../../../assets/Home/badminton/badminton.png');
const Book = require('../../../../../assets/Home/Categories/Book.png');
const Deals = require('../../../../../assets/Home/Categories/Deals.png');
const Tennis = require('../../../../assets/Booking/SearchVenues/Tennis/Tennis.png');
import Carousel from 'react-native-reanimated-carousel';
import {size} from '../../../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../../Helpers/responsive-ratio';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

import {FlatList} from 'react-native-gesture-handler';
import {Images} from '../../../../../Constant/Image';

const Categories = ({navigation, route, TypeOfSportsData, onSelect}) => {
  return TypeOfSportsData?.length > 1 ? (
    <FlatList
      showsHorizontalScrollIndicator={false}
      style={{flexGrow: 0, height: 60}}
      data={TypeOfSportsData}
      horizontal
      renderItem={({item, index}) => {
        const {flag} = item;
        const {images, name} = item?.category;

        // if (item?.parent_id) return null;
        // else
        return (
          <TouchableBox onPress={() => onSelect(item)}>
            <Box
              alignItems="center"
              borderRadius={20}
              backgroundColor="white"
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.6,
                elevation: 2,
              }}
              borderWidth={flag == true ? 1 : 0}
              borderColor="primary"
              mr="l"
              height={40}
              flexDirection="row">
              <FastImage
                source={images.length > 0 ? {uri: images[0]} : Images.Tennis}
                style={{
                  marginLeft: 10,
                  height: 20,
                  width: 20,
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text marginHorizontal="l" variant="blackshade14800">
                {name}
              </Text>
            </Box>
          </TouchableBox>
        );
      }}
    />
  ) : null;
  // <Text variant="blackshade16500" mb={'l'}>
  //   No Favourite Sports
  // </Text>
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
