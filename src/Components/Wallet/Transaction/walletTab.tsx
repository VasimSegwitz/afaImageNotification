import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Box, fonts, palette} from '../../Theme/Index';
import {wp} from '../../Helpers/responsive-ratio';
import WalletTopTab from './walletTopTab';
import WalletTopUp from './walletTopUp';
import WalletIn from './walletIn';
import WalletOut from './walletOut';

const WalletTab = props => {
  const {setAmount} = props;
  const Tab = createMaterialTopTabNavigator();

  return (
    <Box
      flex={1}
      backgroundColor="white"
      style={{top: wp(-6), marginLeft: wp(2)}}>
      <Tab.Navigator
        tabBar={props => <WalletTopTab {...props} />}
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
          name="Top-up"
          children={() => <WalletTopUp setAmount={setAmount} />}
        />
        <Tab.Screen
          name="Received"
          children={() => <WalletIn setAmount={setAmount} />}
        />
        <Tab.Screen
          name="Paid"
          children={() => <WalletOut setAmount={setAmount} />}
        />
      </Tab.Navigator>
    </Box>
  );
};

export default WalletTab;
