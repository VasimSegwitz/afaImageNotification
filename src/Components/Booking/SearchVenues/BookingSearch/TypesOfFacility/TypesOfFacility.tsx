import React, {memo, useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, FlatList} from 'react-native';
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

const TypesOfFacility = ({navigation, route, TypeOfFacilityData, onSelect}) => {
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      style={{flexGrow: 0, height: 60}}
      data={TypeOfFacilityData}
      horizontal
      renderItem={({item, index}) => {
        const {source, name, flag} = item;
        return (
          <TouchableBox onPress={() => onSelect(item)}>
            { name && <Box
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
                shadowRadius: 2.60,
                elevation: 2,
              }}
              borderWidth={flag == true ? 1 : 0}
              borderColor="primary"
              mr="m"
              height={40}
              flexDirection="row">
              <Text marginHorizontal="l" variant="blackshade14400">
                {name}
              </Text>
            </Box>}
          </TouchableBox>
        );
      }}
    />
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

export default memo(TypesOfFacility);
