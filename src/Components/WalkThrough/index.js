import React, {useRef} from 'react';
import {ImageBackground} from 'react-native';
import {Images} from '../../Constant/Image';
import authStore from '../../Zustand/store';
import {hp, wp} from '../Helpers/responsive-ratio';
import AppIntroSlider from '../ReusableComponents/Appintro/src';
import Button from '../ReusableComponents/Button';
import {Box, fonts, palette, Text} from '../Theme/Index';

const slides = [
  {
    key: 1,
    title: 'It’s time to play.',
    text: 'Create activity and invite your friends, family, or join one nearby.',
    image: Images?.Walkthrough1,
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'No hassle booking.',
    text: 'Save the sweating for the match, booking venues has never been easier',
    image: Images?.Walkthrough2,
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'One tap payment with AFA Pay.',
    text: 'Earn points and redeem deals for every payment you make with our in-app Wallet.',
    image: Images?.Walkthrough3,
    backgroundColor: '#22bcb5',
  },
];

export default props => {
  const {navigation, route} = props;
  const setWelcome = authStore(state => state?.setWelcome);
  const welcome = authStore(state => state?.welcome);

  const slider = useRef(null);
  const {space} = route?.params;
  const _renderItem = ({item}) => {
    return (
      <ImageBackground
        source={item?.image}
        style={{
          marginBottom: wp(40),
          height: hp(100),
          padding: 20,
          flex: 1,
          width: wp(100),
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <Text variant={'white24600'} textAlign="center">
          {item.title}
        </Text>

        <Text variant={'smokeWhite16400'} textAlign="center">
          {item.text}
        </Text>
      </ImageBackground>
    );
  };

  const _renderNextButton = () => {
    return (
      <Box>
        <Button
          onPress={() => {
            navigation?.navigate('Signup');
            setWelcome({data: true});
          }}
          label={'Get started'}
          buttonStyle={{
            width: wp(100) - 40,
            alignSelf: 'center',
            height: 46,
            borderRadius: 8,
          }}
          textStyle={{
            color: palette?.white,
            fontSize: 16,
            lineHeight: 22,
            fontWeight: '500',
            fontFamily: fonts?.medium,
          }}
        />
      </Box>
    );
  };

  const _renderSkipButton = () => {
    return (
      <Button
        label={'Skip'}
        onPress={() => {
          slider?.current?.goToSlide(2, true);
        }}
        buttonColor="transparent"
        buttonStyle={{
          width: wp(20),
          height: 46,
          position: 'absolute',
          borderRadius: 8,
          top: hp(-95) + space?.top,
          right: wp(-5),
        }}
        textStyle={{
          textDecorationLine: 'underline',
          color: palette?.white,
          fontSize: 14,
          fontWeight: '400',
          fontFamily: fonts?.regular,
        }}
      />
    );
  };

  return (
    <Box
      flex={1}
      backgroundColor="black"
      style={{
        height: '100%',
        width: '100%',
      }}>
      <AppIntroSlider
        renderItem={_renderItem}
        showSkipButton
        ref={slider}
        data={slides}
        renderDoneButton={_renderNextButton}
        renderNextButton={_renderNextButton}
        renderSkipButton={_renderSkipButton}
        onLogin={() => {
          setWelcome({data: true});
          navigation?.navigate('Login');
        }}
        bottomButton
        activeDotStyle={{
          backgroundColor: palette?.primary,
          height: wp(4),
          width: wp(4),
          borderRadius: wp(3),
        }}
        dotStyle={{
          backgroundColor: '#C4C4C4',
          height: wp(4),
          width: wp(4),
          borderRadius: wp(3),
        }}
      />
    </Box>
  );
};
