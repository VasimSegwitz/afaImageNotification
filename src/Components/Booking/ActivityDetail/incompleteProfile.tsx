import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {wp} from '../../Helpers/responsive-ratio';
import {Button} from '../../ReusableComponents';
import {EntypoIcon, feather, Ionicon} from '../../ReusableComponents/Icons';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import styles from './style';

const IncompleteProfile = props => {
  const {state, setState} = props;
  const navigation = useNavigation();
  const {first_name, image} = useSelector(
    state => state?.auth?.user?.user?.data,
  );
  const {phone_verified_datetime} = useSelector(
    state => state?.auth?.user?.user?.data?.user_info,
  );
  const handleDoItNow = () => {
    setState({...state, is_incomplete_profile: false});

    navigation.navigate('EditProfile');
  };
  const handleDoItLater = () =>
    setState({
      ...state,
      is_incomplete_profile: false,
      will_do_later: true,
      reload: true,
    });

  return (
    <Box
      backgroundColor={'white'}
      style={[styles.confirmationModal, TypographyStyles.cardShadow]}
      p={'l'}>
      <TouchableBox
        onPress={handleDoItLater}
        style={{alignItems: 'flex-end', marginTop: -10}}>
        {Ionicon('close', wp(7), palette?.blackshade)}
      </TouchableBox>
      <Text variant={'blackshade20500'}>Complete your profile</Text>
      <Text variant={'blackshade16400'} marginVertical={'l'}>
        Complete your profile to increase your opportunity of being accepted by
        Host
      </Text>
      <Box flexDirection={'row'} alignItems={'center'} mb={'s'}>
        {phone_verified_datetime != null
          ? feather('check-circle', wp(6), 'black')
          : EntypoIcon('circle', wp(6), 'black')}
        <Text mt={'s'} ml={'m'} variant={'blackshade16400'}>
          Verified phone number
        </Text>
      </Box>
      <Box flexDirection={'row'} alignItems={'center'} mb={'s'}>
        {first_name.length > 0
          ? feather('check-circle', wp(6), 'black')
          : EntypoIcon('circle', wp(6), 'black')}
        <Text mt={'s'} ml={'m'} variant={'blackshade16400'}>
          Name
        </Text>
      </Box>
      <Box flexDirection={'row'} alignItems={'center'}>
        {image.length > 0
          ? feather('check-circle', wp(6), 'black')
          : EntypoIcon('circle', wp(6), 'black')}
        <Text mt={'s'} ml={'m'} variant={'blackshade16400'}>
          Profile picture
        </Text>
      </Box>
      <Box height={45} mt={'l'}>
        <Button label="Do it now" onPress={handleDoItNow} />
      </Box>
      <TouchableBox
        mt={'m'}
        style={{marginBottom: -10}}
        onPress={handleDoItLater}>
        <Text textAlign={'center'} variant="placeholder14400">
          I'll do it later
        </Text>
      </TouchableBox>
    </Box>
  );
};

export default IncompleteProfile;
