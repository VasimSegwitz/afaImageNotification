import React, {memo, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, SectionList, FlatList} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
} from '../../../../Theme/Index';
import moment from 'moment';
import {Button, Header} from '../../../../ReusableComponents/index';
import CalendarStrip from 'react-native-calendar-strip';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../../Helpers/responsive-ratio';
const Star = require('../../../../assets/Home/Star/Star.png');
import {SafeAreaView} from 'react-native-safe-area-context';
import Suggestions from './Suggestions/Suggestions';
import Activities from './Activities/Activities';
import TypesOfSports from '../../BookingSearch/TypesOfSports/TypesOfSports';
import {useSelector} from 'react-redux';
const Upcoming = ({navigation, route, TypeOfSportsData}) => {
  const {vanue} = route?.params;

  const [selectDate, setSelectDate] = useState(new Date());

  const TypeOfFacilityData = useMemo(
    () => [
      {
        id: 1,
        name: 'Rubber',
        selected: false,
      },
      {
        id: 2,
        name: 'Parquet',
        selected: true,
      },
      {
        id: 3,
        name: 'Premium',
        selected: false,
      },
      {
        id: 4,
        name: 'Cement',
        selected: true,
      },
    ],
    [],
  );
  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(3, 'days'), // total 4 days enabled
    },
  ];
  let datesBlacklist = [moment().add(1, 'days')];
  const sport = useSelector(
    state => state?.auth?.user?.user?.data?.favorite_sports,
  );

  const [mainCat, setMaincat] = useState(sport);

  /**
   * @function onSelectCategory
   * @param item
   * @description this function will set flag true which is selected
   */

  const onSelectCategory = item => {
    // mainCat
    const temp = mainCat.map(cat => {
      return {
        ...cat,
        flag: cat?.id == item?.id ? true : false,
      };
    });
    setMaincat(temp);
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}>
      <Box marginHorizontal="l" mt="l">
        <TypesOfSports
          TypeOfSportsData={mainCat}
          onSelect={onSelectCategory}
          navigation={navigation}
        />
      </Box>
      <Box>
        <CalendarStrip
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            highlightColor: palette?.primary,
            // borderWidth: 1,
            // borderHighlightColor: 'white',
          }}
          onDateSelected={selectedDate => {
            setSelectDate(selectedDate);
          }}
          // highlightDateNumberStyle={{
          //   backgroundColor: 'blue',
          // }}
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
          style={{height: wp(25), paddingBottom: 20}}
          calendarHeaderStyle={{color: 'white'}}
          calendarColor={'white'}
          //dateNumberStyle={{ color: 'white' }}
          //dateNameStyle={{ color: 'white' }}
          highlightDateNumberStyle={{color: 'white'}}
          highlightDateNameStyle={{color: 'white'}}
          //disabledDateNameStyle={{ color: 'grey' }}
          //disabledDateNumberStyle={{ color: 'grey' }}
          //datesWhitelist={datesWhitelist}
          //datesBlacklist={datesBlacklist}
          //iconLeft={require('./img/left-arrow.png')}
          //iconRight={require('./img/right-arrow.png')}
          iconContainer={{flex: 0.1}}
        />
      </Box>
      <Box marginHorizontal="l" backgroundColor="tertiary2" height={2} />
      <Box marginHorizontal="l" mt="l">
        <Box mb="l">
          <Text variant="blackshade116500">5 Activities</Text>
        </Box>
        <Activities showDollar={true} />
        <Box mt="l">
          <Activities showDollar={false} />
        </Box>
      </Box>
      <Box marginVertical="l" flex={1} justifyContent="flex-end">
        <Box height={46} marginHorizontal="l" mb="l">
          <Button
            label="Book Now"
            onPress={() => {
              navigation.navigate('CheckAvailability', {
                from: 'Upcoming',
                vanue,
              });
            }}
          />
        </Box>
      </Box>
    </ScrollView>
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

export default Upcoming;
