import React, {useState} from 'react';
import {View, Image, Platform, StatusBar, BackHandler} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Profile from '../Profile/Profile';
import CreateActivity from '../Booking/CreateActivity/CreateActivity';
const ChatSelected = require('../../assets/BottomTabs/ChatSelected/ChatSelected.png');
const ChatUnselected = require('../../assets/BottomTabs/ChatUnselected/ChatUnselected.png');
// const WalletSelected = require('../../assets/BottomTabs/WalletSelected/WalletSelected.png');
const WalletSelected = require('../../assets/BottomTabs/WalletSelected/Wallet-selected.png');

const WalletUnselected = require('../../assets/BottomTabs/WalletUnselected/WalletUnselected.png');
const ProfileUnselected = require('../../assets/BottomTabs/ProfileUnselected/ProfileUnselected.png');
// const ProfileSelected = require('../../assets/BottomTabs/ProfileSelected/ProfileSelected.png');
const ProfileSelected = require('../../assets/BottomTabs/ProfileSelected/User-selected.png');

const Add = require('../../assets/BottomTabs/Add/Add.png');
const HomeSelected = require('../../assets/BottomTabs/HomeSelected/HomeSelected.png');
const HomeUnselected = require('../../assets/BottomTabs/HomeUnselected/HomeUnselected.png');
import Drawer from '../Drawer/Drawer';
import Dashboard from '../Dashboard/Dashboard';
import {Box, size, Text, TouchableBox, TypographyStyles} from '../Theme/Index';
import Wallet from '../Wallet';
import FastImage from 'react-native-fast-image';
import {Images} from '../../Constant/Image';
import {wp} from '../Helpers/responsive-ratio';
import {Button} from '../ReusableComponents';
import {useNavigation} from '@react-navigation/native';
import Tooltip from '../ReusableComponents/tooltip/src/tooltip';
import ToolTipContent from '../ReusableComponents/ToolTipContent';
import authStore from '../../Zustand/store';
import {useEffect} from 'react';
import ActivityPage from '../Booking/ActivityPage';
import {ActivityStack} from '../../Navigation/DashboardNavigation';
import {createActivity} from '../Services/Booking';
import ActivitySearch from '../Booking/ActivitySearch';
import Animated, {FadeOutUp, SlideInUp} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

const tabBarIcon = (focused, name, iconSelected, iconUnselected) => {
  return (
    <>
      {focused ? (
        <Box
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}>
          <Box
            height={11}
            width={11}
            borderRadius={7}
            left={43}
            top={20}
            style={{backgroundColor: 'rgba(253, 201, 176, 0.8)'}}
            position={'absolute'}
            zIndex={99999}
          />
          <Image
            resizeMode="contain"
            source={iconSelected}
            style={[
              {
                height: name === 'Add' ? 45 : 24,
                width: name === 'Add' ? 50 : 24,
                marginTop: Platform.OS === 'ios' ? 40 : 20,
              },
            ]}
          />
          <Box
            mt="m"
            backgroundColor="primary"
            height={3}
            width={size.width / 5}
            borderRadius={5}
          />
        </Box>
      ) : (
        <Box style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <Image
            resizeMode="contain"
            source={iconUnselected}
            style={[
              {
                height: name === 'Add' ? 45 : 24,
                width: name === 'Add' ? 45 : 24,
                marginTop: Platform.OS === 'ios' ? 40 : 20,
              },
            ]}
          />
          <Box
            mt="m"
            backgroundColor="white"
            height={3}
            width={size.width / 5}
            borderRadius={5}
          />
        </Box>
      )}
    </>
  );
};

const TabContainer = props => {
  const {initialRoute} = props?.route?.params;
  const [soon, setSoon] = useState(false);
  const navigation = useNavigation();

  const tooltipData = authStore(state => state.tooltip?.tooltip);
  const setTooltip = authStore(state => state?.setTooltip);

  // function backButtonHandler() {
  //   return true;
  // }

  // useEffect(() => {
  //   navigation.addListener('beforeRemove', e => {
  //     e.preventDefault();
  //     //clear setInterval here and go back
  //   });
  //   BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {soon && (
        <Animated.View
          entering={SlideInUp}
          exiting={FadeOutUp}
          style={[
            TypographyStyles.cardShadow,
            {
              backgroundColor: 'white',
              flex: 1,
              padding: 20,
              position: 'absolute',
              left: 0,
              right: 0,
              top: wp(50),
              zIndex: 1,
              marginHorizontal: wp(4),
              borderRadius: 15,
            },
          ]}>
          <Box justifyContent={'center'} alignItems={'center'}>
            <Text variant={'blackshade20500'} textAlign={'center'} mt={'l'}>
              Still warming up...
            </Text>
            <FastImage
              source={Images.AFAC}
              style={{
                height: wp(15),
                width: wp(15),
                marginVertical: wp(5),
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text variant={'blackshade16400'} textAlign={'center'}>
              This feature will be ready to play real soon!
            </Text>
          </Box>
          <Box mt={'l'} mb={'m'}>
            <Button label="Ok" onPress={() => setSoon(false)} />
          </Box>
        </Animated.View>
      )}

      <Box style={{bottom: 0, position: 'absolute', right: wp(-43), left: 0}}>
        <Tooltip
          isVisible={tooltipData?.wallet}
          topAdjustment={
            Platform?.OS == 'android' ? -StatusBar?.currentHeight : 0
          }
          contentStyle={{
            borderRadius: 10,
          }}
          content={
            <ToolTipContent
              onPress={() => {
                setTooltip({
                  tooltip: {
                    ...tooltipData,
                    wallet: false,
                  },
                });
              }}
              circleArray={[false, false, true]}
              title="Pay with AFA Pay"
              detail="From now on you can top-up and pay for venue bookings through our secure e-Wallet"
            />
          }
          placement="top"
          childrenWrapperStyle={{
            backgroundColor: 'transparent',
          }}
          onClose={() => {
            setTooltip({
              tooltip: {
                ...tooltipData,
                wallet: false,
              },
            });
          }}>
          <View>
            <TouchableBox
              onPress={() => {
                setTooltip({
                  tooltip: {
                    ...tooltipData,
                    wallet: false,
                  },
                });
              }}
              mb={'s'}
              p={'s'}
              mr="m"
              justifyContent="center"
              alignItems="center"
              backgroundColor={'white'}
              borderRadius={wp(9 / 2)}>
              <FastImage
                source={WalletSelected}
                style={{
                  height: wp(9),
                  width: wp(9),
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </TouchableBox>
          </View>
        </Tooltip>
      </Box>

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 80,
            ...TypographyStyles.cardShadow,
          },
          // Platform.OS === 'ios'
          // ? {headerShown: false, gestureEnabled: false}
          headerShown: false,
        }}
        initialRouteName={initialRoute ? initialRoute : 'Home'}>
        <Tab.Screen
          name="Home"
          component={Dashboard}
          initialParams={{space: props?.route?.params.space}}
          options={({route}) => ({
            // unmountOnBlur: true,

            tabBarLabel: '',
            tabBarIcon: ({focused}) =>
              tabBarIcon(focused, 'Home', HomeUnselected, HomeUnselected),
          })}
        />
        <Tab.Screen
          name="History"
          component={Drawer}
          options={({route}) => ({
            unmountOnBlur: true,

            tabBarLabel: '',
            tabBarIcon: ({focused}) =>
              tabBarIcon(focused, 'History', ChatSelected, ChatUnselected),
          })}
          listeners={{
            tabPress: e => {
              // Prevent default action
              e.preventDefault();
              setSoon(!soon);
            },
          }}
        />
        <Tab.Screen
          name="Add"
          component={CreateActivity}
          initialParams={{from: 'Tabs'}}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({details: undefined}),
          })}
          options={({route}) => ({
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({focused}) => tabBarIcon(focused, 'Add', Add, Add),
          })}
          // listeners={{
          //   tabPress: e => {
          //     // Prevent default action
          //     e.preventDefault();
          //     navigation.navigate('BookingSearch');
          //   },
          // }}
        />
        <Tab.Screen
          name="Wallet"
          component={Wallet}
          options={({route}) => ({
            unmountOnBlur: true,

            tabBarLabel: '',
            tabBarIcon: ({focused}) =>
              tabBarIcon(focused, 'Wallet', WalletSelected, WalletUnselected),
          })}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={({route}) => ({
            // unmountOnBlur: true,

            tabBarLabel: '',
            tabBarIcon: ({focused}) =>
              tabBarIcon(
                focused,
                'Profile',
                ProfileSelected,
                ProfileUnselected,
              ),
          })}
        />
        <Tab.Screen
          name="ActivitySearch"
          component={ActivitySearch}
          options={({route}) => ({
            unmountOnBlur: true,

            tabBarButton: () => null,
          })}
        />
      </Tab.Navigator>
    </View>
  );
};
export default TabContainer;
