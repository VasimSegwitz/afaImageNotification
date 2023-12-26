import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Image, View} from 'react-native';
import theme, {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
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

import {activeLevel} from '../../Services/RewardsApi';
import {Header, LoadingOverlay} from '../../ReusableComponents';

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
  const [count, setCount] = useState(route.params?.point || 0);
  const [nextLevel, setNextLevel] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('Warming up');
  const [fromLeft, setFromLeft] = useState('Warming up');
  const [activities, setActivities] = useState(0);
  const {user} = useSelector(state => state?.auth?.user);

  const [list, showList] = useState(DATA);

  // useEffect(() => {
  //     getMyVouchersInfo()
  // }, [])

  // const getMyVouchersInfo = () => {
  //     setLoading(true)
  //     activeLevel().then((response) => {
  //         if (response?.success == 1) {
  //             const { data } = response
  //             const { count } = data

  //             setCount(count)
  //         } else {
  //             setLoading(false)
  //         }
  //     }).catch((error) => {
  //         setLoading(false)

  //     })
  // }
  useEffect(() => {
    const level = makeLevel(count);
    setNextLevel(level.nextLevel);
    setActivities(level.activities);
    setCurrentLevel(level.newLevel);
    if (level.newLevel === 'Warming up') {
      progress.value = withTiming(size.width / 18);
    } else if (level.newLevel === 'Active') {
      progress.value = withTiming(size.width / 3.5);
    } else if (level.newLevel === 'Super Active') {
      progress.value = withTiming(size.width / 2);
    } else if (level.newLevel === 'On Fire') {
      progress.value = withTiming(size.width / 1.5);
    }
    setLoading(false);
  }, [count]);

  const newStyle = useAnimatedStyle(() => {
    return {
      left: progress.value,
    };
  });

  return (
    <Box flex={1}>
      <Header title="Activities" left navigation={navigation} />
      <ScrollView style={{flexGrow: 1}}>
        <Box flex={1} mt="xl">
          <TouchableBox
            onPress={() => {
              navigation.navigate('ActiveLevels');
            }}
            marginTop="l">
            <Box
              borderWidth={1}
              height={200}
              marginHorizontal="m"
              borderRadius={25}
              borderColor="primary">
              <Box flexDirection="row" marginTop="m" ml="m">
                <Image
                  source={Images?.flash}
                  style={{
                    height: wp(7),
                    width: wp(7),
                    tintColor: palette?.primary,
                  }}
                />
                <Box ml="m">
                  <Text variant="blackshade16800Semi">Active Level</Text>
                </Box>
                <Box ml="m">
                  <Image source={Images?.Info} style={styles.points} />
                </Box>
              </Box>
              <Box
                style={{marginTop: 50}}
                flexDirection="row"
                marginHorizontal="m"
                alignItems="center">
                <Animated.View
                  style={newStyle}
                  zIndex={100}
                  top={-30}
                  position={'absolute'}>
                  <Box
                    backgroundColor="primary"
                    height={30}
                    width={90}
                    borderRadius={15}
                    justifyContent="center"
                    alignItems="center"
                    zIndex={100}>
                    <Text variant="white12Medium">{currentLevel}</Text>
                  </Box>
                  <Box
                    left={30}
                    mt="s"
                    backgroundColor="primary"
                    height={30}
                    width={30}
                    borderRadius={15}
                    justifyContent="center"
                    alignItems="center"
                    zIndex={100}>
                    <Text variant="white12Medium">{count}</Text>
                  </Box>
                </Animated.View>
                <Box mt="l">
                  <Svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${vWidth} ${vHeight}`}>
                    <Path
                      d="M1 0.5H258"
                      stroke="#FDAF8A"
                      strokeLinecap="round"
                      strokeDasharray="4"
                    />
                  </Svg>
                </Box>
              </Box>
              <Box mt="l" alignItems="center" justifyContent="center">
                <Text variant="blackshade14800">
                  {activities}+ activities to reach
                </Text>
                <Text variant="primary14500">
                  {nextLevel} <Text variant="blackshade14800">level</Text>
                </Text>
              </Box>
            </Box>
          </TouchableBox>
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
