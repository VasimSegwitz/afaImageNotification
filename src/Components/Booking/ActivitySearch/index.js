import moment from 'moment';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {FlatList, ImageBackground, ScrollView} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import FastImage from 'react-native-fast-image';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {displayErrorToast} from '../../../utils';
import authStore from '../../../Zustand/store';
import ActivitiesUpcoming from '../../Dashboard/ActivitiesUpcoming/ActivitiesUpcoming';
import {wp} from '../../Helpers/responsive-ratio';
import {LoadingOverlay} from '../../ReusableComponents';
import Header from '../../ReusableComponents/Header';
import {getSearchActivity} from '../../Services/Booking';
import theme, {
  Box,
  palette,
  size,
  Text,
  TypographyStyles,
} from '../../Theme/Index';
import SelectSport from '../CreateActivity/Settings/SelectSport/SelectSport';
import TypesOfSports from '../SearchVenues/BookingSearch/TypesOfSports/TypesOfSports';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {AddtoWishlist, GetWishlist} from '../../Services/WishlistApi';
import {Shimmer} from '../../ReusableComponents/index';

export default ({navigation, route}) => {
  const setToken = authStore(state => state?.setToken);

  const [selectDate, setSelectDate] = useState(new Date());
  const sport = useSelector(
    state => state?.auth?.user?.user?.data?.favorite_sports,
  );
  const location = useSelector(
    state => state?.auth?.user?.user?.data?.user_info,
  );

  const [mainCat, setMaincat] = useState(sport);
  const scrollY = new Animated.Value(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [selWishlist, setSelWishlist] = useState([]);

  const [page, setPage] = useState(1);

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      activity: [],
      showList: false,
      isLoading: false,
      categoryId: '',
    },
  );

  useEffect(() => {
    setLoading(true);
  }, []);

  const [body, setBody] = useState({
    date: moment(selectDate).format('DD-MM-YYYY'),
    category_id: state?.categoryId,
    location_lat: location && location?.location_lat,
    location_long: location && location?.location_long,
    order_by: 4,
    search: null,
    per_page: 10,
    page: page,
  });

  /**
   * @function onSelectCategory
   * @param item
   * @description this function will set flag true which is selected
   */

  const onSelectCategory = item => {
    setState({
      categoryId: item?.category?.id,
    });

    // mainCat
    const temp = mainCat.map(cat => {
      return {
        ...cat,
        flag: cat?.category?.id == item?.category?.id ? true : false,
      };
    });

    setMaincat(temp);

    setState({
      activity: [],
    });
    setPage(1);

    setBody({
      ...body,
      page: 1,
      category_id: item?.category?.id,
    });
  };

  const [changeing, setChanging] = useState(false);

  /**
   * @function getList
   * @param body
   * @description this will call the getSportComplex api with search keyword
   */

  const getList = useQuery(['getSearchActivity', body], getSearchActivity, {
    enabled: changeing,
    // keepPreviousData: true,
    onSuccess: result => {
      setLoading(false);
      setAllLoaded(result?.data?.data?.length > 0 ? false : true);
      setLoadingMore(false);
      setPage(result?.data?.current_page);
      // getWishlistActivity?.refetch();
      if (result?.data?.data)
        setState({
          activity: state?.activity?.concat(result?.data?.data),
        });
      else {
        const key = Object.keys(result?.data?.data)[0];
        displayErrorToast(result?.data?.data[key]);
      }
    },
    onError: error => {
      // const key = error?.data?.data && Object.keys(error?.data?.data)[0];
      displayErrorToast('No activity found ! search with another field');
    },
  });

  /**
   * @function onChange
   * @param e
   * @description this will set the whatever character press to save in value
   */

  const onChange = e => {
    setState({
      activity: [],
    });
    setPage(1);
    setBody({
      ...body,
      page: 1,
      date: moment(e).format('DD-MM-YYYY'),
    });
    getList?.refetch();
  };

  /**
   * @function useEffect
   * @description this will call first time
   */

  useEffect(() => {
    setLoading(true);
    getList.refetch();
  }, [body]);

  const setBodyNow = data => {
    const stringifyData = JSON.parse(JSON.stringify(data));
    setState({
      activity: [],
    });
    setPage(1);
    setBody({
      ...body,
      ...stringifyData,
    });
    // getList?.refetch();
  };

  const setReset = data => {
    const stringifyData = JSON.parse(JSON.stringify(data));
    setState({
      activity: [],
    });
    setPage(1);
    setBody({
      ...stringifyData,
      date: moment(selectDate).format('DD-MM-YYYY'),
    });
    getList?.refetch();
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <Box
        style={{
          padding: 10,
          // marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {!allLoaded ? (
          loadingMore ? (
            <Text>Loading...</Text>
          ) : // <ActivityIndicator color="#D71513" />
          null
        ) : (
          <Box justifyContent="center" alignItems="center" flex={1}>
            {state?.activity.length > 0 ? (
              <Text textAlign={'center'}>no more activities</Text>
            ) : null}
          </Box>
        )}
      </Box>
    );
  };

  const loadMore = () => {
    // if already loading more, or all loaded, return
    if (allLoaded || loadingMore) return;
    // set loading more (also updates footer text)
    setLoadingMore(true);
    let p = page + 1;
    setBody({
      ...body,
      page: p,
    });
    // getList?.refetch();
    // get next results
    // getProductListing?.refetch();
  };

  const renderItem = useCallback(({item}) => {
    return (
      <ActivitiesUpcoming
        showGoing={true}
        data={item}
        setSelWishlist={setSelWishlist}
        selWishlist={selWishlist}
      />
    );
  }, []);

  /**
   * @function getWishlistActivity
   * @description this function will call the createActivity api
   */

  const getWishlistActivity = useQuery(['GetWishlist'], GetWishlist, {
    onSuccess: data => {
      if (data?.success == 0) {
        displayErrorToast(data?.data?.message);
        return;
      }
      setSelWishlist(data?.data?.map(item => item?.id));
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  // useFocusEffect(
  //   useCallback(() => {
  //     getWishlistActivity?.refetch();
  //   }, [body]),
  // );
  return (
    <Box
      flex={1}
      backgroundColor={theme?.colors?.white}
      justifyContent="center"
      style={{
        paddingBottom:
          route?.params?.space?.bottom == 0 ? 20 : route?.params?.space?.bottom,
      }}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={Images?.SearchActivityBanner}
          style={{
            height: wp(50),
            width: size.width,
          }}
          resizeMode={FastImage?.resizeMode?.stretch}>
          <Header
            left
            searchbar
            onFocus={() =>
              navigation?.navigate('SearchingActivity', {date: selectDate})
            }
            filter
            onFilter={() =>
              navigation.navigate('ActivityFilter', {
                onSelectData: setBodyNow,
                onResetNow: setReset,
                state: state,
                setState: setState,
              })
            }
            onChange={() =>
              navigation?.navigate('SearchingActivity', {date: selectDate})
            }
            searchBarStyle={{
              paddingRight: 50,
              backgroundColor: 'rgba(255,255,255,.5)',
            }}
          />
        </ImageBackground>
        <Box marginHorizontal={'l'} mt="l">
          <TypesOfSports
            TypeOfSportsData={mainCat}
            onSelect={onSelectCategory}
            navigation={navigation}
          />
        </Box>
        <CalendarStrip
          scrollable
          showIcon={false}
          onDateSelected={selectedDate => {
            setSelectDate(selectedDate);
            onChange(selectedDate);
          }}
          selectedDate={selectDate}
          markedDates={[
            {
              date: selectDate,
              dots: [
                {
                  color: palette?.placeholder,
                  selectedColor: palette.primary,
                },
              ],
            },
          ]}
          style={{height: wp(30), paddingBottom: 10}}
          calendarColor={'#fff'}
          calendarHeaderStyle={{color: '#000'}}
          dateNumberStyle={{color: '#000'}}
          dateNameStyle={{color: '#000'}}
        />
        <Box
          backgroundColor="white"
          flex={1}
          p={'t'}
          top={-30}
          borderTopLeftRadius={20}
          borderTopRightRadius={20}>
          <Box backgroundColor="tertiary2" marginVertical="m" height={1} />
          <Box mt="m">
            {state?.activity.length > 0 ? (
              <Box
                alignItems="center"
                justifyContent="space-between"
                flexDirection="row">
                <Text variant="blackshade116500">
                  {state?.activity?.length} Activities
                </Text>
              </Box>
            ) : null}
            <FlatList
              //estimatedItemSize={90}
              ItemSeparatorComponent={<Box height={15} />}
              contentContainerStyle={{padding: 2, flexGrow: 1}}
              data={state?.activity}
              renderItem={renderItem}
              removeClippedSubviews={true}
              ListFooterComponent={renderFooter}
              onEndReached={loadMore}
              ListEmptyComponent={() => {
                return (
                  <Box mt="l" justifyContent="center">
                    {state?.activity.length === 0 && !loading ? (
                      <Box>
                        <Text
                          mt="l"
                          textAlign={'center'}
                          variant="blackshade116500">
                          No Activities On This Day
                        </Text>
                      </Box>
                    ) : (
                      <Box flex={1}>
                        <ScrollView
                          contentContainerStyle={{flexGrow: 1}}
                          showsVerticalScrollIndicator={false}>
                          {[0, 0, 0, 0].map((item, index) => {
                            return (
                              <Animated.View
                                entering={FadeIn.delay(100 * index)}
                                exiting={FadeOut.delay(200 * index)}>
                                <Box
                                  borderWidth={1}
                                  mb="m"
                                  key={index.toString()}
                                  borderRadius={12}
                                  backgroundColor="white"
                                  overflow="hidden"
                                  style={[
                                    {borderColor: '#ebebeb'},
                                    TypographyStyles.cardShadow,
                                  ]}>
                                  <Box
                                    mt="s"
                                    flexDirection="row"
                                    marginHorizontal="s"
                                    alignItems="center"
                                    mb="s">
                                    <Shimmer
                                      height={40}
                                      width={40}
                                      borderRadius={20}
                                    />
                                    <Shimmer
                                      style={{marginLeft: 10}}
                                      height={20}
                                      width={size?.width / 1.5}
                                      borderRadius={3}
                                    />
                                  </Box>
                                  <Box mt="s" mb="m">
                                    <Shimmer
                                      style={{marginLeft: 10, marginBottom: 5}}
                                      height={10}
                                      width={size?.width / 1.5}
                                      borderRadius={3}
                                    />
                                    <Shimmer
                                      style={{marginLeft: 10}}
                                      height={2}
                                      width={size?.width / 1.2}
                                      borderRadius={3}
                                    />
                                  </Box>

                                  <Box
                                    marginHorizontal="s"
                                    ml="m"
                                    flexDirection="row">
                                    <Box>
                                      <Shimmer
                                        height={40}
                                        width={40}
                                        borderRadius={20}
                                      />
                                      <Shimmer
                                        style={{marginTop: 10}}
                                        height={5}
                                        width={size.width / 10}
                                        borderRadius={5}
                                      />
                                    </Box>
                                    <Box ml="m">
                                      <Shimmer
                                        height={20}
                                        width={size.width / 2}
                                        borderRadius={5}
                                      />
                                      <Shimmer
                                        style={{marginTop: 10}}
                                        height={20}
                                        width={size.width / 2.3}
                                        borderRadius={5}
                                      />
                                      <Shimmer
                                        style={{marginTop: 10}}
                                        height={20}
                                        width={size.width / 3}
                                        borderRadius={5}
                                      />
                                    </Box>
                                  </Box>

                                  <Box
                                    marginHorizontal="m"
                                    mb="m"
                                    justifyContent="center"
                                    alignItems="center">
                                    <Shimmer
                                      style={{marginTop: 15}}
                                      height={40}
                                      width={size.width / 1.3}
                                      borderRadius={5}
                                    />
                                  </Box>
                                </Box>
                              </Animated.View>
                            );
                          })}
                        </ScrollView>
                      </Box>
                    )}
                  </Box>
                );
              }}
            />
            {/* {state?.activity?.map(item => (
                <Box mt="l">
                  <ActivitiesUpcoming showGoing={true} data={item} />
                </Box>
              ))} */}
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};
