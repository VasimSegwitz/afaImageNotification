/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {AuthConstants} from '../../../Redux';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {wp} from '../../Helpers/responsive-ratio';
import Button from '../../ReusableComponents/Button';
import {editProfile} from '../../Services/ProfileApi';
import {Box, palette, Text} from '../../Theme/Index';

export default props => {
  const {navigation, route, onPress, data} = props;

  const dispatch = useDispatch();

  const {
    first_name,
    date_of_birth,
    email,
    phone,
    phone_prefix,
    user_name,
    gender,
    last_name,
  } = useSelector(state => state?.auth?.user?.user?.data);
  const {phone_verified_datetime} = useSelector(
    state => state?.auth?.user?.user?.data?.user_info,
  );
  const loc = useSelector(state => state?.auth?.user?.userlocation);
  const sport = useSelector(state => state?.auth?.user?.sport);

  const favorite_sports_ids = sport.map(data => data.id);

  const updateProfileMutation = useMutation('editProfile', editProfile, {
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
        displaySuccessToast('Profile Updated Successfully');
        onPress();
      }
    },
    onError: error => {
      if (error?.data?.success == 0) {
        if (error?.data?.data) {
          const key = Object.keys(error?.data?.data)[0];
          displayErrorToast(error?.data?.data[key]);
        } else return displayErrorToast(error?.data?.message);
      }
    },
  });

  const onSubmit = () => {
    if (!data || !data.gender) return displayErrorToast('Invalid DOB');
    const body = {
      first_name: first_name,
      last_name: last_name,
      username: user_name,
      gender: data.gender,
      email: email,
      phone_prefix: phone_prefix,
      phone: phone,
      favorite_sports: favorite_sports_ids,
      location_lat: (loc && loc?.location_lat) || 0,
      location_long: (loc && loc?.location_long) || 0,
      date_of_birth: data.dob,
    };
    updateProfileMutation?.mutate(body);
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
            <Box mt="s" alignSelf={'center'}>
              <FastImage
                source={Images?.SuccessImage}
                style={{
                  height: wp(80),
                  width: wp(100),
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </Box>
            <Box
              width={wp(100) - 30}
              position={'absolute'}
              bottom={wp(5)}
              alignSelf="center">
              <Box
                mb="xl"
                style={{
                  marginTop: wp(10),
                }}>
                <Text variant={'primary28700'}>You're all set!</Text>

                <Text variant={'blackshade16400'} mt="l">
                  Thanks for being a team player. Now,{'\n'} it’s time to get
                  active!
                </Text>
              </Box>

              <Button
                RenderComponent={() => (
                  <Box
                    p="s"
                    flexDirection={'row'}
                    style={{
                      width: '90%',
                      height: wp(10),
                      marginLeft: 10,

                      alignItems: 'center',
                      justifyContent: 'center',

                      borderRadius: 5,
                    }}>
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      source={Images.SuccessExplore}
                      style={{
                        height: wp(6),
                        width: wp(6),
                        marginRight: wp(2),
                        marginTop: wp(1),
                      }}
                    />
                    <Text numberOfLines={2} variant="white16500">
                      Start Exploring
                    </Text>
                  </Box>
                )}
                // onPress={}
                onPress={() => onSubmit()}
                // onPress={() => onPress()}
                buttonColor={palette?.primary}
              />
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};
