import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Button} from '../../ReusableComponents';
import {Ionicon} from '../../ReusableComponents/Icons';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import styles from './style';
import {going} from '../../Services/ProfileApi';
import {useMutation, useQuery} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {ActivityConstants} from '../../../Redux';
import {getSingleActivity, requestActivity} from '../../Services/Booking';
import authStore from '../../../Zustand/store';
import {useSelector} from 'react-redux';

const FreeActivity = props => {
  const {state, setState, activity_id, refreshPage} = props;
  const navigation = useNavigation();
  const [count, setCount] = useState(1);
  const [join, setJoin] = useState(false);

  const {id} = useSelector(state => state?.auth?.user?.user?.data);

  const confirmJoin = () => {
    if (vanue?.users?.some(item => item?.user_id == id))
      mutate({
        id: activity_id,
        body: {
          peoples: count,
        },
      });
    else
      request({
        id: activity_id,
        body: {
          peoples: count,

          is_link: is_link,
        },
      });
  };

  const handleJoinActivity = () => {
    setJoin(true);
  };
  const handleClose = () => setState({...state, is_free_activity: false});
  const setVanue = authStore(state => state?.setVanue);
  const setlink = authStore(state => state?.setlink);

  const {vanue} = authStore(state => state?.vanue);
  const {is_link} = authStore(state => state?.is_link);

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getActivity = useQuery(
    ['getSingleActivity', activity_id],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        setVanue({
          vanue: data?.data,
        });
        setlink({
          is_link: false,
        });
        // navigation?.setParams({vanue: data?.data});
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  const {mutate: request} = useMutation('requestActivity', requestActivity, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
      setState({
        is_free_activity: false,
      });
    },
    onError: error => {
      setState({
        is_free_activity: false,
      });
      displayErrorToast(error?.data?.message);
    },
  });

  const {mutate} = useMutation('going', going, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
      setState({
        is_free_activity: false,
      });
    },
    onError: error => {
      setState({
        is_free_activity: false,
      });
      displayErrorToast(error?.data?.message);
    },
  });

  return (
    <Box
      backgroundColor={'white'}
      style={[styles.confirmationModal, TypographyStyles.cardShadow]}
      p={'l'}>
      <TouchableBox
        onPress={handleClose}
        style={{alignItems: 'flex-end', marginTop: -10}}>
        {Ionicon('close', wp(7), palette?.blackshade)}
      </TouchableBox>
      {!join ? (
        <>
          <Text variant={'blackshade20500'} mb={'l'}>
            You go alone or with your friends?
          </Text>
          <Text variant={'blackshade16400'}>
            You can help to reserve a slot for your friend also. Please choose
            how many people join the Activity with you.
          </Text>
          <Box
            mt="l"
            justifyContent="space-between"
            flexDirection="row"
            alignItems="center">
            <Box flexDirection="row" alignItems="center">
              <Text variant="blackshade16800Regular">Players</Text>
              <Text variant="blackshade116500Regular" ml="s">
                (incl. you)
              </Text>
            </Box>
            <Box flexDirection="row">
              <TouchableBox onPress={() => count > 0 && setCount(count - 1)}>
                <FastImage
                  resizeMode={FastImage?.resizeMode?.contain}
                  source={Images.Minus}
                  style={{height: 34, width: 34}}
                />
              </TouchableBox>
              <Box backgroundColor="primary3" borderRadius={5}>
                <Text variant="blackshade18800Regular" m="s">
                  {count < 10 ? '0' + count : count}
                </Text>
              </Box>
              <TouchableBox onPress={() => setCount(count + 1)}>
                <FastImage
                  resizeMode={FastImage?.resizeMode?.contain}
                  source={Images.Plus}
                  style={{height: 34, width: 34}}
                />
              </TouchableBox>
            </Box>
          </Box>
          <Box height={45} mt={'l'}>
            <Button label="Join Activity" onPress={handleJoinActivity} />
          </Box>
        </>
      ) : (
        <>
          <Text variant={'blackshade20500'} mb={'l'}>
            Confirm join Activity?
          </Text>
          <Text variant={'blackshade16400'}>
            Our Host has been putting efforts to arrange activities. Please send
            the request if you are quite sure to attend.
          </Text>
          <Box marginVertical={'l'}>
            <Text variant="blackshade14500">
              By joining Activity, I’m agreeing with the Refund Policy
            </Text>
          </Box>
          <Box height={45}>
            <Button label="Confirm Join Activity" onPress={confirmJoin} />
          </Box>
        </>
      )}
      <TouchableBox mt={'m'} style={{marginBottom: -10}} onPress={handleClose}>
        <Text textAlign={'center'} variant="placeholder14400">
          Cancel
        </Text>
      </TouchableBox>
    </Box>
  );
};

export default FreeActivity;
