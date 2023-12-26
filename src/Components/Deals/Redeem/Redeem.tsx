import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Image, View} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {Input, Shimmer, LoadingOverlay} from '../../ReusableComponents/index';
import {size} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
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
import RedeemItem from './RedeemItem';
import VoucherItem from './VoucherItem';
import VoucherSelectionItem from './VoucherSelectionItem';
import {getUserProfile} from '../../Services/ProfileApi';
import {
  getMyRewards,
  getMyVouchersList,
  getStatusOfVouchers,
} from '../../Services/RewardsApi';
import {AuthConstants} from '../../../Redux';

const HEADER_HEIGHT = 200;

const DATA = [
  {
    id: 1,
    name: 'Active',
    selected: false,
    number: 0,
  },
  {
    id: 2,
    name: 'Used',
    selected: false,
    number: 0,
  },
  {
    id: 3,
    name: 'Expired',
    selected: false,
    number: 0,
  },
];

const Redeem = ({navigation, route}) => {
  const [vouchers, setVouchers] = useState([]);
  const [toRedeem, setToRedeem] = useState([]);
  const [loading, setLoading] = useState([]);
  const [voucherType, setVoucherType] = useState(1);
  const [status, setStatus] = useState({});
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const {category} = useSelector(state => state?.book?.booking);
  const {user} = useSelector(state => state?.auth?.user);
  const [list, showList] = useState([]);

  const {params} = route;
  const {currentLevel} = params;

  const returnType = val => {
    let newVal = 1;
    if (val?.name === 'Active') {
      newVal = 1;
    } else if (val?.name === 'Used') {
      newVal = 2;
    } else if (val?.name === 'Expired') {
      newVal = 3;
    }
    return newVal;
  };

  useEffect(() => {
    getMyVouchersInfo();
  }, [voucherType]);

  useEffect(() => {
    let newData = DATA;
    newData[0].selected = true;
    showList(newData);
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      const type = list.find(e => e.selected);
      setVoucherType(returnType(type));
    }
  }, [list]);

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

  const selection = useCallback(
    id => {
      const newList = list.map(e => {
        let newObj = e;
        if (id === e.id) {
          if (!newObj.selected) {
            newObj.selected = true;
          }
        } else {
          newObj.selected = false;
        }
        return newObj;
      });
      showList(newList);
    },
    [list],
  );

  useEffect(() => {
    getToEarnedList();
    getEarnedStatus();
  }, []);

  const getProfileInfo = () => {
    setLoading(true);
    getUserProfile()
      .then(response => {
        setLoading(false);
        if (response?.success == 1) {
          dispatch({
            type: AuthConstants.USER_INFO_RECEIVED,
            user: response,
          });
        } else {
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const getMyVouchersInfo = () => {
    setLoading(true);
    getMyVouchersList(voucherType)
      .then(response => {
        setLoading(false);
        if (response?.success == 1) {
          const {data} = response;
          setVouchers(data?.userRewardUsageRows);
        } else {
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const getToEarnedList = () => {
    setLoading(true);
    getMyRewards(voucherType)
      .then(response => {
        setLoading(false);
        const {data, success} = response;
        if (success === 1) {
          setToRedeem(data?.userRewardRows);
        } else {
          setToRedeem([]);
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const getEarnedStatus = () => {
    setLoading(true);
    getStatusOfVouchers(voucherType)
      .then(response => {
        setLoading(false);
        const {data, success} = response;

        if (success === 1) {
          let newData = DATA;
          newData[0].number = data.ACTIVE;
          newData[1].number = data.USED;
          newData[2].number = data.EXPIRED;

          showList(newData);
        } else {
          setToRedeem([]);
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const refresh = () => {
    getMyVouchersInfo();
    getMyRewards();
    getProfileInfo();
    getEarnedStatus();
  };

  return (
    <Box flex={1}>
      <Tabs.Container
        headerContainerStyle={{
          backgroundColor: palette?.secondary1,
          shadowColor: '#FFFF',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        }}
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
                source={Images?.RedeemPointsImg}
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
                    <Text variant="white16500">My Rewards</Text>
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
        <Tabs.Tab name="A" label={makeLabel('To Redeem')}>
          <Tabs.FlatList
            contentContainerStyle={{
              backgroundColor: '#FAFAFA',
              paddingBottom: 50,
            }}
            data={toRedeem}
            renderItem={({item}) => {
              return (
                <VoucherItem
                  refresh={refresh}
                  item={item}
                  navigation={navigation}
                  route={route}
                />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <Box justifyContent="center">
                  {toRedeem.length === 0 && !loading ? (
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
        <Tabs.Tab name="B" label={makeLabel('My Voucher')}>
          <Tabs.FlatList
            ListHeaderComponent={() => {
              return (
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                  {list.map(item => {
                    return (
                      <VoucherSelectionItem
                        item={item}
                        navigation={navigation}
                        route={route}
                        selection={selection}
                      />
                    );
                  })}
                </ScrollView>
              );
            }}
            contentContainerStyle={{
              backgroundColor: 'white',
            }}
            data={vouchers}
            renderItem={({item}) => {
              return (
                <RedeemItem item={item} navigation={navigation} route={route} />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <Box justifyContent="center">
                  {vouchers.length === 0 && !loading ? (
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

export default Redeem;

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
          marginHorizontal="m"
          alignItems="center"
          mb="s">
          <Shimmer height={90} width={90} borderRadius={10} />
          <Box ml="m">
            <Shimmer height={100} width={1} borderRadius={10} />
          </Box>
          <Box>
            <Shimmer
              style={{marginLeft: 10, marginBottom: 10}}
              height={10}
              width={size?.width / 1.8}
              borderRadius={3}
            />
            <Shimmer
              style={{marginLeft: 10}}
              height={10}
              width={size?.width / 2.4}
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
              width={size?.width / 1.9}
              borderRadius={3}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
