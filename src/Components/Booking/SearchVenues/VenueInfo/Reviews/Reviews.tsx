import React, {memo, useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, SectionList, FlatList} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
} from '../../../../Theme/Index';
import {Button, Header} from '../../../../ReusableComponents/index';

import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';
const Star = require('../../../../../assets/Home/Star/Star.png');
const UnselectedStar = require('../../../../../assets/Home/UnselectedStar/UnselectedStar.png');
import {SafeAreaView} from 'react-native-safe-area-context';
import Stars from 'react-native-stars';
const User = require('../../../../../assets/Home/User/User.png');
const DATA = [
  {
    id: 1,
    name: 'Christopher Chan',
    date: '23 Aug, 2022',
    stars: 5,
    source: User,
    review:
      'Absolutely KILLER court! Smashed one with the boys last weekend and loved it. Got real sweaty and scored good. Reminds me of the courts back home in ‘Straya! ',
  },
  {
    id: 2,
    name: 'Kailee Chew',
    date: '23 Aug, 2022',
    stars: 3,
    source: User,
    review:
      'Ok la... didn think too much of it. Nice court. Toilet is clean but could be better. Convenient.',
  },
  {
    id: 3,
    name: 'Amira Husnah',
    date: '23 Aug, 2022',
    stars: 5,
    source: User,
    review:
      'Very fun for the family! I brought my two children along and they enjoyed playing badminton with their friends while I had a match with my friends. Would recommend.',
  },
  {
    id: 4,
    name: 'Jamal Sabri Awang',
    date: '23 Aug, 2022',
    stars: 1,
    source: User,
    review:
      'Horrible experience. There was a puddle in the court and my new Yeezy got dirty. Hah... who is going to replace that?! Not coming back.',
  },
  {
    id: 5,
    name: 'Sunil Kumar',
    date: '23 Aug, 2022',
    stars: 4,
    source: User,
    review: '',
  },
];

const Reviews = ({navigation, route, TypeOfSportsData}) => {
  const {vanue} = route?.params;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Box flex={1}>
        <Box
          marginHorizontal="l"
          mt="l"
          flexDirection="row"
          alignItems="center">
          <Text variant="black36800">4.8</Text>
          <Box ml="m">
            <Box flexDirection="row">
              <Stars
                display={4}
                spacing={2}
                count={5}
                starSize={15}
                fullStar={Star}
                emptyStar={UnselectedStar}
              />
            </Box>
            <Box flexDirection="row" justifyContent="center">
              <Text variant="primary14500">29 reviews</Text>
              <Box
                mt="s"
                height={15}
                width={2}
                backgroundColor="blackshade1"
                marginHorizontal="s"
              />
              <Text variant="blackshade114500">300+ booked</Text>
            </Box>
          </Box>
        </Box>
        <FlatList
          data={DATA}
          renderItem={({item}) => {
            const {source, name, date, stars, review} = item;
            return (
              <Box mt="l">
                <Box flexDirection="row">
                  <FastImage
                    source={source}
                    style={{
                      marginLeft: 10,
                      height: 48,
                      width: 48,
                    }}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Box ml="m" mt="s">
                    <Text variant="blackshade14800">{name}</Text>
                    <Text variant="placeholder12400">{date}</Text>
                  </Box>
                </Box>
                <Box marginHorizontal="m" mt="m" flexDirection="row">
                  <Stars
                    display={stars}
                    spacing={2}
                    count={5}
                    starSize={15}
                    fullStar={Star}
                    emptyStar={UnselectedStar}
                  />
                  <Box />
                </Box>
                <Box marginHorizontal="m" mt="m">
                  <Text variant="blackshade14800">{review}</Text>
                </Box>
              </Box>
            );
          }}
        />
        <Box mb="l">
          <Box marginHorizontal="m" height={46}>
            <Button
              label="Book Now"
              onPress={() => {
                navigation.navigate('CheckAvailability', {
                  from: 'Reviews',
                  vanue,
                });
              }}
            />
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1, backgroundColor: 'white'},
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

export default Reviews;
