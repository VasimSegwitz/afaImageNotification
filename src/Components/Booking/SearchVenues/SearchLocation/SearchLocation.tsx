import React, {memo, useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, SectionList, FlatList} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import {Button, Header} from '../../../ReusableComponents/index';
const CurrentLocation = require('../../../../assets/Booking/SearchVenues/CurrentLocation/CurrentLocation.png');
const LeftArrow = require('../../../../assets/Booking/SearchVenues/LeftArrow/LeftArrow.png');

const DATA = [
  {
    id: 1,
    name: 'Wangsa Maju',
  },
  {
    id: 2,
    name: 'Danau Kota Badminton Court',
  },
  {
    id: 3,
    name: 'Sri Rampai',
  },
];

import {size} from '../../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';

import Search from './Search/Search';
import {SafeAreaView} from 'react-native-safe-area-context';

const SearchLocation = ({navigation, route, TypeOfSportsData}) => {
  return (
    <Box flex={1} backgroundColor="white">
      <SafeAreaView style={{flexGrow: 1}}>
        <Box flexGrow={1}>
          <Box
            marginHorizontal="l"
            flexDirection="row"
            alignItems="center"
            mt="l">
            <TouchableBox
              onPress={() => {
                navigation.goBack(null);
              }}>
              <FastImage
                source={LeftArrow}
                style={{
                  height: 20,
                  width: 20,
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </TouchableBox>
            <Box flex={1} ml="l">
              <Search />
            </Box>
          </Box>
          <Box flexDirection="row" marginHorizontal="l" mt="l">
            <FastImage
              source={CurrentLocation}
              style={{
                height: 20,
                width: 20,
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Box>
              <Text
                textDecorationLine="underline"
                variant="blackshade16800Regular"
                ml="m">
                Use current location
              </Text>
            </Box>
          </Box>
          <Box
            mt="m"
            flexDirection="row"
            marginHorizontal="l"
            justifyContent="space-between">
            <Text variant="blackshade16800">RECENT SEARCHES</Text>
            <Text variant="primary14500">Clear</Text>
          </Box>
          <Box mt="l">
            <FlatList
              ItemSeparatorComponent={() => {
                return (
                  <Box
                    backgroundColor="tertiary2"
                    marginHorizontal="l"
                    height={2}
                    marginVertical="m"
                  />
                );
              }}
              data={DATA}
              renderItem={({item}) => {
                const {name} = item;
                return (
                  <Box marginHorizontal="l">
                    <Text variant="blackshade14800">{name}</Text>
                  </Box>
                );
              }}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
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

export default SearchLocation;
