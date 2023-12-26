import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Image, View} from 'react-native';
import theme, {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../Helpers/responsive-ratio';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../Constant/Image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
const vWidth = 283;
const vHeight = 1;
const width = size.width;
const height = (width * vHeight) / vWidth;

import {activeLevel} from '../Services/RewardsApi';
import {LoadingOverlay} from '../ReusableComponents';

const HEADER_HEIGHT = 200;

const DATA = [
  {
    id: 1,
    name: 'Active',
    selected: false,
    number: 3,
  },
  {
    id: 2,
    name: 'Used',
    selected: false,
    number: 8,
  },
  {
    id: 3,
    name: 'expired',
    selected: false,
    number: 10,
  },
];

export const makeLevel = val => {
  let newLevel = 'Warming up';
  let nextLevel = 'Active';
  let activities = 0;
  if (val <= 50) {
    newLevel = 'Warming up';
    nextLevel = 'Active';
    activities = 50 - val;
  } else if (val >= 50 && val <= 100) {
    newLevel = 'Active';
    nextLevel = 'Super Active';
    activities = 100 - val;
  } else if (val >= 100 && val <= 150) {
    newLevel = 'Super active';
    nextLevel = 'on Fire';
    activities = 150 - val;
  } else if (val >= 150 && val <= 200) {
    newLevel = 'On Fire';
    nextLevel = 'On Fire';
    activities = 200 - val;
  }
  return {newLevel, nextLevel, activities};
};

const MyPoints = ({navigation, route}) => {
  const progress = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState([]);
  const [count, setCount] = useState(0);
  const [nextLevel, setNextLevel] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('Warming up');
  const [fromLeft, setFromLeft] = useState('Warming up');
  const [activities, setActivities] = useState(0);
  const {user} = useSelector(state => state?.auth?.user);

  const [list, showList] = useState(DATA);

  useEffect(() => {
    getMyVouchersInfo();
  }, []);

  const getMyVouchersInfo = () => {
    setLoading(true);
    activeLevel()
      .then(response => {
        if (response?.success == 1) {
          const {data} = response;
          const {count} = data;
          setCount(count);
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const level = makeLevel(count);
    setNextLevel(level.nextLevel);
    setActivities(level.activities);
    setCurrentLevel(level.newLevel);
    setLoading(false);
  }, [count]);

  return (
    <Box flex={1}>
      <Box
        style={[
          {
            width: '100%',
            height: HEADER_HEIGHT,
          },
        ]}>
        <FastImage
          source={Images?.MyPoints}
          style={styles.headerImage}
          resizeMode={FastImage?.resizeMode?.stretch}
        />
        <Box zIndex={100} position="absolute" top={40} left={wp(1)}>
          <Box flexDirection="row" alignItems="center">
            <TouchableBox
              style={{
                padding: 10,
              }}
              onPress={() => {
                navigation.goBack(null);
              }}>
              <Image
                source={Images?.LeftArrow}
                style={{
                  tintColor: 'white',
                  height: 20,
                  width: 20,
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </TouchableBox>
            <Box>
              <Text variant="white16500">My Points</Text>
            </Box>
          </Box>
        </Box>
        <Box position="absolute" right={0} left={20} bottom={30}>
          <Box flexDirection="row">
            <Text variant="white36700">{user?.data?.total_loyalty_points}</Text>
            <Text mt="m" variant="white18500Medium">
              {' '}
              points
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center">
            <FastImage
              source={Images?.Flash}
              style={{
                height: wp(4),
                width: wp(4),
              }}
            />
            <Text ml="s" variant="white14400">
              {currentLevel}
            </Text>
          </Box>
        </Box>
      </Box>
      <ScrollView style={{flexGrow: 1, backgroundColor: 'white'}}>
        <Box flex={1} mt="xl">
          <Box flexDirection="row" marginHorizontal="s" mt="m">
            <TouchableBox
              onPress={() => {
                navigation.navigate('EarnPoints', {currentLevel});
              }}
              height={112}
              flex={1}
              m="s"
              borderColor="primary"
              borderWidth={1}
              borderRadius={15}
              flexDirection="row">
              <Box flex={1} justifyContent="center" ml="l">
                <FastImage
                  source={Images?.Earn}
                  style={{
                    height: wp(7),
                    width: wp(7),
                  }}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                <Text mt="m" variant="blackshade16800Semi">
                  Earn
                </Text>
              </Box>
              <Box flex={0.5} justifyContent="center" alignItems="center">
                <FastImage
                  source={Images?.LeftArrow}
                  tintColor={palette?.primary}
                  style={{
                    height: wp(7),
                    width: wp(10),
                    transform: [
                      {
                        rotate: '180deg',
                      },
                    ],
                  }}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
              </Box>
            </TouchableBox>
            <TouchableBox
              onPress={() => {
                navigation.navigate('Redeem', {currentLevel});
              }}
              height={112}
              flex={1}
              m="s"
              borderColor="primary"
              borderWidth={1}
              borderRadius={15}
              flexDirection="row">
              <Box flex={1} justifyContent="center" ml="l">
                <FastImage
                  source={Images?.Gift}
                  style={{
                    height: wp(7),
                    width: wp(7),
                  }}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                <Text mt="m" variant="blackshade16800Semi">
                  My Rewards
                </Text>
              </Box>
              <Box flex={0.5} justifyContent="center" alignItems="center">
                <FastImage
                  source={Images?.LeftArrow}
                  tintColor={palette?.primary}
                  style={{
                    height: wp(7),
                    width: wp(10),
                    transform: [
                      {
                        rotate: '180deg',
                      },
                    ],
                  }}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
              </Box>
            </TouchableBox>
          </Box>
          <Box
            opacity={0.4}
            mt="l"
            borderWidth={1}
            height={220}
            marginHorizontal="m"
            borderRadius={25}
            borderColor="primary">
            <Box
              justifyContent="space-between"
              flexDirection="row"
              mt="l"
              marginHorizontal="l">
              <Text variant="primary16500">Refer your friends</Text>
              <FastImage
                source={Images?.LeftArrow}
                tintColor={palette?.primary}
                style={{
                  height: wp(6),
                  width: wp(6),
                  transform: [
                    {
                      rotate: '180deg',
                    },
                  ],
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </Box>
            <Box flex={1} mt="m" marginHorizontal="l">
              <Text variant="blackshade14800">
                For each successful referral:
              </Text>
              <Box flexDirection="row" alignItems="center">
                <Text variant="primary14500">•</Text>
                <Text variant="blackshade114800">You get</Text>
                <Text ml="s" variant="blackshade14800">
                  10 points + RM5 in your AFA Wallet
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <Text variant="primary14500">•</Text>
                <Text variant="blackshade114800">They get</Text>
                <Text ml="s" variant="blackshade14800">
                  RM5 in their AFA Wallet
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <Box
                  style={{
                    marginTop: 10,
                    width: size.width / 2,
                    height: 35,
                    borderWidth: 1,
                    borderColor: palette?.primary,
                    borderRadius: 1,
                    borderStyle: 'dashed',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                  }}>
                  <Text variant="primary14500">KCDIF219</Text>
                  <Text variant="blackshade114500">Copy</Text>
                </Box>
                <Box
                  ml="l"
                  borderRadius={5}
                  marginTop="s"
                  backgroundColor="blackshade"
                  height={25}
                  justifyContent="center"
                  alignItems="center">
                  <Text variant="white12Medium" marginHorizontal="m">
                    Share now
                  </Text>
                </Box>
              </Box>
              <Box mt="m">
                <Text variant="blackshade14400">
                  You have referred 3 friends
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>
      {loading ? <LoadingOverlay /> : null}
    </Box>
  );
};

const styles = StyleSheet.create({
  points: {
    height: wp(5),
    width: wp(5),
  },
  dashed: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: palette?.primary,
  },
  boxx: {
    height: wp(24),
    width: wp(24),
  },
  content: {flexGrow: 1},
  headerImage: {
    height: wp(51),
    width: wp(100),
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 1,
  },
});

export default MyPoints;
