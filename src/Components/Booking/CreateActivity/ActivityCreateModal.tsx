import React, {useEffect, useState} from 'react';
import {
  TouchableBox,
  Box,
  Text,
  palette,
  size,
  fonts,
  TypographyStyles,
} from '../../Theme/Index';
import {Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {Images} from '../../../Constant/Image';
import {Button} from '../../ReusableComponents';
import {Down, Ionicon} from '../../ReusableComponents/Icons';

const ActivityCreateModal = ({route, navigation}) => {
  const {newActivity} = route?.params;
  return (
    <Box flex={1} style={styles.content} p="l">
      <Box
        flex={1}
        p={'l'}
        backgroundColor={'white'}
        style={[styles.confirmationModal, TypographyStyles.cardShadow]}>
        {/* <LottieView
              ref={checkMarkRef}
              source={ActivityOpening}
              autoPlay={true}
              loop={false}
            /> */}

        <Box justifyContent={'center'} alignItems={'center'}>
          <Text
            variant={'blackshade20500'}
            fontSize={28}
            textAlign={'center'}
            mt={'l'}
            latterSpacing={1}>
            Hooray!
          </Text>
          {newActivity ? (
            <Text variant={'blackshade16400'} mt="s">
              New Activity Created!
            </Text>
          ) : (
            <Text variant={'blackshade16400'} mt="s">
              Activity Updated!
            </Text>
          )}
          <FastImage
            source={Images.CreatedActivity}
            style={{
              height: wp(70),
              width: wp(70),
              marginVertical: wp(5),
            }}
            resizeMode={'contain'}
          />
          <Text
            variant={'blackshade12400'}
            textAlign={'center'}
            mt="s"
            // fontWeight="400"
          >
            Locate your Activities by accessing “My Profile” located at the
            bottom right of the screen.
          </Text>
        </Box>
        <Box mt={'l'} mb={'m'}>
          <Button
            label="Okay"
            onPress={() => {
              //   setActOpen(false);
              navigation.navigate('Tabs', {screen: 'Home', initial: false});
              // navigation?.navigate('ActivitySearch');
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#00000070',
    justifyContent: 'center',
  },
  closeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: palette.blackshade,
  },
  confirmationModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'center',
    // top: wp(50),
    marginHorizontal: wp(4),
    borderRadius: 15,
  },
});

export default ActivityCreateModal;
