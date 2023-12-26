import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {Header} from '../../ReusableComponents';
import {Box, fonts, palette} from '../../Theme/Index';
import Friends from './friends';
import InviteTab from './inviteTab';
import Members from './members';

const Invite = props => {
  const {route, navigation} = props;

  const Tab = createMaterialTopTabNavigator();

  return (
    <Box flex={1} backgroundColor={'white'}>
      <Header title={'Invite People'} left />
      <Tab.Navigator
        tabBar={props => <InviteTab {...props} />}
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
          name="Members"
          children={() => <Members vanue={route?.params} />}
        />
        {/* <Tab.Screen name="Friends" children={() => <Friends />} /> */}
      </Tab.Navigator>
    </Box>
  );
};

export default Invite;
