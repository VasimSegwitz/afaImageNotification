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
const Archery = require('../../../../assets/Booking/SelectSport/Archery/Archery.png');
const Badminton = require('../../../../assets/Booking/SelectSport/Badminton/Badminton.png');
const Basketball = require('../../../../assets/Booking/SelectSport/Basketball/Basketball.png');
const Dancing = require('../../../../assets/Booking/SelectSport/Dancing/Dancing.png');
const Dodgeball = require('../../../../assets/Booking/SelectSport/Dodgeball/Dodgeball.png');
const Football = require('../../../../assets/Booking/SelectSport/Football/Football.png');
const Footgolf = require('../../../../assets/Booking/SelectSport/Footgolf/Footgolf.png');
const Frisbee = require('../../../../assets/Booking/SelectSport/Frisbee/Frisbee.png');
const Futsal = require('../../../../assets/Booking/SelectSport/Futsal/Futsal.png');
const GoKart = require('../../../../assets/Booking/SelectSport/GoKart/GoKart.png');
const Handball = require('../../../../assets/Booking/SelectSport/Handball/Handball.png');
const Hockey = require('../../../../assets/Booking/SelectSport/Hockey/Hockey.png');
const Netball = require('../../../../assets/Booking/SelectSport/Netball/Netball.png');
const PickleBall = require('../../../../assets/Booking/SelectSport/PickleBall/PickleBall.png');
const Pingpong = require('../../../../assets/Booking/SelectSport/Pingpong/Pingpong.png');
const SepakTakraw = require('../../../../assets/Booking/SelectSport/SepakTakraw/SepakTakraw.png');
const Squash = require('../../../../assets/Booking/SelectSport/Squash/Squash.png');
const Swimming = require('../../../../assets/Booking/SelectSport/Swimming/Swimming.png');
const Tennis = require('../../../../assets/Booking/SelectSport/Tennis/Tennis.png');
const Volleyball = require('../../../../assets/Booking/SelectSport/Volleyball/Volleyball.png');
const data = [
  {
    id: 1,
    title: 'Popular',
    data: [
      {
        id: 1,
        list: [
          {
            id: 1,
            source: Badminton,
            name: 'Badminton',
          },
          {
            id: 2,
            source: Futsal,
            name: 'Futsal',
          },
          {
            id: 3,
            source: Football,
            name: 'Football',
          },
          {
            id: 4,
            source: Tennis,
            name: 'Tennis',
          },
          {
            id: 5,
            source: Basketball,
            name: 'Basketball',
          },
          {
            id: 6,
            source: Volleyball,
            name: 'Volleyball',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Racquet',
    data: [
      {
        id: 2,
        list: [
          {
            id: 1,
            source: Badminton,
            name: 'Badminton',
          },
          {
            id: 2,
            source: Tennis,
            name: 'Tennis',
          },
          {
            id: 3,
            source: Pingpong,
            name: 'Pingpong',
          },
          {
            id: 4,
            source: Squash,
            name: 'Squash',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Racquet',
    data: [
      {
        id: '3',
        list: [
          {
            id: 1,
            source: Badminton,
            name: 'Badminton',
          },
          {
            id: 2,
            source: Tennis,
            name: 'Tennis',
          },
          {
            id: 3,
            source: Pingpong,
            name: 'Pingpong',
          },
          {
            id: 4,
            source: Squash,
            name: 'Squash',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Team',
    data: [
      {
        id: 4,
        list: [
          {
            id: 1,
            source: Frisbee,
            name: 'Frisbee',
          },
          {
            id: 2,
            source: Futsal,
            name: 'Futsal',
          },
          {
            id: 3,
            source: Football,
            name: 'Football',
          },
          {
            id: 4,
            source: Dodgeball,
            name: 'Dodgeball',
          },
          {
            id: 5,
            source: Handball,
            name: 'Handball',
          },
          {
            id: 6,
            source: Basketball,
            name: 'Basketball',
          },
          {
            id: 7,
            source: Volleyball,
            name: 'Volleyball',
          },
          {
            id: 8,
            source: Hockey,
            name: 'Hockey',
          },
          {
            id: 9,
            source: SepakTakraw,
            name: 'Sepak Takraw',
          },
          {
            id: 10,
            source: Netball,
            name: 'Netball',
          },
          {
            id: 11,
            source: Volleyball,
            name: 'Captain ball',
          },
          {
            id: 12,
            source: PickleBall,
            name: 'Pickle ball',
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Recreation',
    data: [
      {
        id: 2,
        list: [
          {
            id: 1,
            source: Footgolf,
            name: 'Footgolf',
          },
          {
            id: 2,
            source: Dancing,
            name: 'Dancing',
          },
          {
            id: 3,
            source: GoKart,
            name: 'Go-Kart',
          },
          {
            id: 4,
            source: Archery,
            name: 'Archery',
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Fitness',
    data: [
      {
        id: 2,
        list: [
          {
            id: 1,
            source: Swimming,
            name: 'Swimming',
          },
        ],
      },
    ],
  },
];

import {size} from '../../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';

import Search from './Search/Search';

const SelectSport = ({navigation, route, TypeOfSportsData}) => {
  return (
    <Box flex={1} backgroundColor="white">
      <Header navigation={navigation} left title="Select Your Sport" />
      <Box flex={1}>
        <Box marginHorizontal="l">
          <Search />
        </Box>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SectionList
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{marginTop: 30}}
            sections={data}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}, index) => {
              const {list} = item;
              return (
                <FlatList
                  data={list}
                  numColumns={3}
                  renderItem={({item}) => {
                    const {name, source} = item;
                    return (
                      <Box
                        height={58}
                        alignItems="center"
                        width={size.width / 3 - 10}
                        justifyContent="center">
                        <FastImage
                          source={source}
                          style={{
                            height: wp(5),
                            width: wp(5),
                          }}
                          resizeMode={FastImage?.resizeMode?.contain}
                        />
                        <Text variant="blackshade14800">{name}</Text>
                      </Box>
                    );
                  }}
                />
              );
            }}
            renderSectionHeader={({section: {title}}) => (
              <Box marginHorizontal="l">
                <Text variant="blackshade18800Medium" marginVertical="m">
                  {title}
                </Text>
              </Box>
            )}
          />
          <Box flexDirection="row" mt="m" mb="l">
            <Box flex={1} height={46} marginHorizontal="s">
              <Button label="Done" />
            </Box>
            <TouchableBox
              marginHorizontal="s"
              flex={1}
              backgroundColor="white"
              height={46}
              borderWidth={1}
              borderColor="primary"
              justifyContent="center"
              alignItems="center"
              borderRadius={10}>
              <Text variant="blackshade14800">Clear</Text>
            </TouchableBox>
          </Box>
        </ScrollView>
      </Box>
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

export default SelectSport;
