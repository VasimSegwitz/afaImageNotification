import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Box, fonts, palette} from '../../Theme/Index';
import {wp} from '../../Helpers/responsive-ratio';
import VenueTopTab from './venueTopTab';
import MyFavourite from './myfavourites';
import NearBy from './nearBy';

const VenueTab = props => {
  const {body} = props;
  const Tab = createMaterialTopTabNavigator();

  return (
    <Box
      flex={1}
      backgroundColor="white"
      //top={-8}
      borderTopLeftRadius={20}
      borderTopRightRadius={20}>
      <Box flex={1} mt={'l'}>
        <Tab.Navigator
          tabBar={props => <VenueTopTab {...props} />}
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
          {/* <Tab.Screen name="My favourites" children={() => <MyFavourite favourite/>} /> */}
          <Tab.Screen
            name="Nearby"
            children={() => <MyFavourite body={body} />}
          />
        </Tab.Navigator>
      </Box>
    </Box>
  );
};

export default VenueTab;
