import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ImageBackground, Share, Image} from 'react-native';
import {
  Box,
  palette,
  TouchableBox,
  fonts,
  Text,
  TypographyStyles,
} from '../../Theme/Index';
import {Header} from '../../ReusableComponents/index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import ActivityDetail from '../ActivityDetail';
import VenuInfoToptab from '../SearchVenues/VenueInfo/VenuInfoToptab';
import {EntypoIcon, Ionicon} from '../../ReusableComponents/Icons';
import {Images} from '../../../Constant/Image';
import Button from '../../ReusableComponents/Button';
import IncompleteProfile from '../ActivityDetail/incompleteProfile';
import SetSkill from '../ActivityDetail/setSkill';
import NotEnoughSkill from '../ActivityDetail/notEnoughSkill';
import FreeActivity from '../ActivityDetail/freeActivity';
import Pricing from '../ActivityDetail/pricing';
import InSufficient from '../ActivityDetail/inSufficient';
import ActivityPaid from '../ActivityDetail/activityPaid';
import RSVP from '../ActivityHost/RSVP';
import {cancelReasonEnum} from '../../Helpers/Enums';
import Feedback from '../ActivityHost/Feedback';
import RaiseTicket from '../ActivityDetail/raiseTicket';
import {
  LeaveActivity,
  NotGoingActivity,
  getSingleActivity,
  uploadActivityCover,
} from '../../Services/Booking';
import {useMutation, useQuery} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import authStore from '../../../Zustand/store';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useFocusEffect} from '@react-navigation/native';
import {getUserProfile, updateFavouriteSport} from '../../Services/ProfileApi';
import {AuthConstants, BookingConstants} from '../../../Redux';
import LeaveActivityModal from '../../ReusableComponents/Modals/LeaveActivityModal';
import {AddtoWishlist, RemovetoWishlist} from '../../Services/WishlistApi';
import moment from 'moment';
import {goingUser} from '../../Helpers/HelperFunctions';
import Comments from '../ActivityHost/Comments/Comments';

const Tab = createMaterialTopTabNavigator();

const ActButton = ({...props}) => {
  return (
    <Box
      width={wp(100) - 30}
      position={'absolute'}
      bottom={wp(4)}
      flexDirection="row"
      justifyContent={'space-between'}
      alignItems="center"
      alignSelf="center">
      <Button
        onPress={props?.LeftonPress}
        //   vanue?.users?.find(item => item?.user_id == id)?.request_type ==
        //     1 ||
        //   vanue?.users?.find(item => item?.user_id == id)?.request_type == 4
        //     ? notGoing()
        //     : handleGoing()
        // }
        label={props?.Leftlabel}
        buttonStyle={{
          height: wp(11),
          width: (wp(100) - 40) / 2,
          marginBottom: 10,
        }}
        disabled={props?.leftdisabled}
      />
      <>
        {props?.icon ? (
          <Button
            onPress={props?.RightonPress}
            label={props?.Rightlabel}
            buttonColor="white"
            imageStyle={{height: 18, width: 18, marginRight: 5}}
            Imagewithlabel
            img={Images?.BlackCheckCircle}
            textStyle={{
              color: 'black',
              fontSize: 16,
              fontFamily: fonts.medium,
              fontWeight: '500',
            }}
            buttonStyle={{
              height: wp(11),
              width: (wp(100) - 40) / 2,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: palette?.primary,
            }}
          />
        ) : (
          <Button
            onPress={props?.RightonPress}
            label={props?.Rightlabel}
            buttonColor="white"
            textStyle={{
              color: 'black',
              fontSize: 16,
              fontFamily: fonts.medium,
              fontWeight: '500',
            }}
            buttonStyle={{
              height: wp(11),
              width: (wp(100) - 40) / 2,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: palette?.primary,
            }}
          />
        )}
      </>
    </Box>
  );
};

const ActivityPage = ({navigation, route, TypeOfSportsData}) => {
  const {params} = route;
  const {ishost, from} = params;
  const [tabIndex, setTabIndex] = useState(0);
  // const {vanue} = route?.params;

  // const {wishlistIDs} = authStore(state => state.wishlistIDs);

  const {wishData} = useSelector(state => state?.book?.booking);

  const {vanue} = authStore(state => state?.vanue);

  const [result, setResult] = useState();

  const [selected, setSelected] = useState(vanue?.is_withlisted ? true : false);

  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState('');

  const setVanue = authStore(state => state?.setVanue);

  const in_sufficient = useSelector(
    state => state?.activity?.activity?.insufficient,
  );

  //User Data
  const user_data = useSelector(
    state => state.auth.user?.user?.data?.favorite_sports,
  );

  const initialState = {
    is_incomplete_profile: false,
    skill_level: false,
    is_not_enough_skill: false,
    is_free_activity: false,
    is_pricing: false,
    inSufficient: in_sufficient,
    is_activity_paid: false,
    userdata: user_data,
    will_do_later: false,
    reload: false,
  };
  const [state, setState] = useState(initialState);

  const {first_name, image, id, date_of_birth, gender} = useSelector(
    state => state?.auth?.user?.user?.data,
  );
  const {phone_verified_datetime} = useSelector(
    state => state?.auth?.user?.user?.data?.user_info,
  );

  const user = useSelector(state => state?.auth?.user?.user?.data?.wallet);

  //Activity Data
  const {category_id, game_skill} = vanue?.setting;
  const {different_pricing, fair_price} = vanue?.payment;
  const activity_id = vanue?.id;
  const is_activity_completed = vanue?.completed_at != null;

  // const [getCategory, setgetCategory] = useState();
  // const [isHaveSkill, setisHaveSkill] = useState();
  // const [userSkill, setuserSkill] = useState();
  // const [isSKillNotEnough, setisSKillNotEnough] = useState();
  // const [isIncompleteProfile, setisIncompleteProfile] = useState();

  /**
   * @function useFocusEffect
   * @description it will get fcmtoken
   */

  const dispatch = useDispatch();

  const getUserProfileQuery = useQuery('getUserProfile', getUserProfile, {
    enabled: false,
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
      }
    },
    onError: error => {},
  });

  const refreshPage = () => {
    getUserProfileQuery?.refetch();
    // handleGoing();
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     handleGoing();
  //     // setState({reload: false});
  //   }, [state?.reload == true]),
  // );
  // useEffect(() => {

  //   getCategory &&
  //     setisHaveSkill(
  //       (getCategory[0]?.game_skill == null ? true : false) &&
  //         game_skill != null,
  //     );
  //   getCategory &&
  //     setuserSkill(
  //       getCategory[0]?.game_skill == null ? 0 : getCategory[0]?.game_skill,
  //     );
  // }, [getCategory]);

  const getCategory =
    (user_data &&
      user_data?.filter(data => data.category?.id == category_id)) ||
    [];
  const isHaveSkill = getCategory[0]?.game_skill == null ? true : false;
  const userSkill =
    getCategory[0]?.game_skill == null ? 0 : getCategory[0]?.game_skill;
  const isSKillNotEnough = game_skill == null ? true : userSkill < game_skill;
  const isIncompleteProfile = !(
    phone_verified_datetime != null &&
    first_name.length > 0 &&
    image.length > 0
  );

  const isFreeActivity = different_pricing.length == 0 && fair_price == null;
  const handleInvitePeople = () => {
    if (!passed) {
      displayErrorToast(`This Activity is not more Active`);
      return;
    }

    if (!route?.params?.coHost) {
      displayErrorToast('Only Host & Co-Host can Invite People');
      return;
    }
    navigation.navigate('Invite', {vanue});
  };
  const handleRateActivity = () => console.log('Rate activity');

  var yer = moment().diff(date_of_birth, 'years');

  var DateofVanue = moment(vanue?.date + ' ' + vanue?.start);

  const tod = moment();

  var passed = DateofVanue?.isAfter(tod);
  var curr = moment().format('hh:mm');
  var startTime = moment(curr, 'HH:mm');
  var vanTime = moment(vanue?.start, 'hh:mm');
  var endTime = moment(vanTime, 'HH:mm');

  // const  = DateofVanue?.isAfter(tod);

  // var passedTime = curr.isBefore(vanTime);
  var passedTime = startTime.isAfter(endTime);

  const isPassed = passed && passedTime;

  const updateFavouriteSportMutation = useMutation(
    'updateFavouriteSport',
    updateFavouriteSport,

    {
      onSuccess: data => {
        if (data?.success == 0) return displayErrorToast(data?.message);
        if (data?.success == 1) {
          getUserProfileQuery.refetch();
          displaySuccessToast('This sport is added to your preferences');
          // handleGoing();
          setTimeout(() => {
            setState({
              ...state,
              skill_level: true,
            });
          }, 700);

          return;
        }
      },
      onError: error => {
        if (error?.data?.success == 0)
          return displayErrorToast(error?.data?.message);
      },
    },
  );

  const submitSport = () => {
    var d = [...user_data, vanue?.setting?.category];
    const prev_sport = d?.map(data => data?.category?.id);
    const new_sport = d?.map(data => data?.id);
    const pre_body = [...prev_sport, ...new_sport];
    const body = pre_body.filter(item => !isNaN(parseInt(item)));
    updateFavouriteSportMutation.mutate({favorite_sports: body});
    // setTimeout(() => {
    //   handleGoing();
    // }, 1000);
  };

  const handleGoing = () => {
    if (
      parseInt(vanue?.setting?.maximum_players) -
        parseInt(
          goingUser(vanue?.users?.filter(item => item?.request_type == 4)),
        ) ==
      0
    ) {
      displayErrorToast('This Activity is full');
      return;
    }

    if (!passed) {
      displayErrorToast(`This Activity is not more Active`);
      return;
    }

    // if (
    //   different_pricing.length > 0 &&
    //   different_pricing.every(data => data.gender == gender)
    // ) {
    //   displayErrorToast(
    //     `This Activity is only for the ${
    //       gender == 1 ? 'Male' : 'Female'
    //     } player`,
    //   );
    //   return;
    // }
    if (different_pricing.length == 0 && yer < vanue?.setting?.min_age) {
      displayErrorToast(
        'You are not eligible to join this activity, minimum age required is' +
          vanue?.setting?.min_age,
      );
      return;
    }

    if (isIncompleteProfile && !state?.will_do_later)
      setState({
        ...state,
        is_incomplete_profile: isIncompleteProfile,
      });
    else if (getCategory?.length < 1 && vanue?.setting?.category != null) {
      submitSport();
      // displayErrorToast(' Please add the sport in Preferences');
      return;
    } else if (
      getCategory?.length > 0 &&
      isHaveSkill &&
      vanue?.setting?.category != null
    )
      setState({
        ...state,
        skill_level: isHaveSkill,
      });
    else if (!isHaveSkill && !isIncompleteProfile && isSKillNotEnough)
      setState({
        ...state,
        is_not_enough_skill:
          !isHaveSkill && !isIncompleteProfile && isSKillNotEnough,
      });
    else if (!isHaveSkill && isFreeActivity)
      setState({
        ...state,
        is_free_activity: !isHaveSkill && isFreeActivity,
      });
    else if (insufficient)
      setState({
        ...state,
        inSufficient: insufficient,
      });
    else if (different_pricing.length > 0 || fair_price !== null)
      setState({
        ...state,
        is_pricing: true,
      });
    else if (getCategory?.length < 1 && isFreeActivity) {
      setState({
        ...state,
        is_free_activity: isFreeActivity,
      });
    }

    // setState({
    //   ...state,
    //   is_incomplete_profile: isIncompleteProfile,
    //   skill_level: isHaveSkill,
    //   is_free_activity: !isIncompleteProfile && !isHaveSkill && isFreeActivity,
    //   is_pricing: !isFreeActivity,
    //   is_not_enough_skill:
    //     !isHaveSkill && !isIncompleteProfile && !isSKillNotEnough,
    // });
  };

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
        // setVanue({
        //   vanue: data?.data,
        // });
        // navigation?.setParams({vanue: data?.data});
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  const {mutate} = useMutation('NotGoingActivity', NotGoingActivity, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  const {mutate: Leav} = useMutation('LeaveActivity', LeaveActivity, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
      setVisible(false);
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  const notGoing = () => {
    setVisible(true);
    // mutate({id: vanue?.id});
  };

  const Leaving = (peoples, reason) => {
    Leav({
      id: vanue?.id,
      body: {
        ...(peoples?.length ? {peoples_data: peoples} : {peoples}),
        reason,
      },
    });
  };

  const LeavinWhenInvited = reason => {
    Leav({
      id: vanue?.id,
      body: {
        peoples_data: null,
        reason,
      },
    });
  };

  const freeActivity =
    state.is_free_activity && !(state.skill_level && state.is_not_enough_skill);

  const pricing =
    state.is_pricing &&
    !state.is_free_activity &&
    !state.skill_level &&
    !state.is_not_enough_skill;

  const insufficient =
    state.inSufficient != in_sufficient &&
    !(
      state.is_pricing &&
      state.is_free_activity &&
      state.skill_level &&
      state.is_not_enough_skill
    );

  const activitypaid =
    state.is_activity_paid &&
    !(
      state.inSufficient &&
      state.is_pricing &&
      state.is_free_activity &&
      state.skill_level &&
      state.is_not_enough_skill
    );

  const onImageUpload = e => {
    const data = {
      type: e[0]?.type,
      name: e[0]?.name.split('/').pop(),
      uri: e[0]?.uri,
    };
    const formData = new FormData();
    formData.append('profile_pic', data);
    uploadImage?.mutate(formData);
  };

  const onPicker = async () => {
    ImageCropPicker?.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      multiple: true,
    }).then(image => {
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

  const onCaptureImage = () =>
    ImageCropPicker?.openCamera({
      width: 500,
      height: 500,
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

  useEffect(() => {
    if (from !== undefined && from === 'notification') {
      setTimeout(() => {
        navigation.navigate('Comments');
      }, 500);
    }
  }, [from]);

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

  const onopenImage = () =>
    Alert.alert('Alert', 'What Would You Like To Do', [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'Upload Image',
        onPress: onPicker,
      },
      {text: 'Capture Image', onPress: onCaptureImage},
    ]);

  const directNotgoing = () => {
    if (vanue?.users?.find(item => item?.user_id == id)?.request_type == 3) {
      displayErrorToast('already not going');
      return;
    } else if (
      vanue?.users?.find(item => item?.user_id == id)?.request_type == 1
    ) {
      vanue?.users?.find(item => item?.user_id == id)?.pricing_data
        ?.different_pricing?.length > 0
        ? LeavinWhenInvited(1)
        : Leaving(1, 1);
    } else notGoing();
  };

  const onNoGoing = () =>
    Alert.alert(
      'Not Going',
      'Are you sure you are not going in this activity ?',

      [
        {text: 'Cancel', onPress: () => {}},
        {
          text: 'Yes',
          onPress: directNotgoing,
        },
        {text: 'No', onPress: () => {}},
      ],
    );

  /**
   * @function AddWishlist
   * @param ActivityId
   * @description this will add to wishlist api
   */

  const AddWishlist = id => {
    var d = wishData || [];

    let p = d?.push(id);
    dispatch({
      type: BookingConstants?.WISHLISTDATA,
      wishData: d,
    });
    AdWishlist(id);
    setSelected(!selected);
  };

  /**
   * @function mutate
   * @description this function will call the createActivity api
   */

  const {mutate: AdWishlist} = useMutation('AddtoWishlist', AddtoWishlist, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || `can't reserve slot now`);
      } else {
        displaySuccessToast(data?.message || 'Added to wishlist');
      }
    },
  });

  /**
   * @function removeWislist
   * @param ActivityId
   * @description this will add to wishlist api
   */

  const removeWislist = id => {
    var d = wishData;

    const index = d.indexOf(id);

    const x = d.splice(index, 1);

    dispatch({
      type: BookingConstants?.WISHLISTDATA,
      wishData: d,
    });
    Remove(id);

    // temp?.push(id);
    setSelected(!selected);
  };

  /**
   * @function Remove
   * @description this function will call the createActivity api
   */

  const {mutate: Remove} = useMutation('RemovetoWishlist', RemovetoWishlist, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || `can't reserve slot now`);
      } else {
        displaySuccessToast(data?.message || 'Removed from wishlist');
      }
    },
  });

  return (
    <Box flex={1}>
      <Header
        title={vanue?.setting?.name}
        left
        onRight
        RenderRightComponent={() =>
          !is_activity_completed && (
            <Box
              flexDirection="row"
              width={wp(15)}
              alignItems="center"
              justifyContent="flex-end">
              <TouchableBox onPress={() => onShare()}>
                <Box>
                  <Image
                    source={Images.Share}
                    style={{height: wp(10), width: wp(10), marginRight: 10}}
                    resizeMode={'contain'}
                  />
                </Box>
              </TouchableBox>
              {/* <TouchableBox
              onPress={() => {
                selected ? removeWislist(vanue?.id) : AddWishlist(vanue?.id);
              }}>
              {Ionicon(
                selected ? 'md-bookmark' : 'md-bookmark-outline',
                20,
                'black',
              )}
            </TouchableBox> */}
              <TouchableBox>
                <Box>
                  {EntypoIcon(
                    'dots-three-vertical',
                    wp(5),
                    palette?.blackshade,
                  )}
                </Box>
              </TouchableBox>
            </Box>
          )
        }
      />

      {vanue?.cancelled_at ? (
        <Box p="l" flexDirection="row" backgroundColor="primary2">
          <FastImage
            source={Images?.CancelledSmiley}
            style={{height: 20, width: 20}}
          />
          <Text ml="m" variant="blackshade16600">
            Sorry, this Activity has been cancelled by Host due to{' '}
            {cancelReasonEnum(vanue?.cancelled_reason)?.name}.
          </Text>
        </Box>
      ) : (
        !is_activity_completed && (
          <ImageBackground
            source={
              vanue?.images?.length > 0 ? {uri: vanue?.images[0]} : Images?.ban
            }
            resizeMode="stretch"
            style={{
              height: wp(35),
              marginBottom: 10,
              justifyContent: 'flex-end',
            }}>
            {/* <TouchableBox onPress={() => onopenImage()}>
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
          </TouchableBox> */}
          </ImageBackground>
        )
      )}

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
          name={is_activity_completed ? 'Summary' : 'Details'}
          children={() => (
            <ActivityDetail
              vanue={vanue}
              state={state}
              setState={setState}
              is_activity_completed={is_activity_completed}
            />
          )}
          initialParams={{vanue}}
        />
        {is_activity_completed ? (
          <>
            {/* <Tab.Screen
              name="Feedback"
              children={() => (
                <Feedback is_activity_completed={is_activity_completed} />
              )}
              initialParams={{vanue}}
            />
            <Tab.Screen
              name="Raise Ticket"
              children={() => <RaiseTicket />}
              initialParams={{vanue}}
            /> */}
          </>
        ) : (
          <>
            <Tab.Screen
              name="RSVP"
              component={RSVP}
              initialParams={{vanue, from: 'Joiner'}}
            />
            {vanue?.users?.find(item => item?.user_id == id)?.request_type ==
            4 ? (
              <Tab.Screen
                name="Comments"
                component={Comments}
                initialParams={{vanue}}
              />
            ) : null}
          </>
        )}
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
      </Tab.Navigator>

      {tabIndex !== 2 &&
        !vanue?.cancelled_at &&
        !is_activity_completed &&
        !vanue?.setting?.is_marked_full &&
        (vanue?.users?.find(item => item?.user_id == id)?.request_type == 1 ||
          vanue?.users?.find(item => item?.user_id == id)?.request_type ==
            2) && (
          <ActButton
            Leftlabel="Going"
            leftdisabled={state.is_incomplete_profile || state.skill_level}
            LeftonPress={() => handleGoing()}
            Rightlabel="Not Going"
            RightonPress={() => onNoGoing()}
          />
        )}

      {tabIndex !== 2 &&
        !vanue?.cancelled_at &&
        !is_activity_completed &&
        !vanue?.setting?.is_marked_full &&
        parseInt(vanue?.setting?.maximum_players) -
          parseInt(
            vanue?.users?.filter(item => item?.request_type == 4)?.length,
          ) !==
          0 &&
        vanue?.users?.find(item => item?.user_id == id)?.request_type == 2 && (
          <ActButton
            Leftlabel="Requested"
            leftdisabled
            LeftonPress={() => {}}
            Rightlabel="Not Going"
            RightonPress={() => onNoGoing()}
          />
        )}

      {tabIndex !== 2 &&
        !vanue?.cancelled_at &&
        !is_activity_completed &&
        !vanue?.setting?.is_marked_full &&
        parseInt(vanue?.setting?.maximum_players) -
          parseInt(
            vanue?.users?.filter(item => item?.request_type == 4)?.length,
          ) !==
          0 &&
        vanue?.users?.find(item => item?.user_id == id)?.request_type == 3 && (
          <ActButton
            Leftlabel="Going"
            leftdisabled={state.is_incomplete_profile || state.skill_level}
            LeftonPress={() => handleGoing()}
            Rightlabel="Not Going"
            icon={true}
            RightonPress={() => onNoGoing()}
          />
        )}

      {tabIndex !== 2 &&
        !vanue?.cancelled_at &&
        !is_activity_completed &&
        !vanue?.setting?.is_marked_full &&
        parseInt(vanue?.setting?.maximum_players) -
          parseInt(
            vanue?.users?.filter(item => item?.request_type == 4)?.length,
          ) !==
          0 &&
        vanue?.users?.find(item => item?.user_id == id)?.request_type == 4 && (
          <Box
            width={wp(100) - 30}
            position={'absolute'}
            bottom={wp(4)}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems="center"
            alignSelf="center">
            <Button
              onPress={() => setVisible(true)}
              label={'Leave'}
              buttonStyle={{
                height: wp(11),
                width: wp(100) - 30,
                marginBottom: 10,
              }}
            />
          </Box>
          //   <ActButton
          //     Leftlabel="Invite People"
          //     // leftdisabled={state.is_incomplete_profile || state.skill_level}
          //     LeftonPress={() => handleInvitePeople()}
          //     Rightlabel="Leave"
          //     RightonPress={() => setVisible(true)}
          //   />
        )}

      {!vanue?.cancelled_at &&
        !is_activity_completed &&
        parseInt(vanue?.setting?.maximum_players) -
          parseInt(
            vanue?.users?.filter(item => item?.request_type == 4)?.length,
          ) !==
          0 &&
        !vanue?.users?.some(item => item?.user_id == id) && (
          <Box
            width={wp(100) - 30}
            position={'absolute'}
            bottom={wp(4)}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems="center"
            alignSelf="center">
            <Button
              onPress={() => handleGoing()}
              label={'Going'}
              buttonStyle={{
                height: wp(11),
                width: wp(100) - 30,
                marginBottom: 10,
              }}
            />
          </Box>
          // <ActButton
          //   Leftlabel="Going"
          //   leftdisabled={state.is_incomplete_profile || state.skill_level}
          //   LeftonPress={() => handleGoing()}
          //   Rightlabel="Invite People"
          //   RightonPress={() => handleInvitePeople()}
          // />
        )}

      {parseInt(vanue?.setting?.maximum_players) -
        parseInt(
          vanue?.users?.filter(item => item?.request_type == 4)?.length,
        ) ==
        0 || vanue?.setting?.is_marked_full ? (
        <Box
          width={wp(100) - 30}
          position={'absolute'}
          bottom={wp(4)}
          flexDirection="row"
          justifyContent={'space-between'}
          alignItems="center"
          alignSelf="center">
          {/* <Button
            // onPress={handleInvitePeople}
            label={'Follow'}
            buttonStyle={{
              height: wp(11),
              width: wp(100) - 30,
              marginBottom: 10,
            }}
          /> */}
        </Box>
      ) : null}

      {state.skill_level && (
        <SetSkill
          state={state}
          setState={setState}
          category_id={category_id}
          game_skill={game_skill}
          refreshPage={refreshPage}
        />
      )}
      {state.is_incomplete_profile && (
        <IncompleteProfile
          state={state}
          setState={setState}
          refreshPage={refreshPage}
        />
      )}
      {state.is_not_enough_skill && (
        <NotEnoughSkill state={state} setState={setState} />
      )}
      {freeActivity && (
        <FreeActivity
          state={state}
          setState={setState}
          activity_id={activity_id}
          refreshPage={refreshPage}
        />
      )}
      {pricing && (
        <Pricing
          state={state}
          setState={setState}
          different_pricing={different_pricing}
          paymentMethod={vanue?.payment?.payment_type}
          fair_price={fair_price}
          genderOption={vanue?.setting?.gender_options}
          years={yer}
          neededPlayer={
            parseInt(vanue?.setting?.maximum_players) -
            parseInt(
              goingUser(vanue?.users?.filter(item => item?.request_type == 4)),
            )
          }
          activity_id={activity_id}
          refreshPage={refreshPage}
        />
      )}
      {state?.inSufficient && (
        <InSufficient state={state} setState={setState} />
      )}
      {activitypaid && <ActivityPaid state={state} setState={setState} />}
      {visible && (
        <LeaveActivityModal
          visible={visible}
          title="Confirm Leaving Activity"
          left={true}
          detail="Reason"
          people={vanue?.users?.find(item => item?.user_id == id)?.num_going}
          buttonLabel={'Leave Activity'}
          different_pricing={
            (vanue?.users?.find(item => item?.user_id == id)?.pricing_data
              ?.different_pricing &&
              vanue?.users?.find(item => item?.user_id == id)?.pricing_data
                ?.different_pricing) ||
            []
          }
          years={yer}
          numData={
            (vanue?.users?.find(item => item?.user_id == id)?.num_going_data &&
              vanue?.users?.find(item => item?.user_id == id)
                ?.num_going_data) ||
            []
          }
          onClose={() => setVisible(false)}
          genderOption={vanue?.setting?.gender_options}
          onItemPress={item => setReason(item)}
          onPress={item => Leaving(item, reason?.value)}
          onRefund={() => {
            setVisible(!visible);
            navigation?.navigate('RefundPolicyActivity');
          }}
        />
      )}
    </Box>
  );
};

export default ActivityPage;
