import React, {useEffect, useState} from 'react';
import {TouchableBox, Box, Text, palette, size} from '../../Theme/Index';
import {Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {Images} from '../../../Constant/Image';
import {Button} from '../../ReusableComponents';

const CheckAvailabilityModal = ({route, navigation}) => {
  const {params} = route;
  const {data, refresh} = params;

  const [imageUrl, setImageUrl] = useState(Images?.FullyBooked);

  useEffect(() => {
    if (data?.data !== undefined) {
      const EMOJI = data.data?.EMOJI;
      if (EMOJI === 1) {
        setImageUrl(Images?.FullyBooked);
      } else if (EMOJI === 2) {
        setImageUrl(Images?.HourBasis);
      } else if (EMOJI === 3) {
        setImageUrl(Images?.MinimumDuration);
      } else if (EMOJI === 4) {
        setImageUrl(Images?.TimePassed);
      }
    }
  }, [data]);

  return (
    <Box flex={1} style={styles.content}>
      <TouchableBox
        flex={1}
        justifyContent="center"
        alignItems="center"
        onPress={() => {
          navigation.goBack(null);
        }}>
        <Box
          alignItems="center"
          justifyContent="space-around"
          paddingHorizontal="l"
          paddingVertical="xl"
          width={size.width - 40}
          //   height={size?.height / 2.9}
          backgroundColor="white"
          marginHorizontal="l"
          //   pt="xl"
          borderRadius={10}>
          <Image
            source={imageUrl}
            style={{height: wp(13), width: wp(13), marginTop: 20}}
          />
          <Box marginHorizontal="t" mt="xl">
            <Text textAlign="center" variant="blackshade16400">
              {data?.message}
            </Text>
          </Box>
          <Box
            height={1}
            width={size.width - 80}
            backgroundColor="tertiary2"
            marginHorizontal="m"
            mt="l"
            mb="l"
          />
          <Box width={wp(100) - 80}>
            <Button
              onPress={() => {
                navigation.goBack(null);
                refresh();
              }}
              label={'Pick Another Time'}
              buttonStyle={{
                height: wp(10),
              }}
            />
          </Box>
        </Box>
      </TouchableBox>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {backgroundColor: 'rgba(0,0,0,.7)'},
});

export default CheckAvailabilityModal;
