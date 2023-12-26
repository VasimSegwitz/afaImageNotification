import React, {memo, useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  size,
  TypographyStyles,
} from '../../../../../Theme/Index';
const badminton = require('../../../../../../assets/Home/badminton/badminton.png');
const Book = require('../../../../../../assets/Home/Categories/Book.png');
const Deals = require('../../../../../../assets/Home/Categories/Deals.png');
const Tennis = require('../../../../../../assets/Booking/SearchVenues/Tennis/Tennis.png');
const Swim = require('../../../../../../assets/Booking/SearchVenues/Swim/Swim.png');
import FastImage from 'react-native-fast-image';
import {FlatList} from 'react-native-gesture-handler';

const Categories = ({navigation, route}) => {
  const TypeOfSportsData = useMemo(
    () => [
      {
        id: 1,
        name: 'Basketball',
        selected: true,
        source: badminton,
      },
      {
        id: 2,
        name: 'Tennis',
        selected: false,
        source: Tennis,
      },
      {
        id: 3,
        name: 'Swim',
        selected: false,
        source: Swim,
      },
    ],
    [],
  );

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      style={{flexGrow: 0, height: 60}}
      data={TypeOfSportsData}
      horizontal
      renderItem={({item, index}) => {
        const {source, name} = item;
        return (
          <Box
            alignItems="center"
            borderRadius={20}
            backgroundColor="white"
            style={TypographyStyles.cardShadow}
            borderWidth={index == 0 ? 1 : 0}
            borderColor="primary"
            mr="l"
            height={40}
            flexDirection="row">
            <FastImage
              source={source}
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

export default memo(Categories);
