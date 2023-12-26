import {useNavigation} from '@react-navigation/native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../Constant/Image';
import {wp} from '../Helpers/responsive-ratio';
import {feather} from '../ReusableComponents/Icons';
import {Box, palette, Text, TouchableBox} from '../Theme/Index';
import styles from './styles';

const About = props => {
  const {user} = useSelector(state => state?.auth?.user);
  const location = useSelector(state => state?.auth?.user?.userlocation);
  const address = location?.name;
  const {gender, email, phone, label, phone_prefix} = user?.data;
  const genderLable = gender == 1 ? 'Male' : gender == 2 ? 'Female' : 'Mixed';

  const navigation = useNavigation();
  const handleEditProfile = () => navigation.navigate('EditProfile');

  return (
    <Box flex={1} backgroundColor="white">
      <Box flexDirection={'row'} alignItems={'center'} mt={'l'}>
        <FastImage
          source={Images.FemaleIcon}
          style={{height: wp(5), width: wp(5)}}
          resizeMode={FastImage?.resizeMode?.contain}
        />
        <Text variant={'blackshade16400'} ml={'l'}>
          {genderLable}
        </Text>
      </Box>
      <Box flexDirection={'row'} mt={'m'} style={{marginLeft: wp(-1.2)}}>
        <FastImage
          source={Images.markerLocation}
          style={{height: wp(7), width: wp(7)}}
          resizeMode={FastImage?.resizeMode?.contain}
        />
        <Text
          variant={'blackshade16400'}
          style={{marginLeft: wp(4.5), width: wp(80)}}>
          {address ? address : '-'}
        </Text>
      </Box>
      <Box flexDirection={'row'} alignItems={'center'} mt={'s'}>
        {feather('mail', wp(5), palette?.warmGrey)}
        <Text variant={'blackshade16400'} ml={'l'}>
          {email}
        </Text>
      </Box>
      <Box flexDirection={'row'} alignItems={'center'} mt={'m'}>
        <FastImage
          source={Images.ContactIcon}
          style={{height: wp(5), width: wp(5)}}
          resizeMode={FastImage?.resizeMode?.contain}
        />
        <Text variant={'blackshade16400'} ml={'l'}>
          {phone_prefix}
          {phone}
        </Text>
      </Box>
      <Box style={styles.aboutdivider} />
    </Box>
  );
};

export default About;
