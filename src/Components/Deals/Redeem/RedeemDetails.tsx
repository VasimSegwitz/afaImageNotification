import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Image, ActivityIndicator} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {Input, Button, Header} from '../../ReusableComponents/index';
import {size, os} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
//import Clipboard from '@react-native-clipboard/clipboard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import moment from 'moment';
import Carousel from 'react-native-reanimated-carousel';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {redeemVoucher} from '../../Services/RewardsApi';
import {displayErrorToast, displaySuccessToast} from '../../../utils';

const RedeemDetails = ({navigation, route}) => {
  const {params} = route;
  const {item} = params;
  const {user} = useSelector(state => state?.auth?.user);
  const [imageIndex, setImageindex] = useState(0);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const data = useMemo(
    () => [
      {
        id: 1,
        source: Images?.VenueImage,
        popup: false,
      },
    ],
    [],
  );

  return (
    <Box flex={1} backgroundColor="white">
      <Header
        backSpace={true}
        left={true}
        title={`Your points: ${user?.data?.total_loyalty_points}`}
      />
      <ScrollView
        style={{
          flex: 1,
        }}>
        {item.reward?.images.length > 0 ? (
          <Carousel
            panGestureHandlerProps={{
              activeOffsetX: [-20, 20],
            }}
            loop
            style={{marginHorizontal: 20}}
            pagingEnabled={true}
            width={wp(90)}
            height={wp(55)}
            autoPlay={true}
            data={item.reward?.images}
            scrollAnimationDuration={1000}
            onSnapToItem={index => {
              setImageindex(index);
            }}
            renderItem={({item, index}) => {
              return (
                <Image
                  source={{uri: item}}
                  style={{
                    height: wp(55),
                    width: wp(90),
                  }}
                  resizeMode={FastImage?.resizeMode?.stretch}
                />
              );
            }}
          />
        ) : null}

        <Box flex={1} mt="m" ml="l">
          <Text variant="blackshade18800Medium">{item.reward?.title}</Text>
          <Box mt="s" flexDirection="row" alignItems="center">
            <FastImage
              source={Images?.Points}
              style={{
                height: wp(5),
                width: wp(5),
              }}
              resizeMode={FastImage?.resizeMode?.stretch}
            />
            <Text ml="s" variant="primary16500Medium">
              {item.reward?.cost} points
            </Text>
          </Box>
        </Box>

        <Box
          mt="l"
          marginHorizontal="l"
          flexDirection="row"
          alignItems="center">
          <FastImage
            source={Images?.ProductDetails}
            style={{
              height: wp(5),
              width: wp(5),
            }}
            resizeMode={FastImage?.resizeMode?.stretch}
          />
          <Text ml="s" variant="blackshade16800">
            Product Details
          </Text>
        </Box>
        <Box
          height={1}
          mt="m"
          backgroundColor="tertiary2"
          marginHorizontal="l"
        />
        {item?.details !== null ? (
          <Box mt="m" ml="l">
            <AutoHeightWebView
              source={{
                html: `${item?.reward?.details}`,
              }}
              style={{width: size?.width - 40}}
              customScript={`document.body.style.background = 'white';`}
              customStyle={`
                * {
                  font-family: 'Poppins-Regular'';
                }
                p {
                  font-size: 16px;
                }
              `}
              scrollEnabled="false"
              onSizeUpdated={size => {}}
              files={[
                {
                  href: 'cssfileaddress',
                  type: 'text/css',
                  rel: 'stylesheet',
                },
              ]}
              viewportContent={'width=device-width, user-scalable=yes'}
            />
          </Box>
        ) : null}

        <Box
          mt="l"
          marginHorizontal="l"
          flexDirection="row"
          alignItems="center">
          <FastImage
            source={Images?.FAQ}
            style={{
              height: wp(5),
              width: wp(5),
            }}
            resizeMode={FastImage?.resizeMode?.stretch}
          />
          <Text ml="s" variant="blackshade16800">
            FAQ
          </Text>
        </Box>
        <Box
          height={1}
          mt="m"
          backgroundColor="tertiary2"
          marginHorizontal="l"
        />
        {item?.reward?.faq !== null ? (
          <Box mt="m" ml="l">
            <AutoHeightWebView
              source={{
                html: `${item?.reward?.faq}`,
              }}
              style={{width: size?.width - 40}}
              customScript={`document.body.style.background = 'white';`}
              customStyle={`
              * {
                font-family: 'Poppins-Regular'';
              }
              p {
                font-size: 16px;
              }
            `}
              scrollEnabled="false"
              onSizeUpdated={size => {}}
              files={[
                {
                  href: 'cssfileaddress',
                  type: 'text/css',
                  rel: 'stylesheet',
                },
              ]}
              viewportContent={'width=device-width, user-scalable=yes'}
            />
          </Box>
        ) : null}

        <Box
          mt="l"
          marginHorizontal="l"
          flexDirection="row"
          alignItems="center">
          <FastImage
            source={Images?.Terms}
            style={{
              height: wp(5),
              width: wp(5),
            }}
            resizeMode={FastImage?.resizeMode?.stretch}
          />
          <Text ml="s" variant="blackshade16800">
            Terms & Conditions
          </Text>
        </Box>
        <Box
          height={1}
          mt="m"
          backgroundColor="tertiary2"
          marginHorizontal="l"
        />
        {item?.reward?.terms !== null ? (
          <Box mt="m" ml="l">
            <AutoHeightWebView
              source={{
                html: `${item?.reward?.terms}`,
              }}
              style={{width: size?.width - 40}}
              customScript={`document.body.style.background = 'white';`}
              customStyle={`
              * {
                font-family: 'Poppins-Regular'';
              }
              p {
                font-size: 16px;
              }
            `}
              scrollEnabled="false"
              onSizeUpdated={size => {}}
              files={[
                {
                  href: 'cssfileaddress',
                  type: 'text/css',
                  rel: 'stylesheet',
                },
              ]}
              viewportContent={'width=device-width, user-scalable=yes'}
            />
          </Box>
        ) : null}
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  heart: {
    height: wp(10),
    width: wp(10),
  },
  points: {
    height: wp(5),
    width: wp(5),
  },
  dashed: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: palette?.primary,
  },
  boxx: {
    height: wp(24),
    width: wp(24),
  },
  content: {flexGrow: 1},
  headerImage: {
    height: wp(51),
    width: wp(100),
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 1,
  },
});

export default RedeemDetails;
