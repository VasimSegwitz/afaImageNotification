import React, {useMemo, useState} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../Constant/Image';
import {wp} from '../Helpers/responsive-ratio';
import {Button} from '../ReusableComponents';
import {Ionicon} from '../ReusableComponents/Icons';
import {Box, palette, Text, TouchableBox} from '../Theme/Index';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

const DrawerMenu = props => {
  const {state, setState} = props;
  const navigation = useNavigation();

  const friends_section = useMemo(
    () => [
      {
        id: 1,
        name: 'Find Friends',
        image: Images.FindFriends,
      },
      {
        id: 2,
        name: 'Refer Friends',
        image: Images.ReferFriend,
      },
      {
        id: 3,
        name: 'My Friends',
        image: Images.MyFriends,
      },
    ],
    [],
  );

  const settings_section = useMemo(
    () => [
      {
        id: 1,
        name: 'Preferences',
        image: Images.Preferences,
        goto: 'Preferences',
      },
      {
        id: 2,
        name: 'Privacy',
        image: Images.Privacy,
        goto: 'Privacy',
      },
    ],
    [],
  );

  const about_section = useMemo(
    () => [
      {
        id: 1,
        name: 'About Us',
        image: Images.AboutUS,
        goto: 'AboutUs',
        get: 'about_us',
      },
      {
        id: 2,
        name: 'Privacy Policy',
        image: Images.PrivacyPolicy,
        goto: 'AboutUs',
        get: 'privacy_policy',
      },
      {
        id: 3,
        name: 'Terms & Conditions',
        image: Images.Terms,
        goto: 'AboutUs',
        get: 'terms_condition',
      },
      {
        id: 4,
        name: 'Loyalty Reward Points',
        image: Images.LoyaltyPoint,
        goto: 'AboutUs',
        get: 'community_guidelines',
      },
    ],
    [],
  );

  const support_section = useMemo(
    () => [
      // {
      //     id: 1,
      //     name: 'Feedback',
      //     image: Images.Feedback,
      //     goto: 'Feedback'
      // },
      // {
      //     id: 2,
      //     name: 'Report a bug',
      //     image: Images.ReportBug,
      //     goto: 'SupportRaiseTicket',
      //     is_contact_us: false
      // },
      {
        id: 3,
        name: 'Contact Us',
        image: Images.ContactUs,
        goto: 'ZendeskChat',
        is_contact_us: true,
      },
    ],
    [],
  );

  const toggleCloseDrawer = () => setState({...state, is_menu: false});
  const handleLogout = () => setState({...state, is_logout: true});
  const handleSettingNavigation = data => data && navigation.navigate(data);
  const handleSupportNavigation = (data, params) =>
    data && navigation.navigate(data, {is_contact_us: params});
  const handleAboutNavigation = (data, params, get) =>
    data && navigation.navigate(data, {from: params, variable: get});

  return (
    <Box
      flex={1}
      p={'m'}
      marginHorizontal={'m'}
      style={{height: Dimensions.get('window').height}}>
      <TouchableBox
        onPress={toggleCloseDrawer}
        alignItems={'flex-end'}
        marginVertical={'m'}
        mt={'l'}>
        {Ionicon('close', wp(7), palette?.blackshade)}
      </TouchableBox>
      <Box flex={0.9}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <Text variant={"primary12900"}>
                        FRIENDS
                    </Text>
                    <Box style={[styles.divider, { marginVertical: wp(1), marginHorizontal: 0 }]} />
                    <Box mt={"m"}>
                        {friends_section.map((data) => {
                            return (
                                <TouchableBox key={data?.id} flexDirection={"row"} mb={"m"}>
                                    <FastImage
                                        source={data?.image}
                                        style={{ height: wp(5), width: wp(5) }}
                                        resizeMode={FastImage?.resizeMode?.contain}
                                    />
                                    <Text ml={"m"} variant={'blackshade14400'}>{data?.name}</Text>
                                </TouchableBox>
                            )
                        })}
                    </Box> */}
          <Text variant={'primary12900'}>SETTING</Text>
          <Box
            style={[
              styles.divider,
              {marginVertical: wp(1), marginHorizontal: 0},
            ]}
          />
          <Box mt={'m'}>
            {settings_section.map(data => {
              return (
                <TouchableBox
                  key={data?.id}
                  flexDirection={'row'}
                  mb={'l'}
                  onPress={() => handleSettingNavigation(data?.goto)}>
                  <FastImage
                    source={data?.image}
                    style={{height: wp(5), width: wp(5)}}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text ml={'m'} variant={'blackshade14400'}>
                    {data?.name}
                  </Text>
                </TouchableBox>
              );
            })}
          </Box>
          <Text variant={'primary12900'}>ABOUT</Text>
          <Box
            style={[
              styles.divider,
              {marginVertical: wp(1), marginHorizontal: 0},
            ]}
          />
          <Box mt={'m'}>
            {about_section.map(data => {
              return (
                <TouchableBox
                  key={data?.id}
                  flexDirection={'row'}
                  mb={'l'}
                  onPress={() =>
                    handleAboutNavigation(data?.goto, data?.name, data?.get)
                  }>
                  <FastImage
                    source={data?.image}
                    style={{height: wp(5), width: wp(5)}}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text ml={'m'} variant={'blackshade14400'}>
                    {data?.name}
                  </Text>
                </TouchableBox>
              );
            })}
          </Box>
          <Text variant={'primary12900'}>SUPPORT</Text>
          <Box
            style={[
              styles.divider,
              {marginVertical: wp(1), marginHorizontal: 0},
            ]}
          />
          <Box mt={'m'}>
            {support_section.map(data => {
              return (
                <TouchableBox
                  key={data?.id}
                  flexDirection={'row'}
                  mb={'m'}
                  onPress={() =>
                    handleSupportNavigation(data?.goto, data?.is_contact_us)
                  }>
                  <FastImage
                    source={data?.image}
                    style={{height: wp(5), width: wp(5)}}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text ml={'m'} variant={'blackshade14400'}>
                    {data?.name}
                  </Text>
                </TouchableBox>
              );
            })}
          </Box>
        </ScrollView>
      </Box>
      <Box flex={0.2} height={40} marginVertical={'m'}>
        <Button label="LOG OUT" onPress={handleLogout} />
      </Box>
    </Box>
  );
};

export default DrawerMenu;
