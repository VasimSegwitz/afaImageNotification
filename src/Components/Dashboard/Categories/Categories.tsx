import React, {memo, useEffect, useMemo, useState} from 'react';
import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import theme, {Box, palette, Text, TouchableBox} from '../../Theme/Index';
const Activities = require('../../../assets/Home/Categories/Activities.png');
const Book = require('../../../assets/Home/Categories/Book.png');
const Deals = require('../../../assets/Home/Categories/Deals.png');
const Venues = require('../../../assets/Home/Categories/Venues.png');
const Groups = require('../../../assets/Home/Categories/Groups.png');
import Carousel from 'react-native-reanimated-carousel';
import {size} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {displaySuccessToast} from '../../../utils';
import ToolTipContent from '../../ReusableComponents/ToolTipContent';
import Tooltip from '../../ReusableComponents/tooltip/src/tooltip';

const Categories = ({
  navigation,
  setSoon,
  setActOpen,
  tooltipData,
  setTooltip,
  searchDone,
}) => {
  const data = useMemo(
    () => [
      {
        id: 1,
        source: Activities,
        name: 'Activities',
        goTo: 'ActivitySearch',
      },
      {
        id: 2,
        source: Book,
        name: 'Book',
        goTo: 'BookingSearch',
      },

      {
        id: 3,
        source: Venues,
        name: 'Venues',
        goTo: 'Venue',
      },
      {
        id: 4,
        source: Deals,
        name: 'Deals',
        goTo: 'Deals', // for Deals
        // goTo: 'Redeem', // for Deals
      },
      {
        id: 5,
        source: Groups,
        name: 'Groups',
        goTo: 'BookingSearch',
      },
    ],
    [],
  );

  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      translateX.value = e.contentOffset.x;
    },
  });

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value < 28 ? translateX.value : 28,
        },
      ],
    };
  });

  const navigateToScreen = val => {};
  const [firstSearch, setFirstsearch] = useState(false);
  const [second, setSecond] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (tooltipData && tooltipData?.search) {
        setSecond(tooltipData?.second ? false : true);
      }
    }, 1000);
  }, [tooltipData]);

  // useEffect(() => {
  //   setTooltip({
  //     tooltip: {
  //       search: false,
  //       firstSearch: false,
  //     },
  //   });
  // }, [firstSearch]);

  const handleFirstSearch = () => {
    setSoon(true);
    // setFirstsearch(true);
  };

  const handActOpen = () => {
    setActOpen(true);
    // setFirstsearch(true);
  };

  return (
    <Animated.View style={{flex: 1}}>
      <Animated.ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        nestedScrollEnabled={true}
        contentContainerStyle={{flexGrow: 1}}
        onScroll={scrollHandler}>
        <Animated.View style={{flex: 1, flexDirection: 'row'}}>
          {data.map((item, index) => {
            const {source, name, goTo, id} = item;
            return id == 1 ? (
              <Tooltip
                isVisible={firstSearch}
                topAdjustment={
                  Platform?.OS == 'android' ? -StatusBar?.currentHeight : 0
                }
                contentStyle={{
                  borderRadius: 10,
                  // width: wp(80),
                }}
                content={
                  <ToolTipContent
                    onPress={() => {
                      setFirstsearch(false);
                      setTooltip({
                        tooltip: {
                          ...tooltipData,
                          firstSearch: true,
                        },
                      });
                      setSecond(true);
                    }}
                    circleArray={[false, false, true, false]}
                    title="Get suggested Activities near you!"
                    detail="Want to make new friends? Join Activities available near you"
                  />
                }
                placement="bottom"
                childrenWrapperStyle={{
                  backgroundColor: 'transparent',
                }}
                onClose={() => {
                  setFirstsearch(false);
                  setTooltip({
                    tooltip: {
                      ...tooltipData,
                      firstSearch: true,
                    },
                  });
                  setSecond(true);
                  // navigation.navigate(`${goTo}`);
                }}>
                <View key={index}>
                  {/* {id == 1 && (
                    <Box
                      height={8}
                      width={8}
                      left={45}
                      zIndex={10}
                      // top={-10}
                      position="absolute"
                      borderRadius={5}
                      backgroundColor="primary"
                    />
                  )} */}
                  <TouchableBox
                    onPress={() => {
                      id == 1
                        ? handActOpen()
                        : tooltipData?.firstSearch
                        ? navigation.navigate(`${goTo}`)
                        : setFirstsearch(true);
                    }}
                    // height={80}
                    mr="m"
                    justifyContent="center"
                    alignItems="center">
                    <FastImage
                      source={source}
                      style={{
                        height: 60,
                        width: 60,
                      }}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />

                    <Box>
                      <Text variant="blackshade14400" textAlign="center">
                        {name}
                      </Text>
                      {/* {id == 1 && (
                        <Text variant="primary10500" textAlign="center">
                          (Beta)
                        </Text>
                      )} */}
                    </Box>
                  </TouchableBox>
                </View>
              </Tooltip>
            ) : id == 2 ? (
              <Tooltip
                isVisible={second}
                topAdjustment={
                  Platform?.OS == 'android' ? -StatusBar?.currentHeight : 0
                }
                contentStyle={{
                  borderRadius: 10,
                  // width: wp(80),
                }}
                content={
                  <ToolTipContent
                    circleArray={[false, true, false]}
                    title="Book Instantly"
                    onPress={() => {
                      setSecond(false);
                      setTooltip({
                        tooltip: {
                          ...tooltipData,
                          second: true,
                          wallet: true,
                        },
                      });
                      // navigation.navigate(`${goTo}`);
                    }}
                    detail="Browse and book available Venues instantly here!"
                  />
                }
                placement="top"
                childrenWrapperStyle={{
                  backgroundColor: 'transparent',
                }}
                onClose={() => {
                  setSecond(false);
                  setTooltip({
                    tooltip: {
                      ...tooltipData,
                      second: true,
                      wallet: true,
                    },
                  });
                  // navigation.navigate(`${goTo}`);
                }}>
                <View key={index}>
                  <TouchableBox
                    onPress={() => {
                      tooltipData?.second
                        ? navigation.navigate(`${goTo}`)
                        : setSecond(true);
                      // displaySuccessToast('Coming Soon');
                    }}
                    height={80}
                    mr="m"
                    justifyContent="center"
                    alignItems="center">
                    <FastImage
                      source={source}
                      style={{
                        height: 60,
                        width: 60,
                      }}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />
                    <Box>
                      <Text variant="blackshade14400">{name}</Text>
                    </Box>
                  </TouchableBox>
                </View>
              </Tooltip>
            ) : id === 4 ? (
              <View key={index}>
                <TouchableBox
                  onPress={() => {
                    handleFirstSearch();
                  }}
                  height={80}
                  mr="m"
                  justifyContent="center"
                  alignItems="center">
                  <FastImage
                    source={source}
                    style={{
                      height: 60,
                      width: 60,
                    }}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Box>
                    <Text variant="blackshade14400">{name}</Text>
                  </Box>
                </TouchableBox>
              </View>
            ) : (
              <View key={index}>
                <TouchableBox
                  onPress={() => {
                    id == 1 || id == 3 || id == 4
                      ? navigation.navigate(`${goTo}`)
                      : handleFirstSearch();
                  }}
                  height={80}
                  mr="m"
                  justifyContent="center"
                  alignItems="center">
                  <FastImage
                    source={source}
                    style={{
                      height: 60,
                      width: 60,
                    }}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Box>
                    <Text variant="blackshade14400">{name}</Text>
                  </Box>
                </TouchableBox>
              </View>
            );
          })}
        </Animated.View>
      </Animated.ScrollView>
      <Animated.View style={styles.border}>
        <Animated.View style={[styles.orangeDot, stylez]} />
      </Animated.View>
    </Animated.View>
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
