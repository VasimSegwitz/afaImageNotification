import React, {memo, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {
  Box,
  fonts,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {Button, Header} from '../../ReusableComponents/index';
import Where from './Where/Where';
import Settings from './Settings/Settings';
import Players from './Players/Players';
import Payment from './Payment/Payment';

import CreateActivityTopTab from './CreateActivityTopTab';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import BasicInfo from './BasicInfo/basicInfo';
import FetchTime from '../../ReusableComponents/FetchTime';
import {Calendar} from 'react-native-calendars';
import {Images} from '../../../Constant/Image';
import FastImage from 'react-native-fast-image';
import {hp, wp} from '../../Helpers/responsive-ratio';
import {displayErrorToast} from '../../../utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Animated, {SlideInUp} from 'react-native-reanimated';

const Tab = createMaterialTopTabNavigator();

const CreateActivity = ({navigation, route, TypeOfSportsData}) => {
  const {params} = route;

  const {from} = params;
  const [popup, setPopup] = useState(false);
  const [selectDate, setSelectDate] = useState();
  const [selectTime, setSelectTime] = useState();
  const [startHour, setStarthour] = useState(0);
  const [startMin, setStartmin] = useState(0);
  const [endHour, setEndhour] = useState(0);
  const [endMin, setEndmin] = useState(0);
  const [amPm, setAmPm] = useState(false);
  const [showTime, setShowTime] = useState(1);

  const clean = useSelector(state => state?.activity?.activity?.clean);

  const inset = useSafeAreaInsets();

  const handleCancel = () => {
    setSelectDate();
    setSelectTime();
    setStarthour(0);
    setStartmin(0);
    setEndhour(0);
    setEndmin(0);
    setPopup(false);
  };

  // useEffect(() => {
  //   if (clean) {
  //     handleCancel();
  //   }
  // }, [clean]);

  const plus = () => {
    if (startHour > 0) {
      // const selectedTime = moment(`${startHour}:${startMin}:00`, 'HH:mm:ss')
      // let newTime = moment(showTime, 'hh:mm:ss')
      // let returned_endate = moment(showTime === 0 ? 1 : newTime).add(30, 'minutes').format('HH:mm');

      if (showTime < 24) {
        setShowTime(showTime === 0 ? 1 : showTime + 1);
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
        setShowTime(showTime === 1 ? 1 : showTime - 1);
      }
    } else if (startHour === 0) {
      displayErrorToast('Please select starting time');
    }
  };

  useEffect(() => {
    if (startHour !== 0) {
      setShowTime(1);
    }
  }, [startHour]);

  return (
    <Box flex={1} backgroundColor="white">
      <Header
        title="Create Activity"
        left={from === 'Tabs' ? true : true}
        onback={() => {
          // navigation?.setParams({
          //   details: {},
          // });
          navigation?.goBack();
        }}
      />

      {popup && (
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
          onPress={() => setPopup(false)}
        />
      )}

      <Tab.Navigator
        keyboardDismissMode="on-drag"
        tabBar={props => <CreateActivityTopTab {...props} />}
        initialRouteName={'Basic Info'}>
        <Tab.Screen
          name="Basic Info"
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({details: undefined}),
          })}
          children={() => (
            <BasicInfo
              setPopup={setPopup}
              setSelectTime={setSelectTime}
              selectDate={selectDate}
              selectTime={selectTime}
              startHour={startHour}
              startMin={startMin}
              endHour={endHour}
              endMin={endMin}
              details={route?.params?.details}
              from={route?.params?.details ? 'Edit' : ''}
              setStarthour={setStarthour}
              setStartmin={setStartmin}
              setEndhour={setEndhour}
              setEndmin={setEndmin}
              setSelectDate={setSelectDate}
              setShowTime={setShowTime}
              showTime={showTime}
              amPm={amPm}
              setAmPm={setAmPm}
            />
          )}
        />
        <Tab.Screen
          name="Advanced Settings"
          component={Where}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({details: undefined}),
          })}
          initialParams={{
            details: route?.params?.details,
            from: route?.params?.details ? 'Edit' : 'Tabs',
          }}
        />
        {/* <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="Players"
          component={Players}
          options={{
            unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="Payment"
          component={Payment}
          options={{
            unmountOnBlur: true,
          }}
        /> */}
      </Tab.Navigator>

      {popup && (
        <Animated.View
          entering={SlideInUp}
          style={[
            TypographyStyles.cardShadow,
            TypographyStyles.container,
            {
              padding: 20,
              position: 'absolute',
              left: 0,
              right: 0,
              top: inset && inset?.top,
              marginHorizontal: wp(4),
              borderRadius: 10,
              zIndex: 15,
              maxHeight: hp(78),
            },
          ]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Box>
              <Text variant="blackshade16600" fontFamily={fonts?.semibold}>
                Date
              </Text>
              <Calendar
                minDate={new Date()}
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
              />
            </Box>
            <Box>
              <Text
                variant="blackshade16600"
                marginVertical={'l'}
                fontFamily={fonts?.semibold}>
                Time
              </Text>
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
                    <FastImage
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
            <Box mt="l">
              <Text variant="blackshade16800Semi">Duration</Text>
              <Box flexDirection="row" justifyContent="center" mt="m">
                <TouchableBox
                  onPress={() => {
                    minus();
                  }}>
                  <FastImage
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
                    {showTime} Hour
                  </Text>
                </Box>
                <TouchableBox
                  onPress={() => {
                    plus();
                  }}>
                  <FastImage
                    source={Images?.Plus}
                    style={{
                      height: wp(10),
                      width: wp(10),
                    }}
                  />
                </TouchableBox>
              </Box>
            </Box>
            <Box
              mt={'l'}
              mb={'m'}
              flexDirection="row"
              justifyContent={'space-between'}
              alignItems="center">
              <Button
                onPress={handleCancel}
                label={'Cancel'}
                buttonColor="white"
                textStyle={{
                  color: palette?.primary,
                  fontSize: 14,
                  fontFamily: fonts.medium,
                  fontWeight: '500',
                }}
                buttonStyle={{
                  height: wp(10),
                  width: wp(38),
                  borderWidth: 1,
                  borderColor: palette?.primary,
                  borderRadius: wp(2),
                }}
              />
              <Button
                onPress={() => {
                  !selectDate && setSelectDate(new Date());
                  if (startHour == 0)
                    return displayErrorToast('Select Valid Timing');
                  setPopup(false);
                }}
                label={'Apply'}
                buttonStyle={{
                  height: wp(10),
                  width: wp(38),
                  borderRadius: wp(2),
                }}
                textStyle={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: fonts.medium,
                  fontWeight: '500',
                }}
              />
            </Box>
          </ScrollView>
        </Animated.View>
      )}
    </Box>
  );
};

export default memo(CreateActivity);
