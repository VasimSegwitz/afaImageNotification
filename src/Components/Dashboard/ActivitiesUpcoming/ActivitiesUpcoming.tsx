import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, FlatList} from 'react-native';
import theme, {
  Box,
  Text,
  TouchableBox,
  TypographyStyles,
  palette,
  fonts,
} from '../../Theme/Index';
const badminton = require('../../../assets/Home/badminton/badminton.png');
const Save = require('../../../assets/Home/Save/Save.png');
const Time = require('../../../assets/Home/Time/Time.png');
const User = require('../../../assets/Home/User/User.png');
const Location = require('../../../assets/Home/Location/Location.png');
const Dollar = require('../../../assets/Home/Dollar/Dollar.png');
const Calender = require('../../../assets/Home/Calender/Calender.png');

import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import moment from 'moment';
import {getSkillEnum, getStatusEnum} from '../../Helpers/Enums';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getSingleActivity} from '../../Services/Booking';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {useMutation, useQuery} from 'react-query';
import {Ionicon} from '../../ReusableComponents/Icons';
import authStore from '../../../Zustand/store';
import {
  AddtoWishlist,
  GetWishlist,
  RemovetoWishlist,
} from '../../Services/WishlistApi';
import {FontistoIcon} from '../../ReusableComponents/Icons';
import {BookingConstants} from '../../../Redux';
import {Images} from '../../../Constant/Image';
import {goingUser} from '../../Helpers/HelperFunctions';
import {LoadingOverlay} from '../../ReusableComponents';

const ActivitiesUpcoming = ({
  showGoing,
  data,
  setSelWishlist,
  selWishlist,
  from,
  onRemove,
  search,
  is_dashboard = false,
}) => {
  const {user} = useSelector(state => state?.auth?.user);

  const navigation = useNavigation();
  // const {category} = useSelector(state => state?.book?.booking);

  // const setWish = authStore(state => state?.setWish);
  const {recentSearch} = useSelector(state => state?.book?.booking);

  const dispatch = useDispatch();

  const Fulled =
    goingUser(data?.users?.filter(item => item?.request_type == 4)) >=
      data?.setting?.maximum_players || data?.setting?.is_marked_full;

  let canComment = false;
  const commentUsage = data?.users?.filter(item => item?.request_type == 4);
  if (commentUsage.length > 0) {
    commentUsage.filter(i => {
      if (i.user_id == user?.data?.id) {
        canComment = true;
      }
    });
  }

  const {wishData, category} = useSelector(state => state?.book?.booking);

  const setVanue = authStore(state => state?.setVanue);
  const setlink = authStore(state => state?.setlink);

  const [ids, setId] = useState(null);
  const [selected, setSelected] = useState(
    data?.is_withlisted && wishData && wishData?.some(i => i == data?.id)
      ? true
      : from == 'wishlist'
      ? true
      : false,
  );

  const {first_name, image, address, id} = useSelector(
    state => state?.auth?.user?.user?.data,
  );

  const ishost =
    data?.user?.id === id || data?.co_hosts?.some(i => i?.user_id == id);

  var DateofVanue = moment(data?.date + ' ' + data?.start);

  const tod = moment();

  var passed = DateofVanue?.isAfter(tod);
  const isHostView = data?.user?.first_name === first_name;
  const page = isHostView ? 'ActivityHost' : 'ActivityPage';

  const getActivity = useQuery(
    ['getSingleActivity', ids],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        if (data?.data?.success == 0) {
          displayErrorToast(data?.data?.message);
          return;
        }
        setId(null);
        setVanue({
          vanue: data?.data,
        });

        setlink({
          is_link: false,
        });

        // const ishost =
        // data?.data?.user?.first_name === first_name ||
        // data?.data?.co_hosts?.some(i => i?.user_id == id);

        const p = data?.data?.completed_at
          ? 'ActivityPage'
          : ishost
          ? 'ActivityHost'
          : 'ActivityPage';

        navigation?.navigate(p, {
          vanue: data?.data,
          coHost: data?.data?.user?.first_name === first_name,
        });
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  useFocusEffect(
    useCallback(() => {
      if (wishData?.length > 0 && wishData?.some(i => i == data?.id))
        setSelected(
          wishData && wishData?.some(i => i == data?.id)
            ? true
            : from == 'wishlist'
            ? true
            : false,
        );
      else
        setSelected(
          data?.is_withlisted ? true : from == 'wishlist' ? true : false,
        );
    }, [wishData]),
  );

  useEffect(() => {
    if (ids) getActivity?.refetch();
  }, [ids]);

  const onSubmit = id => {
    // if (!passed) {
    //   displayErrorToast(`This Activity is not more Active`);
    //   return;
    // }

    if (from == 'searchActivity') {
      dispatch({
        type: BookingConstants?.RECENTSEARCH,
        recentSearch: [...recentSearch, search],
      });
    }
    setId(id);
  };

  /**
   * @function AddWishlist
   * @param ActivityId
   * @description this will add to wishlist api
   */

  const AddWishlist = id => {
    var d = wishData || [];

    let p = d?.push(id);

    dispatch({
      type: BookingConstants?.WISHLISTDATA,
      wishData: d,
    });

    mutate(id);
    // setSelected(!selected);
  };

  /**
   * @function mutate
   * @description this function will call the createActivity api
   */

  const {mutate} = useMutation('AddtoWishlist', AddtoWishlist, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || `can't reserve slot now`);
      } else {
        displaySuccessToast(data?.message || 'Added to wishlist');
        setSelected(!selected);
      }
    },
    onError: data => {
      displayErrorToast(data?.data?.message);
    },
  });

  /**
   * @function removeWislist
   * @param ActivityId
   * @description this will add to wishlist api
   */

  const removeWislist = id => {
    var d = wishData?.length > 0 ? wishData : [id];

    const index = d.indexOf(id);

    const x = d.splice(index, 1);

    dispatch({
      type: BookingConstants?.WISHLISTDATA,
      wishData: d,
    });

    console?.log('wishData', wishData);
    Remove(id);

    // temp?.push(id);

    from == 'wishlist' && onRemove();
  };

  /**
   * @function Remove
   * @description this function will call the createActivity api
   */

  const {mutate: Remove} = useMutation('RemovetoWishlist', RemovetoWishlist, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || `can't reserve slot now`);
      } else {
        displaySuccessToast(data?.message || 'Removed from wishlist');
        setSelected(!selected);
      }
    },
    onError: data => {
      displayErrorToast(data?.data?.message);
    },
  });

  // /**
  //  * @function getWishlistActivity
  //  * @description this function will call the createActivity api
  //  */

  // const getWishlistActivity = useQuery(
  //   ['GetWishlist'],
  //   GetWishlist,

  //   {
  //     // enabled: false,
  //     onSuccess: data => {
  //       if (data?.data?.success == 0) {
  //         displayErrorToast(data?.data?.message);
  //         return;
  //       }
  //     },
  //     onError: error => {
  //       displayErrorToast(error?.data?.message);
  //     },
  //   },
  // );

  // const not_Go = () => {};

  if (is_dashboard)
    return (
      <TouchableBox
        borderRadius={10}
        mr="t"
        mt="m"
        mb="m"
        ml={'vs'}
        width={wp(65)}
        backgroundColor="white"
        disabled={
          from == 'complete'
            ? false
            : data?.cancelled_at !== null
            ? true
            : !passed && !ishost
            ? true
            : Fulled && !ishost
            ? canComment
            : canComment
            ? false
            : true
            ? true
            : false
        }
        style={TypographyStyles.cardShadow}
        onPress={
          () => onSubmit(data?.id)
          // navigation?.navigate(page, {vanue: data})
        } // this is correct flow
      >
        {getActivity?.isRefetching ? <LoadingOverlay /> : null}
        <Box
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row">
          <Box flexDirection="row" ml="m" mt="m" alignItems="center">
            <FastImage
              source={
                data?.setting?.category_id && data?.setting?.category
                  ? {
                      uri: data?.setting?.category?.images[0],
                    }
                  : Images?.SportDefault
              }
              style={styles.badImage}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text ml="m" variant="blackshade16800" numberOfLines={1}>
              {data?.setting?.name || 'Not Provided'}
            </Text>
          </Box>
          {/* <TouchableBox
            mr="m"
            onPress={() => {
              selected ? removeWislist(data?.id) : AddWishlist(data?.id);
            }}>
            {Ionicon(
              selected ? 'md-bookmark' : 'md-bookmark-outline',
              20,
              'black',
            )}
          </TouchableBox> */}
        </Box>
        <Box marginHorizontal={'m'}>
          {Fulled ? (
            <Text variant="blackshade112400">
              {getSkillEnum(data?.setting?.game_skill)?.name} • Full • Min{' '}
              {data?.setting?.minimum_players} to start
            </Text>
          ) : (
            <Text variant="blackshade112400" numberOfLines={1}>
              {getSkillEnum(data?.setting?.game_skill)?.name} •{' '}
              {goingUser(
                data?.users?.filter(item => item?.request_type == 4),
              ) || 0}{' '}
              / {data?.setting?.maximum_players} joined • Min{' '}
              {data?.setting?.minimum_players} to start
            </Text>
          )}
        </Box>
        <Box
          backgroundColor="tertiary2"
          marginVertical="m"
          height={1}
          marginHorizontal="m"
        />
        <Box marginHorizontal="m" flex={1} overflow={'hidden'}>
          <Box flexDirection="row">
            <Box alignItems="center" maxWidth={wp(18)}>
              <FastImage
                source={
                  data?.user?.image ? {uri: data?.user?.image} : Images?.Profile
                }
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </Box>
            <Box ml="m" flexDirection="row">
              <Text variant="blackshade12500" textAlign="center">
                {data?.user?.first_name} (Host)
              </Text>
            </Box>
          </Box>
          <Box mt="m">
            <Box flexDirection="row" alignItems="center">
              <FastImage
                source={Time}
                style={styles.dashImage}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="s" variant="blackshade14400" fontSize={12}>
                {moment(data?.date)?.format('DD MMM YYYY, ')}
                {moment(data?.start, 'hh:mm')?.format('LT')}
              </Text>
            </Box>
            <Box flexDirection="row" justifyContent="center">
              <FastImage
                source={Location}
                style={[styles.dashImage, {marginTop: 5}]}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Box flex={1}>
                <Text
                  ml="s"
                  variant="blackshade14400"
                  numberOfLines={data?.location?.sports_complex ? 1 : 2}
                  fontSize={12}>
                  {data?.location?.sports_complex?.name ||
                    data?.location?.address}
                </Text>
                {data?.location?.sports_complex && (
                  <Text
                    ml="s"
                    variant="blackshade112500"
                    fontWeight={'400'}
                    numberOfLines={data?.location?.sports_complex ? 1 : 2}
                    fontFamily={fonts?.regular}>
                    {data?.location?.sports_complex?.info?.city},{' '}
                    {data?.location?.sports_complex?.info?.state},{' '}
                    {data?.location?.sports_complex?.info?.postcode}
                  </Text>
                )}
              </Box>
            </Box>
            <Box
              // flexDirection="row"
              // alignItems="center"
              mt="vs"
              mb="sm"
              justifyContent={'space-between'}>
              <Box flexDirection="row" alignItems="center">
                <FastImage
                  source={Calender}
                  style={styles.dashImage}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                <Text
                  ml="s"
                  variant="blackshade14500"
                  fontSize={12}
                  numberOfLines={1}>
                  Court {getStatusEnum(data?.location?.status)?.name}
                </Text>
              </Box>
              <Box
                // ml="l"
                mt="vs"
                flexDirection="row"
                alignItems="center">
                <FastImage
                  source={Dollar}
                  style={styles.dashImage}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                {data?.payment?.payment_type != 1 ? (
                  <Text
                    numberOfLines={1}
                    ml="s"
                    variant={
                      data?.payment?.different_pricing?.length > 0
                        ? 'blackshade14500'
                        : 'blackshade14500'
                    }
                    fontSize={12}>
                    {data?.payment?.different_pricing?.length == 0
                      ? 'RM ' + data?.payment?.fair_price?.toFixed(2) + '/ pax'
                      : 'Different Price'}
                  </Text>
                ) : (
                  <Text
                    ml="s"
                    variant="blackshade14500"
                    fontSize={12}
                    numberOfLines={1}>
                    Free Activity
                  </Text>
                )}
                {/* <Text ml="s" variant="blackshade14400">
              RM{data?.payment?.fair_price?.toFixed(2)}/pax
            </Text> */}
              </Box>
            </Box>
          </Box>
        </Box>
        {showGoing ? (
          <Box marginHorizontal={'m'} mb="m">
            <TouchableBox
              onPress={() => onSubmit(data?.id)}
              backgroundColor={
                data?.users?.find(item => item?.user_id == id)?.request_type ==
                4
                  ? 'primary'
                  : 'white'
              }
              height={40}
              borderWidth={1}
              disabled={
                from == 'complete'
                  ? false
                  : data?.cancelled_at
                  ? true
                  : !passed && !ishost
                  ? true
                  : Fulled && !ishost
                  ? canComment
                  : canComment
                  ? true
                  : false
              }
              borderColor="primary"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              borderRadius={10}>
              {data?.users?.find(item => item?.user_id == id)?.request_type == 4
                ? Ionicon('ios-checkmark-circle-outline', 20, 'white')
                : null}
              <Text
                variant={
                  data?.users?.find(item => item?.user_id == id)
                    ?.request_type == 4
                    ? 'white14500'
                    : 'blackshade14500'
                }>
                {data?.cancelled_at
                  ? 'Activity Cancelled'
                  : !passed
                  ? 'Session Started'
                  : Fulled
                  ? 'Full'
                  : 'Going'}
              </Text>
            </TouchableBox>
          </Box>
        ) : null}
      </TouchableBox>
    );
  else
    return (
      <TouchableBox
        borderRadius={10}
        backgroundColor="white"
        disabled={
          from == 'complete'
            ? false
            : data?.cancelled_at
            ? true
            : !passed && !ishost
            ? true
            : Fulled && !ishost
            ? true
            : false
        }
        style={TypographyStyles.cardShadow}
        onPress={
          () => onSubmit(data?.id)
          // navigation?.navigate(page, {vanue: data})
        } // this is correct flow
      >
        {getActivity?.isRefetching ? <LoadingOverlay /> : null}
        <Box
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row">
          <Box flexDirection="row" ml="m" mt="m" alignItems="center">
            <FastImage
              source={
                data?.setting?.category_id && data?.setting?.category
                  ? {
                      uri: data?.setting?.category?.images[0],
                    }
                  : Images?.SportDefault
              }
              style={styles.badImage}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text ml="m" variant="blackshade16800">
              {data?.setting?.name || 'Not Provided'}
            </Text>
          </Box>
          <TouchableBox
            mr="m"
            onPress={() => {
              selected ? removeWislist(data?.id) : AddWishlist(data?.id);
            }}>
            {Ionicon(
              selected ? 'md-bookmark' : 'md-bookmark-outline',
              20,
              'black',
            )}
          </TouchableBox>
        </Box>
        <Box marginHorizontal={'m'}>
          {Fulled ? (
            <Text variant="blackshade112500">
              {getSkillEnum(data?.setting?.game_skill)?.name} • Full • Min{' '}
              {data?.setting?.minimum_players} to start
            </Text>
          ) : (
            <Text variant="blackshade112500">
              {getSkillEnum(data?.setting?.game_skill)?.name} •{' '}
              {goingUser(
                data?.users?.filter(item => item?.request_type == 4),
              ) || 0}{' '}
              / {data?.setting?.maximum_players} joined • Min{' '}
              {data?.setting?.minimum_players} to start
            </Text>
          )}
        </Box>
        <Box
          backgroundColor="tertiary2"
          marginVertical="m"
          height={1}
          marginHorizontal="m"
        />
        <Box
          marginHorizontal="m"
          flexDirection="row"
          flex={1}
          overflow={'hidden'}>
          <Box alignItems="center" mt="m" maxWidth={wp(18)}>
            <FastImage
              source={
                data?.user?.image ? {uri: data?.user?.image} : Images?.Profile
              }
              style={styles.userImg}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text variant="blackshade112500" textAlign="center">
              {data?.user?.first_name}
            </Text>
            <Text variant="blackshade112500">(Host)</Text>
          </Box>
          <Box mt="m" ml="m">
            <Box flexDirection="row" alignItems="center">
              <FastImage
                source={Time}
                style={styles.badImage}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="s" variant="blackshade14400">
                {moment(data?.date)?.format('DD MMM YYYY, ')}
                {moment(data?.start, 'hh:mm')?.format('LT')}
              </Text>
            </Box>
            <Box flexDirection="row" justifyContent="center">
              <FastImage
                source={Location}
                style={[styles.badImage, {marginTop: 5}]}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Box flex={1}>
                <Text ml="s" variant="blackshade14400" numberOfLines={2}>
                  {data?.location?.sports_complex?.name ||
                    data?.location?.address}
                </Text>
                {!data?.location?.address && (
                  <Text ml="s" variant="blackshade112500">
                    {data?.location?.sports_complex?.info?.address}
                  </Text>
                )}
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" mt="m" mb="l">
              <Box flexDirection="row" alignItems="center" maxWidth={wp(28)}>
                <FastImage
                  source={Calender}
                  style={styles.badImage}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                <Text ml="s" variant="blackshade14400">
                  Court {getStatusEnum(data?.location?.status)?.name}
                </Text>
              </Box>
              <Box ml="l" flexDirection="row" alignItems="center">
                <FastImage
                  source={Dollar}
                  style={styles.badImage}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                {data?.payment?.payment_type != 1 ? (
                  <Text
                    ml="s"
                    variant={
                      data?.payment?.different_pricing?.length > 0
                        ? 'blackshade14500'
                        : 'blackshade14500'
                    }>
                    {data?.payment?.different_pricing?.length == 0
                      ? 'RM ' + data?.payment?.fair_price?.toFixed(2) + '/ pax'
                      : 'Different Price'}
                  </Text>
                ) : (
                  <Text ml="s" variant="blackshade14500">
                    Free Activity
                  </Text>
                )}
                {/* <Text ml="s" variant="blackshade14400">
                RM{data?.payment?.fair_price?.toFixed(2)}/pax
              </Text> */}
              </Box>
            </Box>
          </Box>
        </Box>
        {showGoing ? (
          <Box marginHorizontal={'m'} mb="m">
            <TouchableBox
              onPress={() => onSubmit(data?.id)}
              backgroundColor={
                data?.users?.find(item => item?.user_id == id)?.request_type ==
                4
                  ? 'primary'
                  : 'white'
              }
              height={40}
              // disabled={!passed}
              borderWidth={1}
              disabled={
                from == 'complete'
                  ? false
                  : data?.cancelled_at
                  ? true
                  : !passed && !ishost
                  ? true
                  : Fulled && !ishost
                  ? true
                  : false
              }
              borderColor="primary"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              borderRadius={10}>
              {data?.users?.find(item => item?.user_id == id)?.request_type == 4
                ? Ionicon('ios-checkmark-circle-outline', 20, 'white')
                : null}
              <Text
                variant={
                  data?.users?.find(item => item?.user_id == id)
                    ?.request_type == 4
                    ? 'white14500'
                    : 'blackshade14500'
                }>
                {data?.cancelled_at
                  ? 'Activity Cancelled'
                  : !passed
                  ? 'Session Started'
                  : Fulled
                  ? 'Full'
                  : 'Going'}
              </Text>
            </TouchableBox>
          </Box>
        ) : null}
      </TouchableBox>
    );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  badImage: {
    height: wp(4),
    width: wp(4),
  },
  dashImage: {
    height: wp(3.7),
    width: wp(3.7),
  },
  saveImg: {
    height: 20,
    width: 20,
  },
  userImg: {
    height: 40,
    width: 40,
  },
});

export default memo(ActivitiesUpcoming);
