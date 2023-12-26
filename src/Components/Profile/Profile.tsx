import React, {useEffect, useState} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../Constant/Image';
import BookedHistoryCard from '../Booking/History/bookedHistoryCard';
import ActivitiesUpcoming from '../Dashboard/ActivitiesUpcoming/ActivitiesUpcoming';
import {wp} from '../Helpers/responsive-ratio';
import DashedLine from '../ReusableComponents/DashedLine/dashedLine';
import {feather, Ionicon} from '../ReusableComponents/Icons';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../Theme/Index';
import CompleteProfile from './completeProfile';
import ProfileTab from './profileTab';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import DrawerMenu from './drawerMenu';
import MySportsDrawer from './mySportsDrawer';
import {useQuery} from 'react-query';
import {getActivity, getBooking, getUserProfile} from '../Services/ProfileApi';
import moment from 'moment';
import {Button} from '../ReusableComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authStore from '../../Zustand/store';
import {getIsEmailVerified, getIsWalletActivated} from '../Helpers/utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ios} from '../../utils';
import {AuthConstants} from '../../Redux';
import {activeLevel} from '../Services/RewardsApi';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';

const Profile = props => {
  const inset = useSafeAreaInsets();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const setToken = authStore(state => state?.setToken);
  const setWelcome = authStore(state => state?.setWelcome);

  const {email_verified_datetime} = useSelector(
    state => state?.auth?.user?.user?.data?.user_info,
  );

  const is_wallet_activated = useSelector(
    state => state?.auth?.user?.user?.data?.wallet?.activated_at,
  );

  const {user} = useSelector(state => state?.auth?.user);

  const {user_name} = user?.data;

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

  const initialState = {
    is_menu: false,
    toggle_mysports_drawer: false,
    selected_sport_id: 0,
    game_skill: 0,
    is_logout: false,
  };

  const initialActivityState = {transaction_data: [], new_transaction_data: []};
  const [state, setState] = useState(initialState);
  const [activity, setActivity] = useState(initialActivityState);
  const [booking, setBooking] = useState([]);

  const [isEmailVerified, setIsEmailVerified] = useState('false');
  const [IsWalletActivated, setIsWalletActivated] = useState('false');
  const [completeProfile, setCompleteProfile] = useState(false);

  const [soon, setSoon] = useState(false);
  const [scoreCardMenu, setscoreCardMenu] = useState([
    // { point: 150, footer: 'Points', icon: Images.Points, goto: 'Points' },
    {
      point: user?.data?.total_loyalty_points,
      footer: 'Points',
      icon: Images.Points,
      goto: 'MyPoints',
    },
    {
      point: null,
      footer: 'Activities',
      icon: Images.Points,
      goto: 'Activities',
    },
    {point: null, footer: 'Friends', icon: Images.Points, goto: null},
  ]);
  // const scoreCardMenu = [
  //   // { point: 150, footer: 'Points', icon: Images.Points, goto: 'Points' },
  //   {
  //     point: user?.data?.total_loyalty_points,
  //     footer: 'Points',
  //     icon: Images.Points,
  //     goto: "MyPoints",
  //   },
  //   { point: null, footer: 'Activities', icon: Images.Points, goto: "Activities" },
  //   { point: null, footer: 'Friends', icon: Images.Points, goto: null },
  // ];
  const IsEmailVerifiedHelper = async () => {
    return await getIsEmailVerified()
      .then(val => {
        setIsEmailVerified(val);
      })
      .catch(error => {});
  };

  const IsWalletActivatedHelper = async () => {
    return await getIsWalletActivated()
      .then(val => {
        setIsWalletActivated(val);
      })
      .catch(error => {});
  };

  const handleMenu = () => setState({...state, is_menu: !state.is_menu});
  const handleEditProfile = () => navigation.navigate('EditProfile');
  const handleActivityShowMore = () => navigation.navigate('MyActivity');

  const activityReqBody = {status: 1, per_page: 2, page: 1};
  const getActivityQuery = useQuery(
    ['getActivity', activityReqBody],
    getActivity,
    {
      onSuccess: result => {
        const currentDate = moment().format('YYYY-MM-DD');
        const currentTime = moment().format('HH:mm');
        setActivity({
          ...activity,
          transaction_data:
            activity.transaction_data.concat(
              (result?.data?.data).filter(data => data.date >= currentDate),
            ) || [],
          new_transaction_data: result?.data?.data || [],
        });
      },
      onError: error => {},
    },
  );

  const bookingReqBody = {status: 2, per_page: 10, page: 1};

  const getBookingQuery = useQuery(['getBooking', bookingReqBody], getBooking, {
    onSuccess: result => {
      setBooking(
        result?.data
          .sort((a, b) => moment(a.date).diff(b.date))
          .filter(data => data.date >= moment().format('YYYY-MM-DD')),
      );
    },
    onError: error => {},
  });

  useEffect(() => {
    if (user?.data?.total_loyalty_points !== scoreCardMenu[0]?.point) {
      let countList = [...scoreCardMenu];
      countList[0].point = user?.data?.total_loyalty_points;
    }
  }, [user]);

  const getActivityLevel = () => {
    activeLevel()
      .then(response => {
        if (response?.success == 1) {
          const {data} = response;
          const {count} = data;
          let countList = [...scoreCardMenu];
          countList[1].point = count;
          setscoreCardMenu(countList);
        } else {
        }
      })
      .catch(error => {});
  };

  useEffect(() => {
    // getActivityQuery.refetch()
    getActivityLevel();
    getUserProfileQuery?.refetch();
    getBookingQuery.refetch();
    IsEmailVerifiedHelper();
    IsWalletActivatedHelper();
    setCompleteProfile(
      (email_verified_datetime == null && isEmailVerified != 'true') ||
        (is_wallet_activated == null && IsWalletActivated != 'true'),
    );
  }, [isFocused]);

  const handleGoto = (data, obj) => data && navigation.navigate(data, obj);

  const logout = () => {
    AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys));
    setToken({token: ''});
    setWelcome({data: 'login'});
  };

  const handleOverlay = () => {
    if (state.is_menu) setState({...state, is_menu: false});
    if (state.is_logout) setState({...state, is_logout: false});
  };

  return (
    <Box flex={1} backgroundColor={'white'}>
      {(state.is_logout || state.is_menu) && (
        <TouchableBox style={styles.overLay} onPress={handleOverlay} />
      )}
      <Box
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        marginHorizontal={'m'}
        style={{marginTop: inset?.top}}>
        <TouchableBox onPress={handleMenu}>
          {feather('menu', wp(8), palette?.warmGrey)}
        </TouchableBox>
        <Text variant={'blackshade16500'}>User profile</Text>
        <TouchableBox onPress={handleEditProfile}>
          <FastImage
            source={Images.EditProfile}
            style={{height: wp(12), width: wp(12)}}
            resizeMode={FastImage?.resizeMode?.contain}
          />
        </TouchableBox>
      </Box>

      {state.is_menu && (
        <Animated.View
          entering={SlideInLeft}
          exiting={FadeOutLeft}
          style={[
            styles.confirmationModal,
            TypographyStyles.cardShadow,
            TypographyStyles.container,
            {
              height: ios
                ? Dimensions.get('window').height - inset?.top
                : Dimensions.get('window').height,
              width: Dimensions.get('window').width - wp(15),
              zIndex: state.is_logout ? 5 : 15,
              borderRadius: 0,
              marginHorizontal: 0,
              top: ios ? inset?.top : 0,
            },
          ]}>
          <DrawerMenu state={state} setState={setState} />
        </Animated.View>
      )}

      {state.is_logout && (
        <Animated.View
          entering={SlideInUp}
          exiting={FadeOut}
          style={[
            styles.confirmationModal,
            TypographyStyles.cardShadow,
            TypographyStyles.container,
            {zIndex: 15},
          ]}>
          <Box
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            marginHorizontal={'l'}
            marginVertical={'l'}
            mt={'xl'}>
            <Text variant={'blackshade20500'}>Leaving already?</Text>
            <TouchableBox
              style={{top: wp(-4), marginRight: wp(-2)}}
              onPress={() => setState({...state, is_logout: false})}>
              {Ionicon('close', wp(7), palette?.blackshade)}
            </TouchableBox>
          </Box>
          <Text marginHorizontal={'l'} variant={'blackshade16400'}>
            Are you sure you want to log out? You will lose any unsaved data or
            progress.
          </Text>
          <Box height={46} marginHorizontal={'l'} mt={'l'}>
            <Button label="LOG OUT" onPress={logout} />
          </Box>
          <TouchableBox
            style={{
              alignItems: 'center',
              marginTop: wp(2),
              marginBottom: wp(2),
            }}
            onPress={() => setState({...state, is_logout: false})}>
            <Text variant="blackshade14400" marginVertical={'s'}>
              Cancel
            </Text>
          </TouchableBox>
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box flexDirection={'row'} alignItems={'center'} marginVertical={'l'}>
          <FastImage
            source={
              user && user?.data?.image
                ? {uri: user?.data?.image}
                : Images.Profile
            }
            style={styles.image}
            resizeMode={FastImage?.resizeMode?.cover}
          />
          <Box ml={'m'} justifyContent={'flex-start'}>
            <Text variant={'blackshade24500'} style={{width: wp(65)}}>
              {user?.data?.first_name && user?.data?.first_name}{' '}
              {user?.data?.last_name && user?.data?.last_name}
            </Text>
            <Box flexDirection={'row'} alignItems={'center'} mt="vs">
              {/* <Box mb={'s'}>{feather('zap', wp(4), palette?.warmGrey)}</Box> */}
              <Box>
                <FastImage
                  source={Images.Profile}
                  style={{height: wp(4), width: wp(4)}}
                  resizeMode={FastImage?.resizeMode?.cover}
                />
              </Box>
              <Text variant="placeholder14400" ml={'s'}>
                {user_name}
                {/* Super Active */}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box flexDirection={'row'} alignItems={'center'}>
          {scoreCardMenu.map((data, i) => {
            return (
              <TouchableBox
                key={i}
                backgroundColor={'white'}
                style={[styles.parentScoreCard, TypographyStyles.cardShadow]}
                onPress={() => {
                  data?.goto ? handleGoto(data?.goto, data) : setSoon(!soon);
                }}>
                <Box style={[styles.scoreCard]}>
                  <Text variant={'blackshade18500'}>
                    {data.point !== null ? parseInt(data.point) : '-'}
                  </Text>
                  <FastImage
                    source={data.icon}
                    style={{height: wp(6), width: wp(6)}}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                </Box>
                <Text variant={'placeholder14400'}>{data.footer}</Text>
              </TouchableBox>
            );
          })}
        </Box>
        <Box style={styles.divider} />

        {/* <Box
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          style={{ marginHorizontal: wp(4) }}>
          <Text variant={'blackshade18500'}>My Active level</Text>
          <TouchableBox>
            <Text variant={'primary12500'}>Learn more</Text>
          </TouchableBox>
        </Box>
        <Box alignItems={'center'} mt={'l'}>
          <FastImage
            source={Images.ProfileWarmingUp}
            style={{ height: wp(60), width: wp(60) }}
            resizeMode={FastImage?.resizeMode?.contain}
          />
        </Box>
        <Box style={styles.timelineHeader}>
          <Text
            paddingHorizontal={'m'}
            paddingVertical={'m'}
            variant={'white12500'}>
            Warming up
          </Text>
        </Box>
        <Box style={styles.activityMeter}>
          <Text
            variant={'white12500'}
            style={{ marginTop: 2 }}
            textAlign={'center'}>
            55
          </Text>
        </Box>
        <DashedLine length={20} color={palette.primary} circleSize={3} circleLength={4} justifyContent='space-evenly' />
        <Text variant={'blackshade14400'} textAlign={'center'} marginTop={'m'}>
          Hooray! Only 45 more Activities to reach Active level. Let's keep
          going!
        </Text> */}

        {completeProfile && (
          <>
            <Text
              variant={'blackshade18500'}
              mb={'m'}
              style={{marginLeft: wp(4), marginTop: wp(-4)}}>
              Complete Profile
            </Text>
            <CompleteProfile
              is_email_verified={email_verified_datetime}
              is_wallet_activated={is_wallet_activated}
            />
          </>
        )}

        <Box style={{marginHorizontal: wp(4)}} mt="m">
          <Box
            alignItems="center"
            justifyContent="space-between"
            flexDirection="row">
            <Text variant="blackshade18Medium">My Activities</Text>
            <TouchableBox onPress={handleActivityShowMore}>
              <Text variant="primary12Regular">Show more</Text>
            </TouchableBox>
          </Box>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{marginVertical: 20}}>
            {[activity.transaction_data[0]].length <= 0 ||
            activity.transaction_data[0] == undefined ? (
              <Box flex={1} justifyContent={'center'} alignItems={'center'}>
                <Text variant="blackshade16500">No Upcoming Activities</Text>
              </Box>
            ) : (
              [activity.transaction_data[0]].map((data, index) => {
                return (
                  <ActivitiesUpcoming
                    key={index}
                    showGoing={false}
                    data={data}
                  />
                );
              })
            )}
          </Animated.View>
        </Box>

        <Box mt="s">
          <Box
            alignItems="center"
            justifyContent="space-between"
            flexDirection="row"
            style={{marginHorizontal: wp(4)}}>
            <Text variant="blackshade18Medium">My Bookings</Text>
            <TouchableBox
              onPress={() => navigation?.navigate('BookingHistory')}>
              <Text variant="primary12Regular">Show more</Text>
            </TouchableBox>
          </Box>
          <Box marginVertical="l">
            <BookedHistoryCard
              profile={true}
              data={booking.length > 0 ? [booking[0]] : []}
            />
          </Box>
        </Box>
        <ProfileTab drawer={state} setDrawer={setState} />
      </ScrollView>
      {state.toggle_mysports_drawer && (
        <MySportsDrawer state={state} setState={setState} />
      )}
      {soon && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          style={[
            {
              flex: 1,
              backgroundColor: 'white',
              padding: 20,
            },
            TypographyStyles.cardShadow,
            {
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
    </Box>
  );
};

export default Profile;
