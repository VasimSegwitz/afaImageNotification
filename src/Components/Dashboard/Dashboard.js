import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, StatusBar, Platform} from 'react-native';
import authStore from '../../Zustand/store';
import theme, {
  Box,
  os,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
  fonts,
  size,
} from '../Theme/Index';
import Banner from './Banner/Banner';
import Profile from '../Profile/Profile';
import Categories from './Categories/Categories';
import {wp} from '../Helpers/responsive-ratio';
import FastImage from 'react-native-fast-image';
const Notification = require('../../assets/Home/Notification/Notification.png');
const User = require('../../assets/Home/User/User.png');
import ActivitiesUpcoming from './ActivitiesUpcoming/ActivitiesUpcoming';
import Search from './Search/Search';
import DealOfWeek from './DealOfWeek/DealOfWeek';
import ActivitiesNearYou from './ActivitiesNearYou/ActivitiesNearYou';
import GroupsNearYou from './GroupsNearYou/GroupsNearYou';
import VenuesNearYou from './VenuesNearYou/VenuesNearYou';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation, useQuery} from 'react-query';
import {getActivity, udpateFcm} from '../Services/ProfileApi';
import {Ionicon} from '../ReusableComponents/Icons';
import Tooltip from '../ReusableComponents/tooltip/src/tooltip';
import {Button} from '../ReusableComponents';
import ToolTipContent from '../ReusableComponents/ToolTipContent';
import {Images} from '../../Constant/Image';
import {useFocusEffect} from '@react-navigation/native';
import {displayErrorToast, displaySuccessToast} from '../../utils';
import {AuthConstants} from '../../Redux';
const ActivityOpening = require('../../assets/lottie/burst1.json');
import {getSearchActivity} from '../Services/Booking';
import LottieView from 'lottie-react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';

export default ({navigation, route}) => {
  const setToken = authStore(state => state?.setToken);
  const setTooltip = authStore(state => state?.setTooltip);
  const tooltipData = authStore(state => state.tooltip?.tooltip);
  const locati = useSelector(state => state?.auth?.user?.user?.data?.user_info);
  const fcmTok = authStore(state => state?.fcmToken);

  const {first_name, image, last_name, fcm_token, id} = useSelector(
    state => state?.auth?.user?.user?.data,
  );

  // const locati = useSelector(state => state?.auth?.user?.user?.data?.user_info);

  const checkMarkRef = useRef(null);

  const userData = useSelector(state => state?.auth?.user?.user?.data);

  const loc = useSelector(state => state?.auth?.user?.userlocation);

  const [location, setLocation] = useState((loc && loc?.name) || '');
  const [list, setlist] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (fcm_token == null || fcm_token == '' || fcm_token == 'test') {
        const d = fcmTok?.hasOwnProperty('fcmToken')
          ? fcmTok?.fcmToken
          : fcmTok;
        if (d)
          updateFCM?.mutate({
            fcm_token: d,
          });
      }
    }, []),
  );

  useEffect(() => {
    setTimeout(() => {
      if (tooltipData?.search && tooltipData.second && !tooltipData.wallet) {
        setDealOpen(true);
      }
    }, 500);
  }, [tooltipData]);

  const body = {
    start_date: moment().format('DD-MM-YYYY'),
    end_date: moment().add(6, 'days')?.format('DD-MM-YYYY'),

    // date: '01-07-2023',
    category_id: '',
    location_lat: loc && loc?.location_lat,
    location_long: loc && loc?.location_long,
    order_by: null,
    search: null,
    per_page: 6,
    page: 1,
  };

  /**
   * @function getList
   * @param body
   * @description this will call the getSportComplex api with search keyword
   */

  const getList = useQuery(['getSearchActivity', body], getSearchActivity, {
    // keepPreviousData: true,
    enabled: false,
    onSuccess: result => {
      if (result?.data?.data) setlist(result?.data?.data);
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

  const dispatch = useDispatch();
  const updateFCM = useMutation('udpateFcm', udpateFcm, {
    onSuccess: data => {
      if (!data?.success) {
        // displayErrorToast(data?.errorMessage || 'Something went wrong');
      }
      if (data?.success) {
        const d = {data: {...userData, fcm_token: data?.data?.fcm_token}};

        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: d,
        });
        // displaySuccessToast('Profile Image Uploaded');
      }
    },
  });

  useEffect(() => {
    var g = loc?.name.split(',');
    const l = g?.length && g.splice(-3).join(',');
    setLocation(l);
  }, [loc]);

  const initialActivityState = {transaction_data: []};
  const [activity, setActivity] = useState(initialActivityState);
  const [soon, setSoon] = useState(false);
  const [ActOpen, setActOpen] = useState(false);
  const [DealOpen, setDealOpen] = useState(false);
  const [bannerPopUp, setBannerPopUp] = useState(false);

  const reqBody = {status: 1, per_page: 2, page: 1};

  const [vanu, setVanu] = useState('');

  /**
   * @function changeLocation
   * @param item
   * @description this function set the location
   */

  const changeLocation = item => {
    var g = item?.split(',');

    const l = g?.length && g.splice(-3).join(',');
    setLocation(l);
  };

  useEffect(() => {
    getList?.refetch();
  }, [loc?.location_lat]);

  /**
   * @function changeVanue
   * @param item
   * @description this function set the location
   */

  const changeVanue = item => {
    setVanu(item);
  };

  const handleActivityShowMore = () => navigation.navigate('MyActivity');
  const handleNotification = () => navigation.navigate('Notification');

  const [firstSearch, setFirstsearch] = useState(false);

  useEffect(() => {
    if (!tooltipData?.search) {
      setTimeout(() => {
        setFirstsearch(true);
      }, 1000);
    }
  }, [tooltipData]);

  const handleVenueShowmore = () => navigation.navigate('Venue');
  const handleactShowmore = () => navigation.navigate('ActivitySearch');

  return (
    <Box
      flex={1}
      backgroundColor={theme?.colors?.white}
      justifyContent="center"
      style={{
        paddingTop: route?.params?.space?.top,
        paddingBottom:
          route?.params?.space?.bottom == 0
            ? Platform.OS === 'android'
              ? 20
              : 0
            : Platform.OS === 'android'
            ? route?.params?.space?.bottom
            : 0,
      }}>
      {bannerPopUp && (
        <TouchableBox
          style={{
            position: 'absolute',
            // flex: 1,
            top: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: palette.overlay,
            height: '100%',
            width: '100%',
            zIndex: 1,
          }}
          onPress={() => setBannerPopUp(false)}
        />
      )}
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <Banner setBannerPopUp={setBannerPopUp} />
        <Box
          backgroundColor="white"
          flexGrow={1}
          top={-37}
          borderTopLeftRadius={20}
          borderTopRightRadius={20}>
          <Box flexDirection={'row'} mt="l" marginHorizontal="l">
            <TouchableBox onPress={() => navigation?.navigate('Profile')}>
              <Box height={wp(10)} width={wp(10)} borderRadius={wp(5)}>
                <FastImage
                  source={image ? {uri: image} : Images?.Profile}
                  style={{
                    height: wp(10),
                    width: wp(10),
                    borderRadius: wp(5),
                  }}
                  resizeMode={FastImage?.resizeMode?.cover}
                />
              </Box>
            </TouchableBox>
            <Box
              flex={1}
              alignItems="center"
              flexDirection="row"
              ml="m"
              justifyContent="space-between">
              <Box flex={0.9}>
                <Text variant="blackshade16400">Hi {first_name || ''}!</Text>
                <TouchableBox
                  onPress={() =>
                    navigation?.navigate('ChangeLocation', {
                      setLocation: changeLocation,
                    })
                  }>
                  <Box flexDirection={'row'} left={-3} mt="vs">
                    <FastImage
                      source={Images.markerLocation}
                      style={{height: 18, width: 18}}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />
                    <Text variant="blackshade12400" style={{width: wp(62)}}>
                      {location}
                    </Text>
                  </Box>
                </TouchableBox>
              </Box>
              <TouchableBox flex={0.1} onPress={handleNotification}>
                <FastImage
                  source={Notification}
                  style={{
                    height: wp(10),
                    width: wp(10),
                  }}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
              </TouchableBox>
            </Box>
          </Box>

          <TouchableBox
            mt="l"
            marginHorizontal={'l'}
            style={TypographyStyles?.cardShadow}
            backgroundColor={location ? 'white' : 'primary2'}
            borderRadius={10}
            onPress={() => {
              !tooltipData?.search
                ? setFirstsearch(true)
                : navigation?.navigate('DashboardSearch', {
                    setLocation: changeVanue,
                  });
            }}>
            {vanu ? (
              <Box
                flexDirection="row"
                justifyContent={'space-between'}
                p="s"
                style={{
                  minHeight: wp(10),
                  marginLeft: 10,
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Box width={wp(78)}>
                  <Text textTransform="uppercase" numberOfLines={2}>
                    {vanu?.name}
                  </Text>
                </Box>

                <Box mr="mt">{Ionicon('close', 20, palette?.blackshade)}</Box>
              </Box>
            ) : (
              <Tooltip
                isVisible={firstSearch}
                topAdjustment={
                  Platform?.OS == 'android' ? -StatusBar?.currentHeight : 0
                }
                contentStyle={{
                  borderRadius: 10,
                }}
                content={
                  <ToolTipContent
                    circleArray={[true, false, false]}
                    title="Find a venue"
                    onPress={() => {
                      setFirstsearch(false);
                      setTooltip({
                        tooltip: {
                          search: true,
                        },
                      });
                    }}
                    noclose
                    detail="A quick and easy way to find available Venues"
                  />
                }
                placement="top"
                childrenWrapperStyle={{
                  backgroundColor: 'transparent',
                }}
                onClose={() => {
                  setFirstsearch(false);
                  setTooltip({
                    tooltip: {
                      search: true,
                    },
                  });
                }}>
                <Box pointerEvents="none" width="100%">
                  <Search />
                </Box>
              </Tooltip>
            )}
          </TouchableBox>

          <Box marginHorizontal={'l'} mt="l">
            <Categories
              navigation={navigation}
              setSoon={setSoon}
              setActOpen={() => {
                navigation?.navigate('ActivitySearch');
              }}
              setTooltip={setTooltip}
              searchDone={firstSearch}
              tooltipData={tooltipData}
            />
          </Box>
          <Box mt="l">
            <Box
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              marginHorizontal={'l'}>
              <Text variant="blackshade18Medium">Venues Near You</Text>
              <TouchableBox onPress={handleVenueShowmore}>
                <Text variant="primary12Regular">Show more</Text>
              </TouchableBox>
            </Box>
            <Box>
              <VenuesNearYou is_profile={true} />
            </Box>
          </Box>
          <Box mt="l">
            <Box
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              paddingHorizontal={'l'}>
              <Text variant="blackshade18Medium">Activities Near You</Text>
              <TouchableBox onPress={handleactShowmore}>
                <Text variant="primary12Regular">Show more</Text>
              </TouchableBox>
            </Box>
            <Box mt="m" paddingHorizontal={'l'}>
              {list?.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {list?.map(item => {
                    return (
                      <ActivitiesUpcoming
                        showGoing={true}
                        is_dashboard={true}
                        data={item}
                      />
                    );
                  })}
                </ScrollView>
              ) : (
                <Box
                  width={'100%'}
                  minHeight={180}
                  borderRadius={15}
                  style={TypographyStyles?.cardShadow}
                  mt="l"
                  backgroundColor="white"
                  justifyContent="center"
                  alignItems="center">
                  <Text textAlign={'center'} variant="blackshade16500">
                    {getList?.isRefetching
                      ? 'Loading...'
                      : 'No Activity Nearby'}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </ScrollView>
      {soon && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          style={[
            {
              backgroundColor: 'white',
              flex: 1,

              padding: 20,
            },
            styles.confirmationModal,
            TypographyStyles.cardShadow,
          ]}>
          <Box justifyContent={'center'} alignItems={'center'}>
            <Text variant={'blackshade20500'} textAlign={'center'} mt={'l'}>
              Still warming up...
            </Text>
            <FastImage
              source={Images.AFAC}
              style={{
                height: wp(15),
                width: wp(15),
                marginVertical: wp(5),
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text variant={'blackshade16400'} textAlign={'center'}>
              This feature will be ready to play real soon!
            </Text>
          </Box>
          <Box mt={'l'} mb={'m'}>
            <Button label="Ok" onPress={() => setSoon(false)} />
          </Box>
        </Animated.View>
      )}

      {bannerPopUp && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutDown}
          style={[
            TypographyStyles.cardShadow,
            TypographyStyles.container,
            {
              backgroundColor: 'white',
              position: 'absolute',
              left: 0,
              right: 0,
              top: wp(15),
              marginHorizontal: wp(4),
              borderRadius: 10,
              zIndex: 1,
              height: size.height - wp(40),
            },
          ]}>
          <TouchableBox
            mt={'s'}
            mr={'s'}
            p={'s'}
            alignItems={'flex-end'}
            onPress={() => setBannerPopUp(false)}>
            {Ionicon('close', wp(7), palette?.blackshade)}
          </TouchableBox>
          <ScrollView showsVerticalScrollIndicator>
            <Box p={'l'}>
              <Text mb={'m'} variant={'blackshade16400'}>
                AFA Pay Promo - Top up RM200 on AFA Pay and get an RM20 cash
                voucher in return!
              </Text>
              <Text mb={'m'} variant={'blackshade16400'} fontWeight={'bold'}>
                Terms & Conditions:
              </Text>
              <Text mb={'m'} variant={'blackshade16400'}>
                - Promo runs from 21 March 2023 to 30 June 2023, unless AFA
                states otherwise.
              </Text>
              <Text mb={'m'} variant={'blackshade16400'}>
                - Valid once a month for AFA App registered users who top up
                using AFA Wallet with recognised ID, phone number, and payment
                platform.
              </Text>
              <Text mb={'m'} variant={'blackshade16400'}>
                - RM20 voucher is non-refundable and cannot be redeemed for
                cash.
              </Text>
              <Text mb={'m'} variant={'blackshade16400'}>
                - Vouchers and points are not exchangeable for cash outside of
                AFA App.
              </Text>
              <Text mb={'m'} variant={'blackshade16400'}>
                - AFA may modify, suspend, cancel or terminate the promo due to
                non-authorized human intervention, virus, fraud, or other causes
                beyond their control.
              </Text>
              <Text mb={'m'} variant={'blackshade16400'}>
                - AFA has the right to disqualify violators of the terms and
                conditions.
              </Text>
            </Box>
          </ScrollView>
        </Animated.View>
      )}
      {DealOpen && (
        <Animated.View
          entering={SlideInUp}
          exiting={FadeOutDown}
          style={[
            {
              height: size.height / 1.7,
              flex: 1,
              padding: 20,
              backgroundColor: 'white',
            },
            styles.confirmationModal,
            TypographyStyles.cardShadow,
          ]}>
          <ScrollView contentContainerStyle={{flexGrow: 1, marginBottom: 15}}>
            <Box
              justifyContent="center"
              alignItems="center"
              position="absolute"
              top={0}
              bottom={30}
              left={0}
              right={0}>
              <LottieView
                ref={checkMarkRef}
                source={ActivityOpening}
                autoPlay={true}
                loop={false}
                style={{
                  height: wp(100),
                  width: wp(150),
                }}
              />
            </Box>

            <Box justifyContent={'center'} alignItems={'center'}>
              <Text
                variant={'blackshade20500'}
                textAlign={'center'}
                mt={'l'}
                fontWeight="600">
                Attention, Athletes!
              </Text>

              <Text
                variant={'blackshade16400'}
                textAlign={'center'}
                mt="l"
                fontWeight="500">
                New updates!
              </Text>
              <Text
                variant={'blackshade16400'}
                textAlign={'center'}
                mt="l"
                fontWeight="500">
                Comment in Activities! Now you have the ability to COMMENT
                within activities, making communication easier and more
                interactive than ever!
              </Text>
              <Text
                variant={'blackshade16400'}
                textAlign={'center'}
                mt="m"
                fontWeight="500">
                - - - - - - - - - - - - - - -
              </Text>
              <Text
                variant={'blackshade16400'}
                textAlign={'center'}
                mt="s"
                fontWeight="500">
                The moment you ve all been waiting for has arrived! You can now
                exchange your AFA points for Booking Vouchers worth up to
                RM150.00:
              </Text>
              <Text
                variant={'blackshade16400'}
                textAlign={'center'}
                fontWeight="500">
                Profile -> Points -› My Rewards
              </Text>
            </Box>
          </ScrollView>
          <Box mt={'l'} mb={'m'}>
            <Button
              label="Ok"
              onPress={() => {
                setDealOpen(false);
              }}
            />
          </Box>
        </Animated.View>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  confirmationModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'center',
    marginHorizontal: wp(4),
    borderRadius: 15,
  },
});
