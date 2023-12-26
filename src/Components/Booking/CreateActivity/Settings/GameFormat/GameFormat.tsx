import React, {memo, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  size,
  TypographyStyles,
  TouchableBox,
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

const GameFormat = ({navigation, route, setGame}) => {
  const data = useMemo(
    () => [
      {
        id: 1,
        selected: false,
        name: '3-a-side',
      },
      {
        id: 2,
        selected: false,
        name: '4-a-side',
      },
      {
        id: 3,
        selected: false,
        name: '5-a-side',
      },
    ],
    [],
  );

  const [game, setGames] = useState(data);

  const onSelectGame = games => {
    const temp = game?.map(item => {
      return {
        ...item,
        selected: games?.id == item?.id ? true : false,
      };
    });

    setGames(temp);
    setGame(games);
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{flexGrow: 0, height: 45}}
        data={game}
        horizontal
        renderItem={({item, index}) => {
          const {source, name, selected} = item;
          return (
            <TouchableBox onPress={() => onSelectGame(item)}>
              <Box
                justifyContent="center"
                alignItems="center"
                borderRadius={20}
                backgroundColor="white"
                style={TypographyStyles.cardShadow}
                borderWidth={selected ? 1 : 0}
                borderColor={'primary'}
                width={size.width / 3 - 40}
                mr="l"
                height={40}
                flexDirection="row">
                <Text variant="blackshade14800">{name}</Text>
              </Box>
            </TouchableBox>
          );
        }}
      />
    </View>
  );
};

export default memo(GameFormat);
