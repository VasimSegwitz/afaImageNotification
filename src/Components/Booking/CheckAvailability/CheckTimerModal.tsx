import React, {useEffect, useState} from 'react';
import {TouchableBox, Box, Text, palette, size} from '../../Theme/Index';
import {Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {Images} from '../../../Constant/Image';
import {Button} from '../../ReusableComponents';
import FetchTime from '../../ReusableComponents/FetchTime';

const CheckTimerModal = ({route, navigation}) => {
  const {params} = route;
  const {setStarthour, setStartmin} = params;
  const [startHour, setStarthourr] = useState(0);
  const [startMin, setStartminn] = useState(0);

  return (
    <Box flex={1} style={styles.content}>
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        onPress={() => {
          navigation.goBack(null);
        }}>
        <Box
          alignItems="center"
          width={size.width - 40}
          height={size?.height / 3}
          backgroundColor="white"
          marginHorizontal="l"
          borderRadius={10}>
          <Box mt="xl">
            <Text variant="blackshade20500">Select the starting time</Text>
          </Box>
          <Box flexDirection="row" flex={1} alignItems="center">
            <FetchTime
              SelectHours={hour => setStarthourr(hour)}
              SelectMinute={min => setStartminn(min)}
              hour={startHour}
              min={startMin}
              val={13}
            />
          </Box>

          <Box mb="l" width={wp(100) - 80}>
            <Button
              onPress={() => {
                navigation.goBack(null);
                setStarthour(startHour);
                setStartmin(startMin);
              }}
              label={'Done'}
              buttonStyle={{
                height: wp(10),
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {backgroundColor: 'rgba(0,0,0,.7)'},
});

export default CheckTimerModal;
