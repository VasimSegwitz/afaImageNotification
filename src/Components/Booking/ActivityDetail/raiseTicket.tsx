import React from 'react';
import {ScrollView, TextInput} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Button} from '../../ReusableComponents';
import {FontistoIcon} from '../../ReusableComponents/Icons';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import {styles} from '../ActivityHost/Feedback/style';

const RaiseTicket = () => {
  const {email} = useSelector(state => state?.auth?.user?.user?.data);
  const {email_verified_datetime} = useSelector(
    state => state?.auth?.user?.user?.data?.user_info,
  );
  const isEmailNotVerified = email_verified_datetime == null;

  return (
    <Box flex={1} p={'l'}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 55}}>
        <Box flexDirection={'row'} mt="m">
          <Box mr="m">
            <FastImage
              source={Images?.Support}
              style={styles?.image}
              resizeMode="contain"
            />
          </Box>
          <Text variant={'blackshade16400'}>
            If any problem arises (Venue not booked, no Players show-up), please
            raise a Ticket to us so we can assist you.
          </Text>
        </Box>
        <Box flexDirection={'row'} mt="l" mb="s" alignItems={'center'}>
          {FontistoIcon('email', wp(7), 'black')}
          <Text variant={'blackshade12900'}>YOUR EMAIL</Text>
        </Box>
        <TextInput
          placeholder={email}
          placeholderTextColor={palette?.placeholder}
          style={styles.emailInputStyle}
          editable={false}
        />
        {isEmailNotVerified && (
          <>
            <Text variant={'blackshade16400'} marginVertical={'m'}>
              This email you used to register but not yet verify, please verify
              it. If you need to change your email address, please go to Edit
              Profile.
            </Text>
            <Box flexDirection={'row'}>
              <TouchableBox borderWidth={1} p="s" borderRadius={5}>
                <Text variant="blackshade12500">Verify Email</Text>
              </TouchableBox>
              <TouchableBox borderWidth={1} p="s" borderRadius={5} ml="l">
                <Text variant="blackshade12500">Edit Profile</Text>
              </TouchableBox>
            </Box>
          </>
        )}
        <Box flexDirection={'row'} mt="l" mb="s" alignItems={'center'}>
          <FastImage
            source={Images?.TicketErrorSad}
            style={styles?.image}
            resizeMode="contain"
          />
          <Text variant={'blackshade12900'} style={{marginLeft: wp(4)}}>
            YOUR MATTER
          </Text>
        </Box>
        <Text variant={'blackshade16400'} marginVertical={'s'}>
          Let us know what was going wrong with the Activity you joined. We will
          try to help.
        </Text>
        <TextInput
          placeholder={'Share with us..'}
          style={[styles.emailInputStyle, {height: wp(25)}]}
          placeholderTextColor={palette?.placeholder}
          placeholderStyle={{marginTop: 5}}
          // onChangeText={handleIssue}
          textAlignVertical="top"
        />
        <TouchableBox onPress={() => {}} mt={'m'}>
          <Box flexDirection="row" alignItems="center" mt="s">
            <FastImage
              source={Images?.AddcoHost}
              style={{
                height: wp(5),
                width: wp(5),
              }}
              resizeMode="contain"
            />
            <Text
              variant="blackshade16400"
              ml="l"
              style={{textDecorationLine: 'underline'}}>
              Attach Screenshot if Required
            </Text>
          </Box>
        </TouchableBox>
      </ScrollView>
      <Box
        width={wp(100) - 30}
        position={'absolute'}
        bottom={wp(4)}
        alignSelf="center">
        <Button
          // onPress={handleRateActivity}
          label={'Submit Review'}
          buttonStyle={{
            height: wp(11),
          }}
        />
      </Box>
    </Box>
  );
};

export default RaiseTicket;
