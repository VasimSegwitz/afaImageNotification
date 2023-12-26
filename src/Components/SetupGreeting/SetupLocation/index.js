/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {googleApiKey} from '../../Helpers/constants';
import {wp} from '../../Helpers/responsive-ratio';
import Button from '../../ReusableComponents/Button';
import {Ionicon} from '../../ReusableComponents/Icons';
import {Box, os, palette, Text, TypographyStyles} from '../../Theme/Index';
import Geocoder from 'react-native-geocoding';
import authStore from '../../../Zustand/store';
import {useNavigation} from '@react-navigation/native';

export default props => {
  Geocoder.init(googleApiKey, {language: 'en'});

  const navigation = useNavigation();

  const {route, onPress, onSubmit} = props;

  const [pemission, setPermis] = useState(false);

  const loc = useSelector(state => state?.auth?.user?.userlocation);

  const [location, setLocation] = useState('');

  const askLoc = authStore(state => state.askLoc.askLoc);

  useEffect(() => {
    var g = loc?.name.split(',');

    const l = g?.length && g.splice(-3).join(',');
    setLocation(l);
  }, [loc]);

  const getPermission = async () => {
    (askLoc == undefined || askLoc == false) &&
      navigation?.navigate('AskLocation', {setPermis: setPermis});

    if (askLoc) {
      if (os?.ios) onPress();
      else
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            onPress();
          } else if (granted === 'never_ask_again') {
            alert(
              'you have denied to get your location kindly enable it on system setting for AFA',
            );
          } else {
            getPermission();
          }
        } catch (err) {
          console.warn(err);
        }
    }
  };
  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      style={{
        backgroundColor: palette.white,

        paddingBottom: route?.params?.space?.bottom,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={{
            flex: 1,
          }}
          keyboardShouldPersistTaps="handled">
          <Box flex={1} p="t" onStartShouldSetResponder={Keyboard.dismiss}>
            <Box alignItems={'center'} justifyContent="center" mt="xl">
              <FastImage
                source={Images.LocationPin}
                resizeMode="contain"
                style={{height: wp(8), width: wp(8), marginBottom: 10}}
              />
              <Text variant={'blackshade24500'}>Select your location</Text>
              <Text variant={'blackshade14400'} textAlign="center" mt="s">
                We will use your location to show activities, groups and venues
                near you.
              </Text>
              <Text variant={'blackshade14400'} textAlign="center" mt="s">
                You can allow access to your current location or search for your
                preferred locations.
              </Text>
            </Box>

            <ScrollView
              top={wp(5)}
              style={{
                flex: 1,
                flexGrow: 1,
              }}
              //   backgroundColor="primary"
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 10,
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <Box width={wp(90)} top={wp(1)} alignSelf="center">
                <Button
                  RenderComponent={() => (
                    <Box
                      p="s"
                      flexDirection={'row'}
                      style={
                        ([TypographyStyles.cardShadow],
                        {
                          width: '100%',
                          height: wp(10),

                          alignItems: 'center',
                          justifyContent: 'center',
                          // backgroundColor: 'white',
                          //   borderWidth: 1,
                          // borderColor: '#C1C1C1',
                          borderRadius: 5,
                        })
                      }>
                      <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={Images.currentLocation}
                        style={{
                          height: wp(5),
                          width: wp(5),
                          marginRight: wp(2),
                        }}
                      />
                      <Text textTransform="uppercase">My Current Location</Text>
                    </Box>
                  )}
                  // onPress={}
                  onPress={() => {
                    // onPress()
                    getPermission();
                  }}
                  buttonColor={'#FFEEE6'}
                />
                <Box height={wp(5)} />
                <Button
                  RenderComponent={() => (
                    <Box
                      p="s"
                      flexDirection={'row'}
                      style={
                        ([TypographyStyles.cardShadow],
                        {
                          width: '80%',
                          height: wp(10),
                          marginLeft: 10,
                          alignItems: 'center',

                          borderRadius: 5,
                          justifyContent: !location ? 'center' : 'center',
                        })
                      }>
                      <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={Images.markerLocation}
                        style={{
                          height: wp(6),
                          width: wp(6),
                          marginRight: wp(2),
                          marginTop: wp(1),
                        }}
                      />
                      <Text textTransform="uppercase" numberOfLines={1}>
                        {location ? location : 'Select Location'}
                      </Text>
                      {location && (
                        <Box marginRight={'mt'}>
                          {Ionicon('close', 20, palette?.blackshade)}
                        </Box>
                      )}
                    </Box>
                  )}
                  // onPress={}
                  onPress={() => onPress()}
                  buttonColor={location ? '#fff' : '#FFEEE6'}
                  buttonStyle={{
                    ...TypographyStyles?.cardShadow,
                    width: wp(100) - 40,
                    alignItems: 'center',
                    // justifyContent: location ? 'space-between' : 'center',
                  }}
                />
              </Box>
            </ScrollView>

            {/* {location && ( */}
            <Box
              width={wp(100) - 30}
              position={'absolute'}
              bottom={wp(1)}
              alignSelf="center">
              <Button
                onPress={() => onSubmit()}
                label={'Continue'}
                buttonStyle={{
                  height: wp(10),
                  marginBottom: 10,
                }}
              />
            </Box>
            {/* )} */}
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};
