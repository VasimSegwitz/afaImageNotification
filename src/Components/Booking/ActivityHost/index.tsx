import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useState} from 'react';
import {Alert, Image, ImageBackground, StyleSheet, Share} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {wp} from '../../Helpers/responsive-ratio';
import {Header} from '../../ReusableComponents/index';
import {Box, palette, TouchableBox, TypographyStyles} from '../../Theme/Index';
import ActivityDetail from './ActivityDetail';

import {useMutation, useQuery} from 'react-query';
import {Images} from '../../../Constant/Image';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import Button from '../../ReusableComponents/Button';
import {EntypoIcon, Ionicon} from '../../ReusableComponents/Icons';
import CancelActivityModal from '../../ReusableComponents/Modals/CancelActivityModal';
import Menu, {
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from '../../ReusableComponents/popup-menu/src';
import {
  CancelActivity,
  getSingleActivity,
  markFullActivity,
  uploadActivityCover,
} from '../../Services/Booking';
import VenuInfoToptab from '../SearchVenues/VenueInfo/VenuInfoToptab';
import Feedback from './Feedback';
import RSVP from './RSVP';
import Comments from './Comments/Comments';
import authStore from '../../../Zustand/store';
import {feather} from '../../ReusableComponents/Icons';
import ImageCropPicker from 'react-native-image-crop-picker';
import moment from 'moment';
import {ActivityConstants} from '../../../Redux';
import {envVars} from '../../Helpers/constants';

const Tab = createMaterialTopTabNavigator();

const ActivityHost = ({navigation, route, TypeOfSportsData}) => {
  const {coHost, from, ishost} = route?.params;

  const [tabIndex, setTabIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [result, setResult] = useState([]);

  // const [vanue, setVanue] = useState(route?.params?.vanue);

  const {location} = useSelector(state => state.auth.user);

  useEffect(() => {
    if (from !== undefined && from === 'notification') {
      setTimeout(() => {
        navigation.navigate('Comments');
      }, 500);
    }
  }, [route?.params]);

  const {vanue} = authStore(state => state?.vanue);
  const setVanue = authStore(state => state?.setVanue);

  var DateofVanue = moment(vanue?.date + ' ' + vanue?.start);

  const tod = moment();

  var passed = DateofVanue?.isAfter(tod);

  // var passed = moment().isAfter(vanue?.date);
  var curr = moment().format('hh:mm');
  var startTime = moment(curr, 'HH:mm');
  var vanTime = moment(vanue?.start, 'hh:mm');
  var endTime = moment(vanTime, 'HH:mm');

  // var passedTime = curr.isBefore(vanTime);
  var passedTime = startTime.isBefore(endTime);

  const isPassed = passed && passedTime;

  const handleInvitePeople = () => {
    if (!passed) {
      displayErrorToast(`This Activity is not more Active`);
      return;
    }
    navigation.navigate('Invite', {vanue});
  };

  /**
   * @function mutate
   * @description this function will call the createActivity api
   */

  const {mutate} = useMutation('CancelActivity', CancelActivity, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || `can't reserve slot now`);
      } else {
        displaySuccessToast(
          data?.message || 'User Activity Successfully Cancelled',
        );
        navigation?.goBack();
      }
    },
  });

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getActivity = useQuery(
    ['getSingleActivity', vanue?.id],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        setVanue({
          vanue: data?.data,
        });
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  /**
   * @function markfull
   * @param body
   * @description this api will mark as full now
   */

  const {mutate: markFull} = useMutation('markFullActivity', markFullActivity, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  /**
   * @function onSubmit
   * @description will validate the data and call the api
   */

  const onSubmit = reason => {
    if (reason == '') {
      displayErrorToast('Kindly select reason before cancel activity');
      return;
    }

    const body = {
      reason: reason?.value,
    };

    const payload = {
      body: body,
      id: vanue?.id,
    };

    mutate(payload);
  };

  const onImageUpload = e => {
    const data = {
      type: e[0]?.type,
      name: e[0]?.name.split('/').pop(),
      uri: e[0]?.uri,
    };

    const formData = new FormData();
    // const d = e?.map(item => {

    //     type: item?.type,
    //     name: item?.name.split('/').pop(),
    //     uri: item?.uri,
    //   );
    // });

    formData.append('image', data);

    uploadImage?.mutate({
      id: vanue?.id,
      form: formData,
    });
  };

  const onPicker = async () => {
    ImageCropPicker.openPicker({
      width: 800,
      height: 400,
      cropping: true,
      // multiple: true,
    }).then(image => {
      // const data = image?.map(item => {
      //   return {
      //     name: item?.path.split('/').pop(),
      //     type: item?.mime,
      //     uri: item?.path,
      //   };
      // });
      const data = [
        {
          name: image?.path,
          type: image?.mime,
          uri: image?.path,
        },
      ];

      setResult(data);
      onImageUpload(data);
    });
  };

  /**
   * @function onShare
   * @description will generate the link with product id and user id and share the link
   */

  const onShare = async () => {
    const msg = 'https://deeplink.afa-sports.com/Activity/' + vanue?.id;

    try {
      const result = await Share.share({
        title: 'AFA',
        message: msg,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const onCaptureImage = () =>
    ImageCropPicker.openCamera({
      width: 800,
      height: 400,
      cropping: true,
    }).then(image => {
      const data = [
        {
          name: image?.path,
          type: image?.mime,
          uri: image?.path,
        },
      ];
      setResult(data);
      onChange(data);
    });

  const uploadImage = useMutation('uploadProfileImage', uploadActivityCover, {
    onSuccess: data => {
      if (!data?.success) {
        displayErrorToast(data?.errorMessage || 'Something went wrong');
      }
      if (data?.success) {
        displaySuccessToast('Cover Image Uploaded');
        getActivity?.refetch();
      }
    },
  });

  const dispatch = useDispatch();

  const onopenImage = () =>
    Alert.alert('Alert', 'What Would You Like To Do', [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'Upload Image',
        onPress: onPicker,
      },
      {text: 'Capture Image', onPress: onCaptureImage},
    ]);

  return (
    <Box flex={1}>
      <MenuProvider style={{flex: 1}}>
        <Header
          title={vanue?.setting?.name}
          left
          onRight
          RenderRightComponent={() => (
            <Box
              flexDirection="row"
              width={wp(15)}
              alignItems="center"
              justifyContent="flex-end">
              <TouchableBox onPress={() => onShare()}>
                <Box>
                  <Image
                    source={Images.Share}
                    style={{height: wp(10), width: wp(10)}}
                    resizeMode={'contain'}
                  />
                </Box>
              </TouchableBox>
              <Menu>
                <MenuTrigger>
                  <Box ml="l">
                    {EntypoIcon(
                      'dots-three-vertical',
                      wp(5),
                      palette?.blackshade,
                    )}
                  </Box>
                </MenuTrigger>
                <MenuOptions
                  customStyles={{optionText: styles.text}}
                  style={{
                    backgroundColor: '#fff',
                    padding: 5,
                  }}>
                  <MenuOption
                    onSelect={() =>
                      vanue?.cancelled_at
                        ? displayErrorToast('Activity is cancelled')
                        : vanue?.setting?.is_marked_full
                        ? displayErrorToast('Activity is Full')
                        : handleInvitePeople()
                    }
                    text="Invite People"
                  />
                  <Box
                    style={{
                      marginVertical: 5,
                      marginHorizontal: 5,
                      borderBottomWidth: 1,
                      borderColor: '#E5E5E5',
                    }}
                  />
                  <MenuOption
                    onSelect={() => {
                      if (vanue?.cancelled_at)
                        displayErrorToast('Activity is cancelled');
                      else {
                        dispatch({
                          type: ActivityConstants?.ACTIVITYCLEAN,
                          clean: false,
                        });

                        navigation?.navigate('Add', {details: vanue});
                        // navigation?.navigate('Add', {
                        //   screen: 'Basic Info',
                        //   params: {
                        //     details: vanue,
                        //     from: 'Edit',
                        //   },
                        // });
                        // setloader(true);
                        // getCheapest();
                      }
                    }}
                    text="Edit Activity"
                  />
                  <Box
                    style={{
                      marginVertical: 5,
                      marginHorizontal: 5,
                      borderBottomWidth: 1,
                      borderColor: '#E5E5E5',
                    }}
                  />

                  <MenuOption
                    onSelect={() => {
                      if (vanue?.cancelled_at)
                        displayErrorToast('Activity is cancelled');
                      else {
                        markFull({
                          id: vanue?.id,
                          body: {
                            is_full: true,
                          },
                        });
                      }
                    }}
                    text="Mark as Full"
                  />

                  <Box
                    style={{
                      marginVertical: 5,
                      marginHorizontal: 5,
                      borderBottomWidth: 1,
                      borderColor: '#E5E5E5',
                    }}
                  />

                  {coHost && (
                    <MenuOption
                      onSelect={() =>
                        vanue?.cancelled_at
                          ? displayErrorToast('Activity is cancelled already')
                          : setVisible(true)
                      }
                      text="Cancel Activity"
                    />
                  )}
                </MenuOptions>
              </Menu>
              {/* <TouchableBox>
                <Box>
                  {EntypoIcon(
                    'dots-three-vertical',
                    wp(5),
                    palette?.blackshade,
                  )}
                </Box>
              </TouchableBox> */}
            </Box>
          )}
        />
        <ImageBackground
          source={
            vanue?.images?.length > 0 ? {uri: vanue?.images[0]} : Images?.ban
          }
          // resizeMode="stretch"
          style={{
            height: wp(38),

            marginBottom: 10,

            justifyContent: 'flex-end',
          }}>
          <TouchableBox onPress={() => onopenImage()}>
            <Box
              backgroundColor={'white'}
              height={30}
              width={30}
              borderRadius={20}
              justifyContent={'center'}
              bottom={10}
              right={10}
              style={{
                ...TypographyStyles?.cardShadow,
              }}
              alignItems={'center'}
              alignSelf={'flex-end'}>
              {Ionicon('camera-outline', 18, palette?.primary)}
            </Box>
          </TouchableBox>
        </ImageBackground>
        <Tab.Navigator
          tabBar={props => (
            <VenuInfoToptab
              {...props}
              setTab={val => {
                setTabIndex(val);
              }}
            />
          )}>
          <Tab.Screen
            name="Details"
            component={ActivityDetail}
            initialParams={{vanue}}
          />
          <Tab.Screen name="RSVP" component={RSVP} initialParams={{vanue}} />

          <Tab.Screen
            name="Comments"
            component={Comments}
            initialParams={{vanue}}
          />

          {/* <Tab.Screen
          name="Line-up"
          component={ActivityDetail}
          initialParams={{vanue}}
        />
        <Tab.Screen
          name="Chat"
          component={ActivityDetail}
          initialParams={{vanue}}
        /> */}
          {/* <Tab.Screen
            name="Feedback"
            component={Feedback}
            initialParams={{vanue}}
          /> */}
        </Tab.Navigator>
        {tabIndex < 2 &&
        !vanue?.cancelled_at &&
        !vanue?.setting?.is_marked_full ? (
          <Box
            width={wp(100) - 30}
            position={'absolute'}
            bottom={wp(4)}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems="center"
            alignSelf="center">
            <Button
              onPress={vanue?.cancelled_at ? null : handleInvitePeople}
              disabled={vanue?.cancelled_at}
              label={
                vanue?.cancelled_at
                  ? 'Cancelled This Activity'
                  : 'Invite People'
              }
              buttonStyle={{
                height: wp(11),
                width: wp(100) - 30,
                marginBottom: 10,
              }}
            />
          </Box>
        ) : null}
      </MenuProvider>
      <CancelActivityModal
        visible={visible}
        title="I Want To Cancel Ths Activity"
        left={true}
        detail="Reason"
        buttonLabel={'Cancel This Activity'}
        onClose={() => setVisible(false)}
        onItemPress={item => setReason(item)}
        onPress={item => onSubmit(reason)}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  orangeDot: {
    backgroundColor: palette.primary,
    height: 8,
    borderRadius: 5,
    width: 20,
  },
  border: {
    width: 50,
    alignSelf: 'center',
    marginTop: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: palette.inputBorder,
  },
});

export default ActivityHost;
