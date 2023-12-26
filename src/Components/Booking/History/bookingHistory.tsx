import React from 'react';
import {BackHandler} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {wp} from '../../Helpers/responsive-ratio';
import {Header} from '../../ReusableComponents';
import {EvilIcon} from '../../ReusableComponents/Icons';
import {Box, fonts, palette, Text, TouchableBox} from '../../Theme/Index';
import HistoryTopTab from './historyTopTab';
import UpcomingHistory from './upcomingHistory';
import {useNavigation} from '@react-navigation/native';

const BookingHistory = () => {
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();
  const handleOnback = () => navigation.navigate('Tabs');

  const backButtonHandler = () => {
    handleOnback();
    return true;
  };

  BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

  return (
    <Box flex={1} backgroundColor="white" pt="s">
      <Header title="Booking History" left onback={handleOnback} />
      <Box height={wp(2)} />
      <Tab.Navigator
        tabBar={props => <HistoryTopTab {...props} />}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: {
            fontSize: 14,
            fontFamily: fonts?.medium,
            fontWeight: '600',
            color: palette?.blackshade,
            textTransform: 'capitalize',
          },
        }}>
        <Tab.Screen
          name="Upcoming"
          children={() => <UpcomingHistory from={'upcoming'} />}
        />
        <Tab.Screen
          name="Completed"
          children={() => <UpcomingHistory from={'completed'} />}
        />
        <Tab.Screen
          name="Cancelled"
          children={() => <UpcomingHistory from={'cancelled'} />}
        />
        <Tab.Screen
          name="Awaiting"
          children={() => <UpcomingHistory from={'awaiting'} />}
        />
      </Tab.Navigator>
    </Box>
  );
};

export default BookingHistory;
