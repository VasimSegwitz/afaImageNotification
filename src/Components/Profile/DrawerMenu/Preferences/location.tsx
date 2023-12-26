import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Box, Text, TouchableBox, TypographyStyles} from '../../../Theme/Index';

const Location = () => {
  const navigation = useNavigation();

  const l = useSelector(state => state?.auth?.user?.userlocation);
  var g = l?.name.split(',');
  const loc = g.splice(g.length - 3).join(',');

  const [location, setLocation] = useState((loc && loc) || '');
  const onLocationSelect = item => {
    setLocation(item);
  };
  return (
    <Box>
      <Text variant="blackshade16400" mb={'m'}>
        Once you set your preferred location, the Venues or Activities nearby
        will be shown based on it.
      </Text>
      <TouchableBox
        onPress={() => {
          navigation?.navigate('ChangeLocation', {
            setLocation: onLocationSelect,
          });
        }}
        flexDirection="row"
        borderRadius={10}
        height={40}
        m="vs"
        backgroundColor={'primary2'}
        justifyContent="center"
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 1,
            height: 0.5,
          },
          shadowOpacity: 0.15,
          shadowRadius: 2.62,
          elevation: 4,
        }}
        alignItems="center">
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
        <Text
          textTransform="uppercase"
          numberOfLines={2}
          variant="blackshade14800"
          style={{width: wp(75)}}>
          {loc ? loc : 'Select Location'}
        </Text>
      </TouchableBox>
    </Box>
  );
};

export default Location;
