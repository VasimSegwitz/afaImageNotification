import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text as RNText, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Header, LoadingOverlay} from '../../../ReusableComponents';
import {Ionicon} from '../../../ReusableComponents/Icons';
import {
  Box,
  fonts,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import {useQuery} from 'react-query';
import {getAllCemments, postComment} from '../../../Services/Booking';
import {displayErrorToast} from '../../../../utils';
import authStore from '../../../../Zustand/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {useMutation} from 'react-query';
import moment from 'moment';
import Animated, {FadeIn, FadeOut, Transition} from 'react-native-reanimated';

const CommentsItem = ({item}) => {
  const [more, setMore] = useState(false);
  const {user, created_at, message} = item;

  let newMsg = '';
  let showMore = false;

  if (message !== null) {
    const msg = message.split('');
    newMsg = `${message}`.substring(0, 64);
    if (msg.length > 64) {
      showMore = true;
    } else {
    }
  }
  if (more) {
    newMsg = message;
  } else {
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        marginHorizontal: 20,
        //minHeight: 84,
      }}>
      <Box
        mt="m"
        flex={1}
        alignItems="flex-end"
        marginVertical="s"
        ml="s"
        flexDirection="row">
        <Image
          source={user?.image === '' ? Images?.Profile : {uri: user?.image}}
          style={{
            marginTop: 2,
            alignSelf: 'flex-start',
            height: 42,
            width: 42,
            borderRadius: 25,
            marginLeft: 5,
          }}
        />
        <Box
          marginBottom="m"
          borderRadius={10}
          ml="m"
          style={{backgroundColor: `${palette?.primary2}`}}
          paddingHorizontal={'m'}
          paddingVertical="m">
          <Text
            style={{
              fontWeight: '600',
              color: palette.blackshade,
              fontFamily: fonts?.medium,
              fontSize: 14,
            }}>
            {user?.full_name}
          </Text>
          <TouchableWithoutFeedback
            style={{width: size.width / 1.6}}
            onPress={() => {
              setMore(prev => !prev);
            }}>
            <RNText
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: palette.support4,
                fontFamily: fonts?.regular,
              }}>
              {newMsg}{' '}
              {showMore ? (
                <RNText
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: palette.primary,
                    fontFamily: fonts?.regular,
                  }}>
                  {!more ? '...more' : 'less'}
                </RNText>
              ) : null}
            </RNText>
          </TouchableWithoutFeedback>
          <Text variant="placeholder14400">
            {moment(created_at).fromNow(true) + ' ago'}
          </Text>
        </Box>
      </Box>
    </Animated.View>
  );
};

export default CommentsItem;
