import React from 'react';
import {Header} from '../../ReusableComponents';
import {Box, fonts, palette} from '../../Theme/Index';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ActivityNotifiction from './activityNotification';
import NotificationTopTab from './notificationTopTab';
import UpdateNotification from './updateNotification';

const Notification = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Box flex={1} backgroundColor={'white'}>
      <Header title={'Notification'} left />
      <Tab.Navigator
        tabBar={props => <NotificationTopTab {...props} />}
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
        <Tab.Screen name="Activity" children={() => <ActivityNotifiction />} />

        <Tab.Screen name="Update" children={() => <UpdateNotification />} />
        {/* <Tab.Screen name="User" children={() => <UserNotification/>} /> */}
      </Tab.Navigator>
    </Box>
  );
};

export default Notification;
