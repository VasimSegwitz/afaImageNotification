import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  View,
  RefreshControl,
  ScrollView,
} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../Theme/Index';
import {Shimmer, LoadingOverlay} from '../ReusableComponents/index';
import {size} from '../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../Helpers/responsive-ratio';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../Constant/Image';
import {
  Tabs,
  CollapsibleRef,
  MaterialTabBar,
  CollapsibleProps,
  TabItemProps,
} from 'react-native-collapsible-tab-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import EarnedItem from './EarnedItem';
import ToEarnItem from './ToEarnItem';
import {getEarned, getToEarn} from '../Services/RewardsApi';

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

const EarnPoints = ({navigation, route}) => {
  const [earned, setEarned] = useState([]);
  const [toEarned, setToEarned] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state?.auth?.user);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {category} = useSelector(state => state?.book?.booking);
  const [list, showList] = useState(DATA);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const {params} = route;
  const {currentLevel} = params;

  const makeLabel = useCallback(
    <T extends TabName>(label: string) =>
      (props: TabItemProps<T>) =>
        (
          <TabItem
            index={props.index}
            indexDecimal={props.indexDecimal}
            label={label}
          />
        ),
    [],
  );

  type Props = {
    emptyContacts?: boolean;
  } & Partial<CollapsibleProps>;

  function TabItem<T extends TabName>({
    index,
    indexDecimal,
    label,
  }: Pick<TabItemProps<T>, 'index' | 'indexDecimal'> & {label: string}) {
    const textStyle = useAnimatedStyle(() => {
      return {
        color: interpolateColor(
          indexDecimal.value,
          [index - 1, index, index + 1],
          [palette?.blackshade1, palette?.blackshade, palette?.blackshade1],
        ),
      };
    });

    return (
      <View style={styles.tabItemContainer}>
        <Animated.Text style={textStyle}>{label}</Animated.Text>
      </View>
    );
  }

  useEffect(() => {
    setLoading(true);
    getEarnedList();
    getToEarnedList();
  }, []);

  const getEarnedList = () => {
    setLoading(true);
    getEarned(page)
      .then(response => {
        setLoading(false);
        const {data, success} = response;
        if (success === 1) {
          const {userLoyaltyPointTransactionRows, recordsTotal} = data;
          setTotalTransactions(recordsTotal);
          setEarned(
            page === 1
              ? userLoyaltyPointTransactionRows
              : [...earned, ...userLoyaltyPointTransactionRows],
          );
        } else {
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const getToEarnedList = () => {
    setRefreshing(true);
    getToEarn(page)
      .then(response => {
        setRefreshing(false);
        setLoading(false);
        const {data, success} = response;
        if (success === 1) {
          setToEarned(data);
        } else {
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (parseInt(totalTransactions) !== parseInt(earned.length)) {
      setPage(page + 1);
    }
  };

  return (
    <Box flex={1}>
      <Tabs.Container
        headerContainerStyle={styles.containerOne}
        tabBarHeight={100 + insets?.top}
        renderTabBar={props => (
          <MaterialTabBar
            indicatorStyle={{
              backgroundColor: palette?.primary,
            }}
            style={{
              backgroundColor: 'white',
              height: 50,
            }}
            {...props}
            scrollEnabled
          />
        )}
        headerHeight={HEADER_HEIGHT}
        renderHeader={() => {
          return (
            <Box
              flex={1}
              style={[
                {
                  width: '100%',
                  height: HEADER_HEIGHT,
                },
              ]}>
              <FastImage
                source={Images?.EarnPoint}
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
                    <Text variant="white16500">Earn Points</Text>
                  </Box>
                </Box>
              </Box>
              <Box position="absolute" right={0} left={20} bottom={30}>
                <Box flexDirection="row">
                  <Text variant="white36700">
                    {user?.data?.total_loyalty_points}
                  </Text>
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
              <Box
                position="absolute"
                bottom={-19}
                right={0}
                left={0}
                height={20}
                borderTopRightRadius={20}
                borderTopLeftRadius={20}
                backgroundColor="white"></Box>
            </Box>
          );
        }}>
        <Tabs.Tab name="A" label={makeLabel('To Earn')}>
          <Tabs.FlatList
            numColumns={2}
            ListHeaderComponent={() => {
              return (
                <Box marginHorizontal="m" mt="l" mb="s">
                  <Text variant="blackshade316800Regular">
                    Complete these mission to earn more points{' '}
                  </Text>
                </Box>
              );
            }}
            contentContainerStyle={{
              backgroundColor: '#FAFAFA',
              paddingBottom: 50,
            }}
            data={toEarned}
            renderItem={({item}) => {
              return (
                <ToEarnItem item={item} navigation={navigation} route={route} />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <Box justifyContent="center">
                  {toEarned.length === 0 && !loading ? (
                    <Box>
                      <Text
                        mt="l"
                        textAlign={'center'}
                        variant="blackshade116500">
                        No Data
                      </Text>
                    </Box>
                  ) : (
                    <Box flex={1}>
                      <ScrollView
                        contentContainerStyle={TypographyStyles?.grow}
                        showsVerticalScrollIndicator={false}>
                        {[0, 0, 0, 0].map((item, index) => {
                          return (
                            <Animated.View
                              entering={FadeIn.delay(100 * index)}
                              exiting={FadeOut.delay(200 * index)}>
                              <ShimmerEar index={index} />
                            </Animated.View>
                          );
                        })}
                      </ScrollView>
                    </Box>
                  )}
                </Box>
              );
            }}
            keyExtractor={(item, index) => index?.toString()}
          />
        </Tabs.Tab>
        <Tabs.Tab name="B" label={makeLabel('Transaction History')}>
          <Tabs.FlatList
            style={{paddingTop: 20, backgroundColor: 'white'}}
            data={earned}
            renderItem={({item}) => {
              return (
                <EarnedItem item={item} navigation={navigation} route={route} />
              );
            }}
            ItemSeparatorComponent={() => {
              return (
                <Box
                  height={1}
                  marginHorizontal="l"
                  backgroundColor="tertiary2"
                  marginVertical="m"
                />
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  if (page === 1) {
                    getEarnedList();
                  } else {
                    setPage(1);
                    setTimeout(() => {
                      getEarnedList();
                    }, 500);
                  }
                }}
              />
            }
            onEndReachedThreshold={0.9}
            onEndReached={handleLoadMore}
            ListEmptyComponent={() => {
              return (
                <Box justifyContent="center">
                  {earned.length === 0 && !loading ? (
                    <Box>
                      <Text
                        mt="l"
                        textAlign={'center'}
                        variant="blackshade116500">
                        No Data
                      </Text>
                    </Box>
                  ) : (
                    <Box flex={1}>
                      <ScrollView
                        contentContainerStyle={TypographyStyles?.grow}
                        showsVerticalScrollIndicator={false}>
                        {[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1].map(
                          (item, index) => {
                            return (
                              <Animated.View
                                entering={FadeIn.delay(100 * index)}
                                exiting={FadeOut.delay(200 * index)}>
                                <ShimmerEarned index={index} />
                              </Animated.View>
                            );
                          },
                        )}
                      </ScrollView>
                    </Box>
                  )}
                </Box>
              );
            }}
            keyExtractor={(item, index) => index?.toString()}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </Box>
  );
};

const styles = StyleSheet.create({
  containerOne: {
    backgroundColor: palette?.secondary1,
    shadowColor: '#FFFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
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

export default EarnPoints;

const ShimmerEar = ({index}) => {
  return (
    <Box pt="m" flexDirection="row" flex={1}>
      <Box
        minHeight={size?.height / 4}
        flex={1}
        marginHorizontal="s"
        borderWidth={1}
        mb="m"
        key={index.toString()}
        borderRadius={10}
        backgroundColor="white"
        overflow="hidden"
        style={[{borderColor: '#ebebeb'}, TypographyStyles.cardShadow]}>
        <Box
          mt="m"
          flexDirection="row"
          marginHorizontal="s"
          alignItems="center"
          mb="s">
          <Shimmer height={40} width={40} borderRadius={20} />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={10}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={20}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={20}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={20}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={20}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
      </Box>
      <Box
        minHeight={size?.height / 4}
        flex={1}
        marginHorizontal="s"
        borderWidth={1}
        mb="m"
        key={index.toString()}
        borderRadius={10}
        backgroundColor="white"
        overflow="hidden"
        style={[{borderColor: '#ebebeb'}, TypographyStyles.cardShadow]}>
        <Box
          mt="s"
          flexDirection="row"
          marginHorizontal="s"
          alignItems="center"
          mb="s">
          <Shimmer height={40} width={40} borderRadius={20} />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={10}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={20}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={20}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={20}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
        <Box marginHorizontal="m" mt="m">
          <Shimmer
            style={{marginLeft: 10}}
            height={20}
            width={size?.width / 3}
            borderRadius={3}
          />
        </Box>
      </Box>
    </Box>
  );
};

const ShimmerEarned = ({index}) => {
  return (
    <Box pt="m" flexDirection="row" flex={1}>
      <Box
        flex={1}
        marginHorizontal="m"
        borderWidth={1}
        mb="m"
        key={index.toString()}
        borderRadius={10}
        backgroundColor="white"
        overflow="hidden"
        style={[{borderColor: '#ebebeb'}, TypographyStyles.cardShadow]}>
        <Box
          paddingVertical="m"
          mt="s"
          flexDirection="row"
          marginHorizontal="s"
          alignItems="center"
          mb="s">
          <Shimmer height={50} width={50} borderRadius={25} />
          <Box>
            <Shimmer
              style={{marginLeft: 10}}
              height={10}
              width={size?.width / 1.4}
              borderRadius={3}
            />
            <Shimmer
              style={{marginLeft: 10, marginTop: 10}}
              height={10}
              width={size?.width / 2}
              borderRadius={3}
            />
            <Shimmer
              style={{marginLeft: 10, marginTop: 10}}
              height={10}
              width={size?.width / 1.6}
              borderRadius={3}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
