import React, {memo, useMemo, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Header} from '../../../ReusableComponents';
import {EntypoIcon, Ionicon} from '../../../ReusableComponents/Icons';
import {Box, fonts, palette, Text, TouchableBox} from '../../../Theme/Index';
import {Alert, ScrollView} from 'react-native';
import styles from './style';
import {Button} from '../../../ReusableComponents';
import moment from 'moment';
import {
  getStatusEnum,
  getSkillEnum,
  selectAgePrice,
} from '../../../Helpers/Enums';
import CancelActivityModal from '../../../ReusableComponents/Modals/CancelActivityModal';
import {getSportComplex} from '../../../Services/SportComplex';
import {useMutation, useQuery} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import {
  attachBooking,
  getSingleActivity,
  markFullActivity,
} from '../../../Services/Booking';
import authStore from '../../../../Zustand/store';
import {goingUser} from '../../../Helpers/HelperFunctions';

const HostActivityDetail = props => {
  const {navigation, route} = props;
  // const {vanue} = route?.params;
  const setVanue = authStore(state => state?.setVanue);
  const {vanue} = authStore(state => state?.vanue);

  const [sportcomplex, setSportcomplex] = useState(null);
  const [selectBooking, setSelectBooking] = useState(
    vanue?.location?.booking_id || '',
  );
  const [booking, setBooking] = useState([]);

  const Data = useMemo(
    () => [
      {
        name: 'Add Co-host',
        icon: Images?.AddcoHost,
        screen: 'AddCoHost',
      },
      {
        name: 'Reserve Slot',
        icon: Images?.Reserveslot,
        screen: 'ReserveSlot',
      },
      {
        name: 'Manage Players',
        icon: Images?.Manageplayer,
        screen: 'RSVP',
      },
    ],
    [],
  );

  const Book = () => {
    navigation.navigate('SelectBookingForActivity', {
      onPress: OnSelect,
      sel: selectBooking,
      date: vanue?.date,
    });
  };

  const OnSelect = data => {
    if (!data) {
      displayErrorToast('you have not selected any bookings');
      return;
    }
    mutate({id: vanue?.id, booking_id: data});
  };

  /**
   * @function attachBooking
   * @param body
   * @description this api will attach the selected booking to activity
   */

  const {mutate} = useMutation('attachBooking', attachBooking, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  /**
   * @function getList
   * @param body
   * @description this will call the getSportComplex api with search keyword
   */

  const payload = {
    start: 0,
    length: 1,
    search: vanue?.location?.sports_complex?.name,

    order: [
      {
        column: 0,
        dir: 'asc',
      },
    ],
    // category_id: vanue?.setting?.category_id,
    loc_lat: vanue?.location?.sports_complex?.location_lat,
    loc_long: vanue?.location?.sports_complex?.location_long,
    state: vanue?.location?.sports_complex?.info?.state,
    city: vanue?.location?.sports_complex?.info?.city,
  };

  const getList = useQuery(['getSportComplex', payload], getSportComplex, {
    enabled: false,
    onSuccess: result => {
      if (result?.data?.data?.length > 0)
        navigation.navigate('VenuInfo', {
          vanue: result?.data?.data[0],
        });
      else displayErrorToast('There is no any complex on this address');
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  const Bookn = () => {
    getList?.refetch();
  };

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getActivity = useQuery(
    ['getSingleActivity', vanue?.id],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        setVanue({
          vanue: data?.data,
        });
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  return (
    <Box flex={1}>
      <Box flex={1} m="l" overFlow="hidden">
        <ScrollView
          style={{flex: 1, marginBottom: 60}}
          contentContainerStyle={{
            paddingBottom: wp(10),
          }}>
          <Box flexDirection="row" alignItems="center">
            <FastImage
              source={Images?.Calender}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Text variant="blackshade16500">
              {moment(vanue?.date)?.format('DD MMM, ')}
              {moment(vanue?.start, 'hh:mm')?.format('LT')}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" mt="t">
            <FastImage
              source={Images?.Time}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Text variant="blackshade16500">
              {moment(vanue?.start, 'hh:mm')?.format('LT')} -{' '}
              {moment(vanue?.end, 'hh:mm')?.format('LT')}
            </Text>
          </Box>

          <Box flexDirection="row" mt="t">
            <FastImage
              source={Images?.Location}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Box
              flexDirection="column"
              style={{marginTop: wp(-1)}}
              width={wp(80)}>
              <Text variant="blackshade16500">
                {vanue?.location?.sports_complex?.name ||
                  vanue?.location?.address}
              </Text>
              {!vanue?.location?.address && (
                <Text variant="blackshade114400" mt="s">
                  {vanue?.location?.sports_complex?.info?.address}
                </Text>
              )}
              <Box flexDirection="row" alignItems="center" mt="s">
                {Ionicon(
                  'ellipsis-horizontal-circle-sharp',
                  wp(5),
                  palette?.blackshade,
                )}
                <Text variant="blackshade14500" ml="s">
                  Court {getStatusEnum(vanue?.location?.status)?.name}
                </Text>
              </Box>
              <Box height={1} backgroundColor="tertiary2" marginVertical="m" />
              {!vanue?.cancelled_at && !vanue?.setting?.is_marked_full && (
                <Box
                  // width={wp(100) - 30}
                  // position={'absolute'}
                  // bottom={wp(4)}
                  flexDirection="row"
                  // justifyContent={'space-between'}
                  alignItems="center">
                  {vanue?.location?.status == 2 && (
                    <Button
                      onPress={() => Bookn()}
                      label={'Book Now'}
                      buttonStyle={{
                        height: wp(10),
                        width: wp(50) / 2,
                        borderRadius: wp(2),
                      }}
                      textStyle={{
                        color: 'white',
                        fontSize: 14,
                        fontFamily: fonts.medium,
                        fontWeight: '500',
                      }}
                    />
                  )}
                  <Button
                    onPress={Book}
                    label={'Booked'}
                    buttonColor="#fafafa"
                    textStyle={{
                      color: 'black',
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      fontWeight: '500',
                    }}
                    buttonStyle={{
                      height: wp(10),
                      width: wp(50) / 2,
                      marginLeft: wp(3),
                      borderWidth: 1,
                      borderColor: palette?.primary,
                      borderRadius: wp(2),
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          <Box>
            <Box
              flexDirection="row"
              alignItems={
                vanue?.payment?.different_pricing?.length == 0
                  ? 'center'
                  : 'flex-start'
              }
              mt="t">
              <FastImage
                source={Images?.Dollar}
                style={{
                  height: wp(5),
                  width: wp(5),
                  marginRight: wp(2),
                }}
              />

              {vanue?.payment?.payment_type == 3 ? (
                <Text variant="blackshade16500">
                  Pay by Wallet :{' '}
                  {vanue?.payment?.different_pricing?.length == 0 ? (
                    'RM ' + vanue?.payment?.fair_price?.toFixed(2) + '/ per'
                  ) : (
                    <Box
                      style={{
                        paddingTop: 3,
                      }}></Box>
                  )}
                </Text>
              ) : vanue?.payment?.payment_type == 2 ? (
                <Text variant="blackshade16500">
                  Pay by Cash : RM{vanue?.payment?.fair_price?.toFixed(2)}
                  /person
                </Text>
              ) : (
                <Text variant="blackshade16500">Free Activity</Text>
              )}
              {/* <FastImage
                source={Images?.Info}
                resizeMode={FastImage?.resizeMode?.contain}
                style={{height: wp(4.5), width: wp(4.5), marginLeft: wp(2)}}
              /> */}
            </Box>
            <Box style={{marginLeft: wp(7)}} mt="s">
              {vanue?.payment?.different_pricing?.length > 0 && (
                <Box
                  style={{
                    paddingTop: 3,
                  }}>
                  {vanue?.payment?.different_pricing?.map(i => {
                    return (
                      <Text variant="blackshade14500">
                        RM{parseFloat(i?.price)?.toFixed(2)} / per{' '}
                        {selectAgePrice(i?.age, i?.gender)?.name}
                      </Text>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>

          {vanue?.payment?.refund_hours != 0 &&
            vanue?.payment?.payment_type == 3 && (
              <Text
                mt="m"
                mb="sm"
                variant="blackshade16500"
                style={{
                  marginLeft: wp(7),
                }}>
                Full refund before : {vanue?.payment?.refund_hours} hours
                pre-game
              </Text>
            )}
          <Box flexDirection="row" mt="t">
            <FastImage
              source={Images?.Prejoin}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Box
              flexDirection="column"
              style={{
                marginTop: wp(-1),
              }}>
              <Box flexDirection="row" alignItems="center">
                <Box borderWidth={1} p="s" borderRadius={5} mr="m">
                  <Text variant="blackshade16500">
                    {goingUser(
                      vanue?.users?.filter(item => item?.request_type == 4),
                    ) || 0}
                    /{vanue?.setting?.maximum_players}
                  </Text>
                </Box>
                <Text variant="blackshade16400">
                  {parseInt(vanue?.setting?.maximum_players) -
                    parseInt(
                      goingUser(
                        vanue?.users?.filter(item => item?.request_type == 4),
                      ),
                    )}{' '}
                  more Player needed
                </Text>
              </Box>
              <Box flexDirection="row" mt="m" mb="s">
                {vanue?.users.map((item, index) => {
                  if (item?.request_type == 4)
                    return (
                      <FastImage
                        source={
                          item?.user?.image
                            ? {uri: item?.user?.image}
                            : Images?.Profile
                        }
                        style={{
                          height: wp(10),
                          width: wp(10),
                          left: index > 0 ? index * -8 : 0,
                          borderRadius: wp(5),
                        }}
                      />
                    );
                })}
              </Box>
              <Box marginHoriozontal="l" marginVertical="m">
                <Text variant="blackshade16500">Host Details</Text>
                <Box flexDirection="row" mt="m" alignItems="center">
                  <FastImage
                    source={
                      vanue?.user?.image
                        ? {uri: vanue?.user?.image}
                        : Images?.Profile
                    }
                    style={{
                      height: wp(14),
                      width: wp(14),
                      borderRadius: wp(7),
                    }}
                  />
                  <Box ml="m">
                    <Text variant="blackshade16800">
                      {vanue?.user?.full_name}
                    </Text>
                    <Text variant="support412600">
                      +60 {vanue?.user?.phone}
                    </Text>
                  </Box>
                </Box>
              </Box>
              <Box mt="m" mb="s" width={wp(80)}>
                <Text variant="blackshade14500">
                  Game skill : {getSkillEnum(vanue?.setting?.game_skill)?.name}
                </Text>
              </Box>
              <Box height={1} backgroundColor="tertiary2" marginVertical="m" />
              {!vanue?.cancelled_at &&
                !vanue?.setting?.is_marked_full &&
                Data?.map(item => {
                  return (
                    <TouchableBox
                      onPress={() =>
                        navigation?.navigate(item?.screen, {vanue})
                      }>
                      <Box flexDirection="row" alignItems="center" mt="s">
                        <FastImage
                          source={item?.icon}
                          style={{
                            height: wp(5),
                            width: wp(5),
                          }}
                          resizeMode="contain"
                        />
                        <Text
                          variant="blackshade16400"
                          ml="l"
                          style={{textDecorationLine: 'underline'}}>
                          {item?.name}
                        </Text>
                      </Box>
                    </TouchableBox>
                  );
                })}
            </Box>
          </Box>

          <Box flexDirection="row" mt="t">
            <FastImage
              source={Images?.CenterPolicy}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Box flexDirection="column" width={wp(80)}>
              <Text variant="blackshade16500">Other Instructions:</Text>
              {vanue?.setting?.is_bring_own_equipment && (
                <Text variant="blackshade14400">Bring your own equipment</Text>
              )}
              <Text variant="blackshade14400">
                {vanue?.setting?.additional_information}
              </Text>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default memo(HostActivityDetail);
