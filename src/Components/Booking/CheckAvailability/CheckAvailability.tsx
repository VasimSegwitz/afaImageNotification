import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useReducer,
} from 'react';
import {ScrollView, StyleSheet, TextInput, Image} from 'react-native';
import theme, {
  Box,
  fonts,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {Header, Button} from '../../ReusableComponents/index';
import FastImage from 'react-native-fast-image';
import RightArrow from '../../../assets/RightArrow/RightArrow.png';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import ScrollPicker from '../../ReusableComponents/ScrollableList';
import {wp} from '../../Helpers/responsive-ratio';
import FetchTime from '../../ReusableComponents/FetchTime';
import {facilityPrice, PriceListing} from '../../Helpers/HelperFunctions';
import {useMutation} from 'react-query';
import {getAvailableCourts} from '../../Services/Booking';
import {displayErrorToast} from '../../../utils';
import BottomModal from '../../ReusableComponents/Modals/BottomModal';
import {Images} from '../../../Constant/Image';
import {Down, Call} from '../../ReusableComponents/Icons';
import {useIsFocused} from '@react-navigation/native';

const timings = [
  {
    days: [1, 2, 3, 4, 5],
    prices: [
      {
        start_time: '07:00',
        no_of_hours: 3,
        min_booking_hour: 0,
        min_deposit: -1,
        default: 60,
        coach: -1,
        membership: -1,
        long_term: -1,
        student: -1,
      },
    ],
  },
  {
    days: [6],
    prices: [
      {
        start_time: '08:00',
        no_of_hours: 3,
        min_booking_hour: 0,
        min_deposit: -1,
        default: 80,
        coach: -1,
        membership: -1,
        long_term: -1,
        student: -1,
      },
    ],
  },
];

const CheckAvailability = ({navigation, route, value, onChangeText}) => {
  const isFocused = useIsFocused();
  const {vanue, facility_id} = route?.params;
  const [startHour, setStarthour] = useState(0);
  const [startMin, setStartmin] = useState(0);
  const [endHour, setEndhour] = useState(0);
  const [endMin, setEndmin] = useState(0);
  const [amPm, setAmPm] = useState(false);
  const [showTime, setShowTime] = useState(1);
  // const [priceList, setPriceli] = useState(
  //   PriceListing(vanue?.timings, vanue?.info?.currency),
  // );

  const vanueFacility = vanue?.facilities?.filter(
    data => data?.id == facility_id,
  );

  const [startTime, setStarttime] = useState();
  const [selectDate, setSelectDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      APIBody: {},
    },
  );

  useEffect(() => {
    if (vanueFacility[0]?.min_booking_hour == 0.5) setShowTime(0.5);
  }, [vanue]);

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
    return Math.sign(rhours) == -1 ? '0h:0m' : rhours + 'h ' + rminutes + 'm';
  }

  /**
   * @function duration
   * @description this function will return the duration of start and end time
   */

  const duration = () => {
    let startAM = parseInt(startHour) >= 12 ? 'pm' : 'am';
    let endAM = parseInt(endHour) >= 12 ? 'pm' : 'am';

    var now = moment(`${startHour}:${startMin} ${startAM}`, 'H:mm a');

    var prev = moment(`${endHour}:${endMin} ${endAM}`, 'H:mm a');

    var duration = moment.duration(prev.diff(now));

    // duration in hours
    var hours = parseInt(duration.asHours());

    // duration in minutes
    var minutes = parseInt(duration.asMinutes()) % 60;

    l = moment
      .utc(moment(prev, 'HH:mm a').diff(moment(now, 'HH:mm a')))
      .format('H:m');

    return l.split(':')[0] + 'h ' + l.split(':')[1] + 'm';

    // return dateDifference(now, prev);
  };

  /**
   * @function getAvilable
   * @description this function will call the getAvailableCourts api
   */

  const getAvilable = useMutation('getAvailableCourts', getAvailableCourts, {
    onSuccess: result => {
      if (result?.data?.length > 0) {
        const data = result?.data?.filter(
          item => item?.disabled == false && item?.available == true,
        );
        navigation.navigate('BookSlot', {
          courtsData: data,
          APIBody: state?.APIBody,
          vanue,
          facility_id: facility_id,
        });
      } else {
        setOpen(true);
      }
    },
  });

  /**
   * @function checkAvailable
   * @description this function will create the body
   */

  const checkAvailable = () => {
    let time = duration();

    if (startHour === 0) {
      displayErrorToast('Select The Time First');
      return;
    }

    let hr = time.split('h')[0];
    let m = time.split(' ')[1];
    let min = m.split('m')[0];

    let d = hr + '.' + (min == 30 ? 5 : min);
    const numhrs = parseFloat(showTime);

    if (numhrs < vanueFacility[0]?.min_booking_hour) {
      displayErrorToast(
        'Minimum Booking hours is : ' + vanueFacility[0]?.min_booking_hour,
      );
      return;
    }

    if (vanue?.facilities[0]?.is_even_hours == true && numhrs % 2 != 0) {
      displayErrorToast('Bookin hours should be even I.e 2,4...');
      return;
    }

    const body = {
      sports_facility_id: facility_id,
      date: moment(selectDate).format('DD-MM-YYYY'),
      start: moment(
        `${startHour}:${startMin}:00 ${amPm ? 'AM' : 'PM'}`,
        'hh:mm A',
      ).format('HH:mm'),
      no_of_hours: numhrs,
    };

    setState({
      APIBody: body,
    });

    setTimeout(() => {
      getAvilable?.mutate(body);
    }, 500);
  };

  const plus = () => {
    if (startHour > 0) {
      // const selectedTime = moment(`${startHour}:${startMin}:00`, 'HH:mm:ss')
      // let newTime = moment(showTime, 'hh:mm:ss')
      // let returned_endate = moment(showTime === 0 ? 1 : newTime).add(30, 'minutes').format('HH:mm');

      if (showTime < 24) {
        setShowTime(
          showTime === 0
            ? 1
            : showTime + (vanueFacility[0]?.min_booking_hour == 0.5 ? 0.5 : 1),
        );
      }
    } else if (startHour === 0) {
      displayErrorToast('Please select starting time');
    }
  };

  const minus = () => {
    if (startHour > 0) {
      // const selectedTime = moment(`${startHour}:${startMin}:00`, 'hh:mm:ss')
      // let newTime = moment(showTime, 'HH:mm:ss')
      // let returned_endate = moment(showTime === 0 ? 1 : newTime).subtract(30, 'minutes').format('HH:mm');
      if (showTime <= 24) {
        setShowTime(
          showTime === (vanueFacility[0]?.min_booking_hour == 0.5 ? 0.5 : 1)
            ? vanueFacility[0]?.min_booking_hour == 0.5
              ? 0.5
              : 1
            : showTime - (vanueFacility[0]?.min_booking_hour == 0.5 ? 0.5 : 1),
        );
      }
    } else if (startHour === 0) {
      displayErrorToast('Please select starting time');
    }
  };

  useEffect(() => {
    if (startHour !== 0) {
      setShowTime(vanueFacility[0]?.min_booking_hour == 0.5 ? 0.5 : 1);
    }
  }, [startHour]);

  return (
    <Box flex={1} backgroundColor="white">
      <Header title="Check Availability" left />
      <ScrollView contentContainerStyle={styles.content} nestedScrollEnabled>
        <Box flex={1}>
          <Box marginHorizontal="l">
            <Text variant="blackshade16800Semi">Date</Text>
          </Box>
          <Calendar
            // // Initially visible month. Default = now
            // initialDate={'2012-03-01'}
            // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={new Date()}
            // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={
              vanueFacility[0]?.max_booking_days > 0 &&
              moment()
                .add(vanueFacility[0]?.max_booking_days, 'days')
                .format('YYYY-MM-DD')
            }
            style={{agendaTodayColor: 'red'}}
            // // Handler which gets executed on day press. Default = undefined
            onDayPress={day => {
              setSelectDate(day?.dateString);
            }}
            markedDates={{
              [selectDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: palette?.primary,
                selectedTextColor: '#fff',
              },
            }}
            theme={{
              calendarBackground: 'white',
              textSectionTitleColor: palette?.tertiary5,
              selectedDayBackgroundColor: 'red',
              selectedDayTextColor: palette.tertiary5,
              todayTextColor: palette.primary,
              dayTextColor: palette?.tertiary5,
              textDisabledColor: palette.placeholder,
              arrowColor: palette.blackshade,
              monthTextColor: palette.blackshade,
              textMonthFontWeight: 'bold',
              textDayFontSize: 14,
              textDayFontWeight: 'bold',
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}

            // // Handler which gets executed on day long press. Default = undefined
            // onDayLongPress={day => {

            // }}
            // // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            // monthFormat={'yyyy MM'}
            // // Handler which gets executed when visible month changes in calendar. Default = undefined
            // onMonthChange={month => {

            // }}
            // // Hide month navigation arrows. Default = false
            // hideArrows={true}
            // // Replace default arrows with custom ones (direction can be 'left' or 'right')
            // //renderArrow={direction => <Arrow />}
            // // Do not show days of other months in month page. Default = false
            // hideExtraDays={true}
            // // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
            // // day from another month that is visible in calendar page. Default = false
            // disableMonthChange={true}
            // // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
            // firstDay={1}
            // // Hide day names. Default = false
            // hideDayNames={true}
            // // Show week numbers to the left. Default = false
            // showWeekNumbers={true}
            // // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            // onPressArrowLeft={subtractMonth => subtractMonth()}
            // // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            // onPressArrowRight={addMonth => addMonth()}
            // // Disable left arrow. Default = false
            // disableArrowLeft={true}
            // // Disable right arrow. Default = false
            // disableArrowRight={true}
            // // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            // disableAllTouchEventsForDisabledDays={true}
            // // Replace default month and year title with custom one. the function receive a date as parameter
            // renderHeader={date => {
            //     /*Return JSX*/
            // }}
            // // Enable the option to swipe between months. Default = false
            // enableSwipeMonths={true}
          />
          <Box alignItems="flex-end" mr="l" mt="l">
            <TouchableBox
              onPress={() =>
                navigation?.navigate('BookingSchedule', {
                  vanue: vanue,
                  selectDate,
                  facility_id: facility_id,
                })
              }
              height={28}
              backgroundColor="blackshade"
              borderRadius={10}
              alignItems="center"
              justifyContent="center"
              width={size.width / 2.5}>
              <Text marginHorizontal={'m'} variant="white12Medium">
                See Live Availability
              </Text>
            </TouchableBox>
          </Box>
          <Box marginHorizontal="l">
            <Text variant="blackshade16800Semi">Time</Text>
            <Box
              alignItems="center"
              borderRadius={10}
              mt="m"
              //height={216}
              //style={TypographyStyles.cardShadow}
              //backgroundColor="white"
            >
              <Box flex={1} flexDirection="row" alignItems="center">
                <TouchableBox
                  onPress={() => {
                    navigation.navigate('CheckTimerModal', {
                      setStarthour,
                      setStartmin,
                    });
                  }}
                  borderRadius={10}
                  width={wp(40)}
                  height={80}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="primary2"
                  flexDirection="row">
                  <Text variant="primary36700Medium">
                    {startHour}:{startMin === 0 ? '00' : startMin}
                  </Text>
                  <Image
                    source={Images.BelowArrow}
                    style={{
                      marginLeft: 10,
                      height: wp(5),
                      width: wp(5),
                    }}
                  />
                </TouchableBox>

                <Box
                  borderRadius={10}
                  width={50}
                  borderWidth={1}
                  borderColor="tertiary2"
                  height={80}
                  ml="l">
                  <TouchableBox
                    onPress={() => {
                      setAmPm(true);
                    }}
                    borderTopRightRadius={10}
                    borderTopLeftRadius={10}
                    backgroundColor={!amPm ? 'white' : 'primary2'}
                    justifyContent="center"
                    alignItems="center"
                    flex={1}>
                    <Text
                      variant={
                        !amPm ? 'blackshade118500' : 'primary16500Medium'
                      }>
                      AM
                    </Text>
                  </TouchableBox>
                  <Box height={1} backgroundColor="tertiary2" />
                  <TouchableBox
                    onPress={() => {
                      setAmPm(false);
                    }}
                    borderBottomRightRadius={10}
                    borderBottomLeftRadius={10}
                    backgroundColor={amPm ? 'white' : 'primary2'}
                    justifyContent="center"
                    alignItems="center"
                    flex={1}>
                    <Text
                      variant={
                        amPm ? 'blackshade118500' : 'primary16500Medium'
                      }>
                      PM
                    </Text>
                  </TouchableBox>
                </Box>

                {/* <Box flexDirection="row" mt="l">
                  <Box flex={1} alignItems="center">
                    <Text variant="blackshade16800Regular">START</Text>
                  </Box>
                  <Box flex={1} alignItems="center">
                    <Text variant="blackshade16800Regular">END</Text>
                  </Box>
                </Box> */}
                {/* <Box flexDirection="row" flex={1} alignItems="center">
                  <FetchTime
                    SelectHours={hour => setStarthour(hour)}
                    SelectMinute={min => setStartmin(min)}
                    hour={startHour}
                    min={startMin}
                    val={12}
                  />

                  <FastImage
                    source={RightArrow}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />

                  <FetchTime
                    SelectHours={hour => setEndhour(hour)}
                    SelectMinute={min => setEndmin(min)}
                    hour={endHour}
                    min={endMin}
                  />
                </Box> */}
                {/* <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  mb="l">
                  <Text variant="blackshade16800Regular">Duration : </Text>
                  <Text variant="blackshade16800Regular">{duration()}</Text>
                </Box> */}
              </Box>
            </Box>
          </Box>
          <Box marginHorizontal="l" mt="l">
            <Text variant="blackshade16800Semi">Duration</Text>
            <Box flexDirection="row" justifyContent="center" mt="m">
              <TouchableBox
                onPress={() => {
                  minus();
                }}>
                <Image
                  source={Images?.Minus}
                  style={{
                    height: wp(10),
                    width: wp(10),
                  }}
                />
              </TouchableBox>
              <Box
                style={{marginHorizontal: wp(5)}}
                borderRadius={10}
                alignItems="center"
                justifyContent="center"
                backgroundColor="primary2">
                <Text marginHorizontal="l" variant="blackshade18400">
                  {showTime == 0.5 ? 30 : showTime}{' '}
                  {showTime < 0.6
                    ? 'Mins'
                    : showTime > 0.5 && showTime < 1.5
                    ? 'Hour'
                    : 'Hours'}
                </Text>
              </Box>
              <TouchableBox
                onPress={() => {
                  plus();
                }}>
                <Image
                  source={Images?.Plus}
                  style={{
                    height: wp(10),
                    width: wp(10),
                  }}
                />
              </TouchableBox>
            </Box>
          </Box>
          <Box flexDirection={'row'} p="l" alignItems={'center'}>
            {Call('', 'access-time', 20, palette?.primary)}
            <Text ml="m" textTransform={'uppercase'} variant="primary14900">
              duration required
            </Text>
          </Box>
          <Box
            marginHorizontal="l"
            mt="s"
            borderWidth={1}
            borderRadius={1}
            borderColor="primary"
            p="m"
            borderStyle={'dashed'}>
            {/* <Text variant="blackshade16800Semi">Price</Text> */}
            <Box>
              {/* {priceList &&
                priceList.map(item => {
                  return <Text variant="blackshade316800Regular">{item}</Text>;
                })} */}
              {/* </Box> */}

              <Text variant="blackshade316800Regular">
                {vanueFacility[0]?.description}
              </Text>
            </Box>
          </Box>
          <Box flex={1} justifyContent="flex-end" mb="l">
            <Box height={46} marginHorizontal="l" mt="l">
              <Button
                label="Check Availability"
                onPress={() => {
                  checkAvailable();
                }}
              />
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <BottomModal
        visible={open}
        title="No Game, no life."
        detail="Looks like there’s no courts that are available at this time. "
        buttonLabel={'Pick Another Time'}
        onClose={() => setOpen(false)}
        onPress={() => setOpen(false)}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
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

export default CheckAvailability;
