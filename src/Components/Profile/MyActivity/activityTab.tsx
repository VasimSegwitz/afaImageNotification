import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Box, fonts, palette} from '../../Theme/Index';
import {wp} from '../../Helpers/responsive-ratio';
import ActivityTopTab from './activityTopTab';
import ActivityUpcoming from './activityUpcoming';
import ActivityPast from './activityPast';
import ActivityLeft from './activityLeft';
import ActivityWishlist from './activityWishlist';

const ActivityTab = props => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Box flex={1} backgroundColor="white" style={{marginLeft: wp(2)}}>
      <Tab.Navigator
        tabBar={props => <ActivityTopTab {...props} />}
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
        <Tab.Screen name="Upcoming" children={() => <ActivityUpcoming />} />
        <Tab.Screen name="Past" children={() => <ActivityPast />} />
        <Tab.Screen name="Forgo" children={() => <ActivityLeft />} />
        <Tab.Screen name="Wishlist" children={() => <ActivityWishlist />} />
      </Tab.Navigator>
    </Box>
  );
};

export default ActivityTab;
