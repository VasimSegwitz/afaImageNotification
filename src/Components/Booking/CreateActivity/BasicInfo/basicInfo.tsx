import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Keyboard,
  InteractionManager,
} from 'react-native';
import theme, {
  Box,
  fonts,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import {Header, Button} from '../../../ReusableComponents/index';
import FastImage from 'react-native-fast-image';
import Day from '../../../../assets/Booking/CreateActivity/Day/Day.png';
import Evening from '../../../../assets/Booking/CreateActivity/Evening/Evening.png';
import Morning from '../../../../assets/Booking/CreateActivity/Morning/Morning.png';
import Night from '../../../../assets/Booking/CreateActivity/Night/Night.png';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import BottomModal from '../../../ReusableComponents/Modals/BottomModal';

import {ActivityConstants, AuthConstants} from '../../../../Redux';
import {wp} from '../../../Helpers/responsive-ratio';
import {Images} from '../../../../Constant/Image';
import {Input} from '../../../ReusableComponents/Input';
import {useNavigation} from '@react-navigation/native';
import ActionSheet from '../../../ReusableComponents/ActionSheet';
import {Slider} from '../../../ReusableComponents/Slider';
import {EntypoIcon, Ionicon} from '../../../ReusableComponents/Icons';
import {useMutation} from 'react-query';
import {updateFavouriteSport} from '../../../Services/ProfileApi';
const search = require('../../../../assets/Home/Search/Search.png');

const DATA = [
  {
    id: 1,
    name: 'Morning',
    source: Morning,
    selected: false,
    startTime: '12 am',
    startValue: '00:00',
    endTime: '9 am',
    noSelect: moment().isSameOrAfter(moment(`09:00:00`, 'hh:mm')),
    totalDuration: 9,
  },
  {
    id: 2,
    name: 'Day',
    source: Day,
    selected: false,
    startTime: '9 am',
    startValue: '09:00',

    endTime: '4 pm',
    noSelect: moment().isSameOrAfter(moment(`16:00:00`, 'hh:mm')),
    totalDuration: 7,
  },
  {
    id: 3,
    name: 'Evening',
    source: Evening,
    selected: false,
    startTime: '4 pm',
    startValue: '16:00',

    endTime: '9 pm',
    noSelect: moment().isSameOrAfter(moment(`21:00:00`, 'hh:mm')),
    totalDuration: 5,
  },
  {
    id: 4,
    name: 'Night',
    source: Night,
    selected: false,
    startTime: '9 pm',
    startValue: '21:00',

    endTime: '12 am',
    noSelect: moment().isSameOrAfter(moment(`21:00:00`, 'hh:mm')),
    totalDuration: 3,
  },
];

const genderSelection = [
  {
    label: 'Male',
    value: 1,
  },
  {
    label: 'Female',
    value: 2,
  },
];

const LocationSelect = [
  {
    label: 'Search By Venue',
    value: 1,
  },
  {
    label: 'Search By Location',
    value: 2,
  },
];

const ageSelection = [
  {
    label: 'Adult (19-39 years old)',
    value: 19,
  },
  {
    label: 'Youth (13-18 years old)',
    value: 18,
  },
  {
    label: 'Kids (below 12 years old)',
    value: 12,
  },
  {
    label: 'Veteran (above 40 years old)',
    value: 40,
  },
];

const BasicInfo = props => {
  const {
    setPopup,
    selectDate,
    selectTime,
    startHour,
    startMin,
    endHour,
    endMin,
    setSelectTime,
    details,
    from,
    setStarthour,
    setStartmin,
    setEndhour,
    setEndmin,
    setSelectDate,
    showTime,
    setShowTime,
    amPm,
    setAmPm,
  } = props;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [sutableDataTime, setSutabledataTime] = useState(DATA);
  const [activityType, setActivityType] = useState(0);
  const [mincount, setMinCount] = useState(0);
  const [maxcount, setMaxCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [gameFormat, setGameFormat] = useState(null);
  const [open, setOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLoc, setselectedLoc] = useState('');

  const [fairPricing, setFairPricing] = useState('');
  const [price, setPrice] = useState(false);
  const [DiffPricing, setDiffPricing] = useState([]);
  const [fairPrice, setfairPrice] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [refund, setRefund] = useState(10);

  const clean = useSelector(state => state?.activity?.activity?.clean);

  // useEffect(() => {
  //   setSutabledataTime(DATA);
  //   setActivityType(0);
  //   setMinCount(0);
  //   setMaxCount(0);
  //   setPaymentMethod(0);
  //   setGameFormat(null);
  //   setOpen(false);
  //   setOpenLocation(false);
  //   setselectedLoc('');
  //   setFairPricing('');
  //   setPrice(false);
  //   setDiffPricing([]);
  //   setfairPrice(false);
  //   setActivityName('');
  //   setRefund(10);
  //   setLocation('');

  //   dispatch({
  //     type: AuthConstants?.ANOTHERSPORT,
  //     anothersport: [],
  //   });
  // }, [clean]);

  const user_data = useSelector(
    state => state.auth.user?.user?.data?.favorite_sports,
  );

  const {anothersport} = useSelector(state => state.auth.user);

  const [location, setLocation] = useState('');

  useEffect(() => {
    if (details !== undefined && from === 'Edit') {
      details?.setting?.category &&
        dispatch({
          type: AuthConstants?.ANOTHERSPORT,
          anothersport: [{flag: true, ...details?.setting?.category}],
        });

      dispatch({
        type: ActivityConstants?.ACTIVITYID,
        activityId: details?.id,
      });

      setActivityName(details?.setting?.category ? '' : details?.setting?.name);
      setActivityType(details?.setting?.category ? 1 : 2);
      if (details?.payment) {
        setDiffPricing(
          details?.payment?.different_pricing?.map(item => {
            return {
              age: ageSelection?.find(i => i?.value == item?.age),
              gender: genderSelection?.find(i => i?.value == item?.gender),
              openage: false,
              opengender: false,
              openprice: false,
              price: item?.price,
            };
          }),
        );
        setFairPricing(
          details?.payment?.fair_price
            ? JSON.stringify(details?.payment?.fair_price)
            : '',
        );
        setPaymentMethod(details?.payment?.payment_type);
        setRefund(getRefundValue(details?.payment?.refund_hours));
        setfairPrice(!fairPrice);
      }

      setGameFormat(details?.setting?.game_format);
      setStarthour(details?.start?.split(':')[0]);
      setStartmin(details?.start?.split(':')[1]);
      setEndhour(details?.end?.split(':')[0]);
      setEndmin(details?.end?.split(':')[1]);
      setSelectDate(moment(moment(details?.date, 'YYYY-MM-DD')));

      if (details?.location?.sports_complex !== undefined) {
        if (details?.location?.sports_complex != null)
          setLocation(details.location?.sports_complex);
        else
          setLocation({
            name: details?.location?.address,
            location_lat: details?.location?.lat,
            location_long: details?.location?.long,
          });
      }
      if (details?.setting?.maximum_players !== 0) {
        setMaxCount(details.setting?.maximum_players);
      }
      if (details?.setting?.minimum_players !== 0) {
        setMinCount(details.setting?.minimum_players);
      }
    }
  }, [details]);

  /**
   * @function changeLocation
   * @param item
   * @description this function set the location
   */

  const changeLocation = item => {
    setLocation(item);
  };

  const submitSport = () => {
    var d = [...user_data, anothersport[0]];

    const prev_sport = d?.map(data => data?.category?.id);
    const new_sport = d?.map(data => data?.id);
    const pre_body = [...prev_sport, ...new_sport];
    const body = pre_body.filter(item => !isNaN(parseInt(item)));

    updateFavouriteSportMutation.mutate({favorite_sports: body});
  };

  const updateFavouriteSportMutation = useMutation(
    'updateFavouriteSportMutation',
    updateFavouriteSport,
    {
      onSuccess: data => {
        if (data?.success == 0) return displayErrorToast(data?.message);
        if (data?.success == 1) {
          // getUserProfileQuery.refetch();
          displaySuccessToast('This sport is added to your preferences');

          return;
        }
      },
      onError: error => {
        if (error?.data?.success == 0)
          return displayErrorToast(error?.data?.message);
      },
    },
  );

  /**
   * @function dateDifference
   * @param startDate
   * @param endDate
   * @description this function will find the diffence in time between start and end date
   */

  function dateDifference(startDate, endDate) {
    let temp = moment(endDate).diff(moment(startDate), 'm');
    var hours = temp / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    setSutabledataTime(DATA);
    setSelectTime(
      Math.sign(rhours) == -1 ? '0h 0m' : rhours + 'h ' + rminutes + 'm',
    );
  }

  useEffect(() => {
    duration();
  }, [startHour, startMin, showTime]);

  /**
   * @function duration
   * @description this function will return the duration of start and end time
   */

  const duration = () => {
    let startAM = parseInt(startHour) >= 12 ? 'pm' : 'am';
    let endAM = parseInt(endHour) >= 12 ? 'pm' : 'am';

    var now = moment(
      `${startHour}:${startMin} ${amPm ? 'am' : 'pm'}`,
      'hh:mm a',
    );

    var prev = now.add(showTime, 'hours').format('LT');

    // var duration = moment.duration(prev.diff(now));

    // duration in hours
    // var hours = parseInt(duration.asHours());

    // duration in minutes
    // var minutes = parseInt(duration.asMinutes()) % 60;

    return prev;

    // l = moment
    //   .utc(moment(prev, 'HH:mm a').diff(moment(now, 'HH:mm a')))
    //   .format('H:m');

    setSelectTime(l.split(':')[0] + 'h ' + l.split(':')[1] + 'm');
    // return l.split(':')[0] + 'h ' + l.split(':')[1] + 'm';

    // return dateDifference(now, prev);
  };

  const selectRefund = item => {
    switch (item) {
      case 10:
        return 72;
        break;
      case 20:
        return 48;
        break;
      case 30:
        return 24;
        break;
      case 40:
        return 12;
        break;
      case 50:
        return 0;
        break;
      default:
        break;
    }
  };

  const getRefundValue = item => {
    switch (item) {
      case 72:
        return [10];
        break;
      case 48:
        return [20];
        break;
      case 24:
        return [30];
        break;
      case 12:
        return [40];
        break;
      case 0:
        return [50];
        break;
      default:
        break;
    }
  };

  /**
   * @function onSubmit
   * @description this function will return the duration of start and end time
   */

  const onSubmit = () => {
    // Keyboard?.dismiss();

    const today = moment(selectDate) <= moment();

    var format = `hh:mm a`;

    var beforeTime = moment(
      `${startHour}:${startMin}:00 ${amPm ? 'am' : 'pm'}`,
      format,
    );

    var afterTime = moment(
      `${endHour}:${endMin}:00 ${amPm ? 'am' : 'pm'}`,
      format,
    );

    let time = moment();

    if (startHour == 0) {
      displayErrorToast('Please select the future Date & Time');
      return;
    }

    // let hr = time.split('h')[0];
    // let m = time.split(' ')[1];
    // let min = m.split('m')[0];

    // let d = hr + '.' + (min == 30 ? 5 : min);
    // const numhrs = parseFloat(d);

    if (today && time.isSameOrAfter(beforeTime)) {
      displayErrorToast(
        'The time you have selected has passed. Please select future Date & Time',
      );
      return;
    }

    if (!paymentMethod) {
      displayErrorToast('kindly select the payment option');
      return;
    }

    if (
      fairPricing == '' &&
      (DiffPricing[0]?.gender == '' ||
        DiffPricing[0]?.age == '' ||
        DiffPricing[0]?.price == '')
    ) {
      displayErrorToast('kindly provide the price');
      return;
    }

    if (!user_data?.some(item => item?.category?.id == anothersport[0]?.id))
      submitSport();

    const body = {
      date: moment(selectDate).format('DD-MM-YYYY'),
      start: moment(beforeTime).format('HH:mm'),
      no_of_hours: showTime,
      payment_type: paymentMethod,
      category_id: anothersport[0]?.id,
      booking_id: null,
      sports_complex_id: location?.id,
      address: location?.name,
      fair_price: fairPricing || '',
      name:
        anothersport?.length > 0
          ? `Activity - ${anothersport[0]?.name}`
          : activityName,
      minimum_players: mincount,
      location_lat: location?.location_lat,
      location_long: location?.location_long,
      maximum_players: maxcount,
      game_format: 2,
      refund_hours: selectRefund(refund[0] || refund),
      different_pricing:
        DiffPricing?.length > 0
          ? DiffPricing.map(item => {
              return {
                gender: item?.gender?.value || 1,
                age: item?.age?.value || 1,
                price: item?.price || 0,
              };
            })
          : [],
    };

    dispatch({
      type: ActivityConstants.CREATEACTIVITYBODY,
      body: body,
    });

    setTimeout(() => {
      navigation.navigate('Advanced Settings');
    }, 300);
  };

  const oncloseGender = (e, index) => {
    const arr = [...DiffPricing];
    arr[index].opengender = !arr[index].opengender;
    setDiffPricing(arr);
  };

  const oncloseAge = (e, index) => {
    const arr = [...DiffPricing];
    arr[index].openage = !arr[index].openage;
    setDiffPricing(arr);
  };

  const onChangePrice = (e, index) => {
    const arr = [...DiffPricing];
    arr[index].price = e;
    setDiffPricing(arr);
  };

  const onChangeGender = (e, index) => {
    const arr = [...DiffPricing];
    arr[index].gender = e;
    setDiffPricing(arr);
  };

  const onChangeAge = (e, index) => {
    const arr = [...DiffPricing];
    arr[index].age = e;
    setDiffPricing(arr);
  };

  const onAddList = () => {
    const arr = [...DiffPricing];

    // const uniqueValues = new Set(arr.map(v => v.age && v.gender));

    const a = arr.filter(
      (obj, index) =>
        arr.findIndex(
          item =>
            item.age?.value === obj.age?.value &&
            item?.gender?.value === obj?.gender?.value,
        ) === index,
    );

    if (a?.length < arr?.length) {
      displayErrorToast('You can not add same group');
      return;
    }
    console?.log('uni', a, arr);
    if (
      arr[arr?.length - 1]?.gender == '' ||
      arr[arr?.length - 1]?.age == '' ||
      arr[arr?.length - 1]?.price == ''
    ) {
      displayErrorToast('add the proper details then you can add new');
      return;
    }
    setDiffPricing([
      ...a,
      {
        gender: '',
        age: '',
        price: '',
        opengender: false,
        openage: false,
        openprice: false,
      },
    ]);
  };

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView contentContainerStyle={styles.content}>
        <Box flex={1} mt="l">
          <Box marginHorizontal="l">
            <Text variant="blackshade16600" fontFamily={fonts?.semibold}>
              Activity
            </Text>
          </Box>
          <Box flexDirection={'row'} justifyContent="space-evenly" mt="m">
            <TouchableBox
              onPress={() => {
                setActivityType(1);
                navigation?.navigate('SelectSports', {from: 'booking'});
              }}
              style={[
                TypographyStyles.cardShadow,
                {
                  borderColor:
                    activityType == 1 ? palette?.primary : palette?.white,
                },
              ]}
              backgroundColor="white"
              borderRadius={15}
              height={wp(18)}
              justifyContent="center"
              alignItems={'center'}
              flexDirection={'row'}
              borderWidth={activityType == 1 ? 1 : 0}
              width={wp(42)}>
              <FastImage
                source={
                  anothersport?.length > 0
                    ? {uri: anothersport[0]?.images[0]}
                    : Images?.SportActivity
                }
                style={{
                  height: wp(6),
                  width: wp(6),
                  marginHorizontal: wp(2),
                }}
              />
              <Text variant={'blackshade16400'} fontSize={14}>
                {anothersport?.length > 0
                  ? anothersport[0]?.name
                  : 'Sport game'}
              </Text>
            </TouchableBox>
            <TouchableBox
              onPress={() => {
                dispatch({
                  type: AuthConstants?.ANOTHERSPORT,
                  anothersport: [],
                });
                setActivityType(2);
              }}
              style={[
                TypographyStyles.cardShadow,
                {
                  borderColor:
                    activityType == 2 ? palette?.primary : palette?.white,
                },
              ]}
              backgroundColor="white"
              borderRadius={15}
              height={wp(18)}
              justifyContent="center"
              alignItems={'center'}
              flexDirection={'row'}
              borderWidth={activityType == 2 ? 1 : 0}
              width={wp(42)}>
              <FastImage
                source={Images?.OtherActivity}
                style={{
                  height: wp(6),
                  width: wp(6),
                  marginHorizontal: wp(2),
                }}
              />
              <Text variant={'blackshade16400'} fontSize={14}>
                Other Activity
              </Text>
            </TouchableBox>
          </Box>

          {/* {activityType == 1 ? (
            <Box marginHorizontal="l" marginTop={'l'}>
              <Box flexDirection="row" alignItems="center">
                <Text variant="blackshade16600" fontFamily={fonts?.semibold}>
                  Game Format
                </Text>
                <Text variant="blackshade116500Regular" ml="s">
                  (Optional)
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center" mt={'m'}>
                <TouchableBox
                  onPress={() => setGameFormat(1)}
                  backgroundColor={'white'}
                  p={'m'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  style={[
                    TypographyStyles.cardShadow,
                    {
                      borderRadius: 12,
                      width: wp(18),
                      borderColor:
                        gameFormat == 1 ? palette?.primary : palette?.white,
                    },
                  ]}
                  borderWidth={gameFormat == 1 ? 1 : 0}>
                  <Text variant={'blackshade14400'}>Single</Text>
                </TouchableBox>
                <TouchableBox
                  onPress={() => setGameFormat(2)}
                  backgroundColor={'white'}
                  p={'m'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  ml={'m'}
                  style={[
                    TypographyStyles.cardShadow,
                    {
                      borderRadius: 12,
                      width: wp(20),
                      borderColor:
                        gameFormat == 2 ? palette?.primary : palette?.white,
                    },
                  ]}
                  borderWidth={gameFormat == 2 ? 1 : 0}>
                  <Text variant={'blackshade14400'}>double</Text>
                </TouchableBox>
              </Box>
            </Box>
          ) : ()} */}

          {activityType == 2 && (
            <Box marginHorizontal="l">
              <Text
                variant="blackshade16600"
                mt={'l'}
                mb={'m'}
                fontFamily={fonts?.semibold}>
                Activity Name
              </Text>
              <Input
                place="Name of the Activity"
                value={activityName}
                onChange={e => setActivityName(e)}
              />
            </Box>
          )}

          <Box marginHorizontal="l" mt={activityType == 2 ? 'm' : 'l'}>
            <Text variant="blackshade16600" fontFamily={fonts?.semibold}>
              Location
            </Text>
          </Box>
          <TouchableBox
            backgroundColor="white"
            onPress={
              () => {
                setOpenLocation(true);
              }
              // navigation?.navigate('SelectLocation', {
              //   setLocation: changeLocation,
              // })
            }
            borderRadius={5}
            flexDirection="row"
            alignItems="center"
            marginLeft={'l'}
            marginTop={'m'}
            style={[
              TypographyStyles.cardShadow,
              {
                borderColor: palette?.placeholder,
                height: wp(12),
                marginRight: wp(5),
              },
            ]}>
            <FastImage
              source={search}
              tintColor={'black'}
              style={{
                height: wp(5),
                width: wp(5),
                marginHorizontal: wp(2),
                marginBottom: wp(1),
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            {location ? (
              <Box
                flexDirection="row"
                justifyContent={'space-between'}
                p="s"
                width={wp(73)}
                style={{
                  height: 'auto',

                  marginLeft: 5,

                  alignItems: 'center',

                  // justifyContent: 'center',

                  borderRadius: 5,
                }}>
                {/* <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      source={Images.markerLocation}
                      style={{
                        height: wp(6),
                        width: wp(6),
                        marginRight: wp(2),
                        marginTop: wp(1),
                      }}
                    /> */}
                <Text textTransform="uppercase" numberOfLines={2}>
                  {location?.info?.address || location?.name}
                </Text>

                <Box mr="mt">{Ionicon('close', 20, palette?.blackshade)}</Box>
              </Box>
            ) : (
              <Box pointerEvents="none">
                <TextInput
                  style={{
                    height: wp(12),
                  }}
                  placeholderTextColor={palette.blackshade1}
                  placeholder="Search for the venue or location"
                  editable={false}
                />
              </Box>
            )}
          </TouchableBox>
          <ActionSheet
            visible={openLocation}
            onClose={() => setOpenLocation(false)}
            onFinal={() => {
              setOpenLocation(false);

              if (selectedLoc?.value == 1)
                navigation?.navigate('SelectLocation', {
                  setLocation: changeLocation,
                });
              else
                navigation?.navigate('ChangeLocation', {
                  bebs: true,
                  setToLocation: changeLocation,
                });
            }}
            onItemPress={e => {
              setselectedLoc(e);
            }}
            items={LocationSelect}
            title={'Location'}
            selectedItem={selectedLoc}
          />
          <Box marginHorizontal="l" mt={'l'}>
            <Text variant="blackshade16600" fontFamily={fonts?.semibold}>
              Time
            </Text>
          </Box>
          <TouchableBox
            onPress={() => setPopup(true)}
            backgroundColor="white"
            borderRadius={5}
            flexDirection="row"
            alignItems="center"
            marginLeft={'l'}
            marginTop={'m'}
            style={[
              TypographyStyles.cardShadow,
              {
                borderColor: palette?.placeholder,
                height: wp(12),
                marginRight: wp(5),
              },
            ]}>
            <FastImage
              source={Images?.Calender}
              style={{
                height: wp(5),
                width: wp(5),
                marginHorizontal: wp(2),
                // marginBottom: wp(1),
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Box pointerEvents="none">
              <TextInput
                style={{
                  height: wp(12),
                  alignItems: 'center',
                  // color: palette?.placeholder,
                }}
                placeholderTextColor={palette.placeholder}
                placeholder="Pick a day & time"
                editable={false}
                value={
                  selectDate &&
                  `${moment(selectDate).format('DD MMMM')}, ${moment(
                    `${startHour}:${startMin}  ${amPm ? 'am' : 'pm'}`,
                    'hh:mm A',
                  ).format('hh:mm A')} - ${duration()}`
                  // : 'Pick a day & time'
                }
              />
            </Box>
          </TouchableBox>
          <Box marginHorizontal="l" mt={'l'}>
            <Text variant="blackshade16600" fontFamily={fonts?.semibold}>
              Player Quantity
            </Text>
          </Box>
          <Box
            mt="m"
            justifyContent="space-between"
            flexDirection="row"
            alignItems="center"
            marginHorizontal="l"
            flex={1}>
            <Box flexDirection="row" alignItems="center" flex={0.7}>
              <Text variant="blackshade16800Regular">Minimum Players</Text>
              <Text variant="blackshade116500Regular" ml="s">
                {'(incl. you)'}
              </Text>
            </Box>
            <Box flexDirection="row" flex={0.3}>
              <TouchableBox
                onPress={() => mincount > 0 && setMinCount(mincount - 1)}>
                <FastImage
                  resizeMode={FastImage?.resizeMode?.contain}
                  source={Images?.Minus}
                  style={{height: wp(10), width: wp(10)}}
                />
              </TouchableBox>
              <Box
                backgroundColor="primary3"
                borderRadius={5}
                justifyContent={'center'}
                alignItems={'center'}
                style={{
                  height: wp(9),
                  width: wp(9),
                }}>
                <Text variant="blackshade18800Regular">
                  {mincount < 10 ? '0' + mincount : mincount}
                </Text>
              </Box>
              <TouchableBox onPress={() => setMinCount(mincount + 1)}>
                <FastImage
                  resizeMode={FastImage?.resizeMode?.contain}
                  source={Images?.Plus}
                  style={{height: wp(10), width: wp(10)}}
                />
              </TouchableBox>
            </Box>
          </Box>
          <Box
            mt="m"
            justifyContent="space-between"
            flexDirection="row"
            alignItems="center"
            marginHorizontal="l"
            flex={1}>
            <Box flexDirection="row" alignItems="center" flex={0.7}>
              <Text variant="blackshade16800Regular">Maximum Players</Text>
              <Text variant="blackshade116500Regular" ml="s">
                (incl. you)
              </Text>
            </Box>
            <Box flexDirection="row" flex={0.3}>
              <TouchableBox
                onPress={() => maxcount > 0 && setMaxCount(maxcount - 1)}>
                <FastImage
                  resizeMode={FastImage?.resizeMode?.contain}
                  source={Images?.Minus}
                  style={{height: wp(10), width: wp(10)}}
                />
              </TouchableBox>
              <Box
                backgroundColor="primary3"
                borderRadius={5}
                justifyContent={'center'}
                alignItems={'center'}
                style={{
                  height: wp(9),
                  width: wp(9),
                }}>
                <Text variant="blackshade18800Regular">
                  {maxcount < 10 ? '0' + maxcount : maxcount}
                </Text>
              </Box>
              <TouchableBox onPress={() => setMaxCount(maxcount + 1)}>
                <FastImage
                  resizeMode={FastImage?.resizeMode?.contain}
                  source={Images?.Plus}
                  style={{height: wp(10), width: wp(10)}}
                />
              </TouchableBox>
            </Box>
          </Box>
          <Box marginHorizontal="l" mt={'l'} flexDirection="row">
            <Text variant="blackshade16600" fontFamily={fonts?.semibold}>
              Payment
            </Text>
            <TouchableBox onPress={() => setOpen(!open)}>
              <FastImage
                resizeMode={FastImage?.resizeMode?.contain}
                source={Images?.Info}
                style={{marginLeft: 10, height: 20, width: 20}}
              />
            </TouchableBox>
          </Box>
          <Box
            flexDirection={'row'}
            justifyContent="space-evenly"
            marginVertical="l">
            <TouchableBox
              onPress={() => setPaymentMethod(3)}
              style={[
                TypographyStyles.cardShadow,
                {
                  borderColor: paymentMethod == 3 && palette?.primary,
                },
              ]}
              backgroundColor="white"
              borderRadius={15}
              height={wp(23)}
              justifyContent="center"
              alignItems={'center'}
              borderWidth={paymentMethod == 3 ? 1 : 0}
              width={wp(28)}>
              <FastImage
                source={Images?.AFAWallet}
                style={{
                  height: wp(7),
                  width: wp(7),
                  marginBottom: 8,
                  marginLeft: 2,
                }}
              />
              <Text variant={'blackshade16400'}>AFA Pay</Text>
            </TouchableBox>
            <TouchableBox
              onPress={() => setPaymentMethod(2)}
              style={[
                TypographyStyles.cardShadow,
                {
                  borderColor: paymentMethod == 2 && palette?.primary,
                },
              ]}
              backgroundColor="white"
              borderRadius={15}
              height={wp(23)}
              justifyContent="center"
              alignItems={'center'}
              borderWidth={paymentMethod == 2 ? 1 : 0}
              width={wp(28)}>
              <FastImage
                source={Images?.primaryDollar}
                style={{height: wp(7), width: wp(7), marginBottom: 8}}
              />
              <Text variant={'blackshade16400'}>Cash</Text>
            </TouchableBox>
            <TouchableBox
              onPress={() => {
                setDiffPricing([]);
                setFairPricing('');
                setPaymentMethod(1);
              }}
              style={[
                TypographyStyles.cardShadow,
                {borderColor: paymentMethod == 1 && palette?.primary},
              ]}
              backgroundColor="white"
              borderRadius={15}
              height={wp(23)}
              justifyContent="center"
              alignItems={'center'}
              borderWidth={paymentMethod == 1 ? 1 : 0}
              width={wp(28)}>
              <FastImage
                source={Images?.FreeActivitySmiley}
                style={{
                  height: wp(7),
                  width: wp(7),
                  marginBottom: 8,
                  marginLeft: 2,
                }}
              />
              <Text variant={'blackshade16400'}>Free</Text>
            </TouchableBox>
          </Box>

          {(paymentMethod == 3 || paymentMethod == 2) && (
            <Box marginHorizontal="l">
              <Text variant="blackshade16600" marginVertical="m">
                Price per Person
              </Text>
              {/* <Box flexDirection="row"> */}
              <TouchableBox
                onPress={() => {
                  setPrice(false);
                  setfairPrice(!fairPrice);
                  setDiffPricing([]);
                }}>
                <Box flexDirection="row" mb="m">
                  <Image
                    source={
                      fairPrice ? Images?.RadioCheck : Images?.RadioUnCheck
                    }
                    style={{
                      height: wp(6),
                      width: wp(6),
                    }}
                  />
                  <Box flexDirection="row" alignItems="center" ml="m">
                    <FastImage
                      resizeMode={FastImage?.resizeMode?.contain}
                      source={Images?.FairPrice}
                      style={{height: 18, width: 18}}
                    />
                    <Text ml="m" variant="blackshade16800Regular">
                      Fair price
                    </Text>
                  </Box>
                </Box>
              </TouchableBox>
              {fairPrice && (
                <Box ml="l">
                  <Box ml="m">
                    <Text variant="blackshade114800Regular" mt="s">
                      The money will be transferred to your AFA Wallet
                      immediately after the Activity ends.
                    </Text>
                  </Box>
                  <Box mt="l" ml="m" width={'90%'}>
                    <Input
                      placeholder="Price per Player"
                      onChange={e => setFairPricing(e)}
                      value={fairPricing}
                      numberPad
                    />
                  </Box>
                </Box>
              )}
              <Box>
                <TouchableBox
                  onPress={() => {
                    setPrice(!price);
                    setfairPrice(false);
                    setFairPricing('');
                  }}>
                  <Box flexDirection="row" mt="m">
                    <Image
                      source={price ? Images?.RadioCheck : Images?.RadioUnCheck}
                      style={{
                        height: wp(6),
                        width: wp(6),
                      }}
                    />
                    <Box flexDirection="row" alignItems="center" ml="m">
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images?.DifferentPricing}
                        style={{height: 18, width: 18}}
                      />
                      <Text ml="m" variant="blackshade16800Regular">
                        Different pricing
                      </Text>
                    </Box>
                  </Box>
                </TouchableBox>
                {price && (
                  <Box flexDirection="row" mb="m" ml="m">
                    <Box ml="m">
                      <Box>
                        <Text variant="blackshade114800Regular" mt="s">
                          You can set different pricings for different groups of
                          Player.
                        </Text>
                      </Box>
                      {DiffPricing?.map((item, index) => {
                        const {
                          gender,
                          age,
                          price,
                          opengender,
                          openage,
                          openprice,
                        } = item;
                        return (
                          <Box mt="m" flexDirection="row" flex={1}>
                            <TouchableBox
                              justifyContent="space-between"
                              alignItems="center"
                              flexDirection="row"
                              p="s"
                              borderRadius={8}
                              height={wp(12)}
                              borderColor="placeholder"
                              style={{
                                shadowOffset: {
                                  width: 1,
                                  height: 0.5,
                                },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,

                                elevation: 4,
                                backgroundColor: 'white',
                              }}
                              onPress={() => {
                                oncloseGender(1, index);
                              }}>
                              <Box width={wp(18)}>
                                <Text
                                  ml="m"
                                  variant="placeholder14400"
                                  width={80}>
                                  {!gender ? 'Gender' : gender?.label}
                                </Text>
                              </Box>
                              <FastImage
                                resizeMode={FastImage?.resizeMode?.contain}
                                source={Image?.BelowArrow}
                                style={{height: 18, width: 18, marginRight: 10}}
                              />
                            </TouchableBox>
                            <TouchableBox
                              marginHorizontal="m"
                              p="s"
                              justifyContent="space-between"
                              alignItems="center"
                              flexDirection="row"
                              borderRadius={8}
                              height={wp(12)}
                              borderColor="placeholder"
                              style={{
                                shadowOffset: {
                                  width: 1,
                                  height: 0.5,
                                },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: 'white',
                              }}
                              onPress={() => {
                                oncloseAge(1, index);
                              }}>
                              <Box width={wp(20)}>
                                <Text
                                  marginHorizontal="m"
                                  variant="placeholder14400"
                                  width={20}>
                                  {!age ? 'Age' : age?.label?.split(' (')[0]}
                                </Text>
                              </Box>
                              <FastImage
                                resizeMode={FastImage?.resizeMode?.contain}
                                source={Images?.BelowArrow}
                                style={{height: 18, width: 18, marginRight: 10}}
                              />
                            </TouchableBox>
                            <Input
                              // placeholder="Price"
                              value={price}
                              note={false}
                              place="Price"
                              otp={false}
                              onBlur={() => Keyboard?.dismiss()}
                              numberPad
                              onChange={e => onChangePrice(e, index)}
                              inputStyle={{
                                width: size.width / 5,
                                borderWidth: 1,
                                borderColor: palette?.placeholder,
                              }}
                            />
                            <ActionSheet
                              visible={opengender}
                              onClose={() => oncloseGender(1, index)}
                              onFinal={() => oncloseGender(1, index)}
                              onItemPress={e => onChangeGender(e, index)}
                              items={genderSelection}
                              title={'Gender'}
                              selectedItem={gender}
                            />
                            <ActionSheet
                              visible={openage}
                              onClose={() => oncloseAge(1, index)}
                              onFinal={() => oncloseAge(1, index)}
                              onItemPress={e => onChangeAge(e, index)}
                              items={ageSelection}
                              title={'Age'}
                              selectedItem={age}
                            />
                          </Box>
                        );
                      })}
                      <TouchableBox onPress={() => onAddList()}>
                        <Box
                          // mt="m"
                          style={{marginLeft: -10}}
                          flexDirection="row"
                          alignItems="center">
                          <FastImage
                            resizeMode={FastImage?.resizeMode?.contain}
                            source={Images?.Plus}
                            style={{height: 40, width: 40}}
                          />
                          <Box>
                            <Text
                              variant="placeholder14400"
                              textDecorationLine="underline">
                              Add more
                            </Text>
                          </Box>
                        </Box>
                      </TouchableBox>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          {paymentMethod == 3 && (
            <Box
              mt="l"
              ml="l"
              mr="l"
              style={{
                flex: 1,
                marginRight: 10,
                alignItems: 'stretch',
                justifyContent: 'center',
              }}>
              <Box flexDirection="row" alignItems="center">
                <Text variant={'blackshade16600'}>Refund</Text>
                <TouchableBox onPress={() => setOpen(!open)}>
                  <FastImage
                    resizeMode={FastImage?.resizeMode?.contain}
                    source={Images?.Info}
                    style={{marginLeft: 10, height: 20, width: 20}}
                  />
                </TouchableBox>
              </Box>

              <Text marginVertical={'m'} variant={'blackshade114400'}>
                Select a time where Players are able to get a full refund, if
                they decide not to attend the activity before it begins.
              </Text>
              <Box height={30} />
              <Slider
                containerStyle={{flex: 1, width: wp(90)}}
                maximumTrackTintColor={palette?.white}
                minimumTrackTintColor={palette?.primary}
                thumbTintColor={palette?.primary}
                onValueChange={val => setRefund(val)}
                label={[
                  'No\nRefund',
                  '48hrs',
                  '24hrs',
                  '12hrs',
                  'Full\nRefund',
                ]}
                // trackRightPadding={-10}a
                trackStyle={{
                  height: 20,
                  borderRadius: 10,
                }}
                // renderAboveThumbComponent={(e, v) => <Text>{e}</Text>}
                // renderTrackMarkComponent={e => <Text>{e}</Text>}
                renderBelowThumbComponent={e => (
                  <Box
                    width={1}
                    height={40}
                    style={{
                      marginLeft: 0,
                    }}
                    backgroundColor="primary">
                    {/* <Text>{e}</Text> */}
                  </Box>
                )}
                thumbStyle={{
                  height: 40,
                  width: 40,
                  borderRadius: 40 / 2,
                }}
                thumbTouchSize={{width: 50, height: 50}}
                minimumValue={10}
                maximumValue={50}
                value={refund}
                thumbImage={Images?.SliderThumb}
                step={10}
                trackMarks={[10, 20, 30, 40, 50]}
                renderTrackMarkComponent={e => {
                  return EntypoIcon(
                    'controller-record',
                    wp(6),
                    e == 4 ? palette?.primary : palette?.tertiary2,
                  );
                }}
                maximumTrackStyle={{
                  borderWidth: 1,
                  borderColor: palette?.primary,
                }}
              />
            </Box>
          )}
        </Box>
      </ScrollView>
      <BottomModal
        visible={open}
        title={`Activity Refund Feature:\n Never worry about last-minute,\nno-shows again`}
        detail={`\n\nHave you ever experienced the frustration of planning a session, only to have some players bail out at the last minute? We understand the hassle, which is why we've introduced our convenient Refund Feature. Here's how it works:\n\nYou have full control over when players can request a refund, based on the notice they provide for not being able to attend the session. You can choose from the following options to suit your needs: Full Refund, 48 hours, 24 hours, 12 hours prior to the activity start time, or even No Refund allowed.\n\nLet's say you set the refund eligibility at 48 hours. If a player withdraws from an activity before the 48-hour mark, they will be eligible for a full refund of the activity fee they committed to in the AFA app.\n\nBy offering this flexibility, we aim to create a fair and transparent environment for both hosts and players. It encourages responsible commitment while providing a safety net for unforeseen circumstances.\n\nSo go ahead and make the most of our Refund Feature to ensure your sessions run smoothly and everyone feels supported. Happy hosting!\n`}
        buttonLabel={'OK'}
        left
        buttonColor={palette?.blackshade}
        onClose={() => setOpen(false)}
        onPress={() => setOpen(false)}
      />
      <Box flex={1} justifyContent="flex-end" marginVertical="l">
        <Box height={46} marginHorizontal="l" mt="l">
          <Button
            label="Continue"
            onPress={() => {
              Keyboard?.dismiss();
              InteractionManager.runAfterInteractions(() => {
                onSubmit();
              });
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1, paddingBottom: 100},
  image: {
    marginLeft: 10,
    height: 22,
    width: 22,
  },
  text: {
    flex: 1,
    marginTop: 5,
    paddingRight: 40,
    height: 40,
    alignSelf: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});

export default BasicInfo;
