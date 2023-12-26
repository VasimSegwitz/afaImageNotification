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
import Header from '../../Components/ReusableComponents/Header/index';
import FastImage from 'react-native-fast-image';
import {wp} from '../Helpers/responsive-ratio';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Images} from '../../Constant/Image';
import {activeLevel} from '../Services/RewardsApi';
const ActiveLevels = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState([]);
  const [nextLevel, setNextLevel] = useState(0);

  const [count, setCount] = useState(0);
  const {user} = useSelector(state => state?.auth?.user);

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

  const makeLevel = val => {
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
      nextLevel = 'On Fire';
      activities = 150 - val;
    } else if (val >= 150 && val <= 200) {
      newLevel = 'On Fire';
      nextLevel = 'On Fire';
      activities = 200 - val;
    }
    return {newLevel, nextLevel, activities};
  };

  useEffect(() => {
    getNextLevel();
  }, [count]);

  const getNextLevel = () => {
    const level = makeLevel(count);
    setNextLevel(level.newLevel);
    setLoading(false);
  };

  return (
    <Box flex={1}>
      <Header
        left={true}
        onback={() => {
          navigation?.goBack();
        }}
        title="Active Levels"
      />
      <ScrollView contentContainerStyle={{flex: 1}}>
        <Box flex={1} flexDirection="row">
          <Box ml="l" flex={0.2} alignItems="center">
            <Box width={1} height={20} backgroundColor="primary" />
            <Box
              backgroundColor={
                nextLevel === 'Warming up' ? 'primary' : 'primary2'
              }
              justifyContent="center"
              alignItems="center"
              borderRadius={wp(10)}
              style={{width: wp(10), height: wp(10)}}>
              {nextLevel !== 'Warming up' ? (
                <Image
                  style={{width: wp(5), height: wp(5)}}
                  source={Images?.flash}
                />
              ) : (
                <Text variant="white16500regular">{count}</Text>
              )}
            </Box>
            <Box width={1} height={50} backgroundColor="primary" />
            <Box
              backgroundColor={nextLevel === 'Active' ? 'primary' : 'primary2'}
              justifyContent="center"
              alignItems="center"
              borderRadius={wp(10)}
              style={{width: wp(10), height: wp(10)}}>
              {nextLevel !== 'Active' ? (
                <Image
                  style={{width: wp(5), height: wp(5)}}
                  source={Images?.flash}
                />
              ) : (
                <Text variant="white16500regular">{count}</Text>
              )}
            </Box>
            <Box width={1} height={65} backgroundColor="primary" />
            <Box
              backgroundColor={
                nextLevel === 'Super active' ? 'primary' : 'primary2'
              }
              justifyContent="center"
              alignItems="center"
              borderRadius={wp(10)}
              style={{width: wp(10), height: wp(10)}}>
              {nextLevel !== 'Super active' ? (
                <Image
                  style={{width: wp(5), height: wp(5)}}
                  source={Images?.flash}
                />
              ) : (
                <Text variant="white16500regular">{count}</Text>
              )}
            </Box>
            <Box width={1} height={50} backgroundColor="primary" />
            <Box
              backgroundColor={nextLevel === 'On Fire' ? 'primary' : 'primary2'}
              justifyContent="center"
              alignItems="center"
              borderRadius={wp(10)}
              style={{width: wp(10), height: wp(10)}}>
              {nextLevel !== 'On Fire' ? (
                <Image
                  style={{width: wp(5), height: wp(5)}}
                  source={Images?.flash}
                />
              ) : (
                <Text variant="white16500regular">{count}</Text>
              )}
            </Box>
            <Box width={1} height={50} backgroundColor="primary" />
          </Box>
          <Box flex={1} style={{marginTop: 10}}>
            <Box width={size?.width / 1.5}>
              <Text
                variant={
                  nextLevel === 'Warming up'
                    ? 'primary14500Black'
                    : 'support414600black'
                }>
                Warming up
              </Text>
              <Text
                variant={
                  nextLevel === 'Warming up'
                    ? 'primary14500Medium'
                    : 'support414600Regular'
                }>
                50 joined activities
              </Text>
              <Text variant="blackshade114500">
                You’re doing good, champ! Let’s try to keep this momentum going.
              </Text>
            </Box>
            <Box style={{marginTop: 20}} width={size?.width / 1.5}>
              <Text
                variant={
                  nextLevel === 'Active'
                    ? 'primary14500Black'
                    : 'support414600black'
                }>
                Active
              </Text>
              <Text
                variant={
                  nextLevel === 'Active'
                    ? 'primary14500Medium'
                    : 'support414600Regular'
                }>
                100 joined activities
              </Text>
              <Text variant="blackshade114500">
                You are a court favourite! Keep smashing more rounds{' '}
              </Text>
            </Box>
            <Box style={{marginTop: 20}} width={size?.width / 1.5}>
              <Text
                variant={
                  nextLevel === 'Super active'
                    ? 'primary14500Black'
                    : 'support414600black'
                }>
                SUPER ACTIVE
              </Text>
              <Text
                variant={
                  nextLevel === 'Super active'
                    ? 'primary14500Medium'
                    : 'support414600Regular'
                }>
                150 joined activities
              </Text>
              <Text variant="blackshade114500">
                You’ve earned the title, champion!{' '}
              </Text>
            </Box>
            <Box style={{marginTop: 30}} width={size?.width / 1.5}>
              <Text
                variant={
                  nextLevel === 'On Fire'
                    ? 'primary14500Black'
                    : 'support414600black'
                }>
                ON FIRE
              </Text>
              <Text
                variant={
                  nextLevel === 'On Fire'
                    ? 'primary14500Medium'
                    : 'support414600Regular'
                }>
                200 joined activities
              </Text>
              <Text variant="blackshade114500">
                Congratulations, you are the Most Active of them All!{' '}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box flex={0.2} mt="m">
          <Box
            borderRadius={10}
            marginHorizontal="l"
            minHeight={70}
            borderWidth={1}
            borderColor="primary"
            alignItems="center"
            flexDirection="row"
            paddingVertical="m">
            <Box
              ml="l"
              justifyContent={'center'}
              alignItems="center"
              height={wp(5)}
              width={wp(5)}
              mr="m">
              <Image source={Images?.Newyear} style={styles.image} />
            </Box>
            <Box width={size?.width / 1.5}>
              <Text variant="blackshade14800">
                This Active Level stats will be refreshed at the start of each
                new year.
              </Text>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    height: wp(5),
    width: wp(5),
  },
});

export default ActiveLevels;
