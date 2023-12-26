import {createBox} from '@shopify/restyle';
import React, {useEffect} from 'react';
import {Image, Platform, StyleSheet} from 'react-native';
// import {size} from '../Theme';
import {Images} from '../../Constant/Image';
import {wp} from '../Helpers/responsive-ratio';
import LottieView from 'lottie-react-native';
import {size} from '../Theme/Index';
import {useRef} from 'react';
const Box = createBox();

export default ({navigation, route}) => {
  const checkMarkRef = useRef(null);

  /**
   * @function useEffect
   * @description Will change screen in 1.5 seconds
   */
  useEffect(() => {
    //checkMarkRef?.current?.play(0, 90);
    setTimeout(() => {
      navigation.replace('NavigationStack');
    }, 1000);
  }, []);

  return (
    <Box
      flex={1}
      backgroundColor={'primary'}
      style={
        {
          //,
        }
      }
      justifyContent="center"
      alignItems={'center'}>
      <Image
        source={Images.Splash_logo}
        style={styles.imageBackground}
        resizeMode="contain"
      />
      {/* <LottieView
        //ref={checkMarkRef}
        source={require('../../assets/lottie/Flo.json')}
        autoPlay={true}
        loop={true}
        style={{
          height: size?.height,
          width: size?.width,
        }}
      /> */}
      <Image
        source={Images.Splash_logo_afa}
        style={styles.imageBackgroundAfa}
        resizeMode="contain"
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: wp(35),
    height: wp(22),
  },
  imageBackgroundAfa: {
    width: wp(23),
    height: wp(20),
  },
});
