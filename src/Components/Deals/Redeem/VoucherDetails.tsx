import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {
  Input,
  Button,
  Header,
  LoadingOverlay,
} from '../../ReusableComponents/index';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {size, os} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import WebView from 'react-native-webview';
import {redeemVoucher} from '../../Services/RewardsApi';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import moment from 'moment';

const VoucherDetails = ({navigation, route}) => {
  const {params} = route;
  const {item, refresh} = params;
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state?.auth?.user);
  const [imageIndex, setImageindex] = useState(0);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const redeem = () => {
    Alert.alert('Redeem', 'Are you sure you want to redeem?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setLoading(true);
          redeemVoucher(item?.id)
            .then(response => {
              setLoading(false);
              const {success} = response;
              if (success === 1) {
                displaySuccessToast('Voucher has been redeemed successfully.');
                navigation.goBack(null);
                refresh();
              }
            })
            .catch(error => {
              setLoading(false);
              const {data} = error;
              if (data?.message === 'Loyalty points not enough to redeem') {
                navigation.navigate('NoPointsModal');
              } else {
                displayErrorToast(data?.message);
              }
            });
        },
      },
    ]);
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Header
        backSpace={true}
        left={true}
        title={`Your points: ${user?.data?.total_loyalty_points}`}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        {item.images.length > 0 ? (
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
            data={item.images}
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
        <Box
          //flex={1}
          mt="m"
          ml="l">
          <Text variant="blackshade18800Medium">{item.title}</Text>
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
              {item.cost} points
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
          <Box mt="m">
            <AutoHeightWebView
              source={{
                html: `${item?.details}`,
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
        {item?.faq !== null ? (
          <Box mt="m" ml="l">
            <AutoHeightWebView
              source={{
                html: `${item?.faq}`,
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
        {item?.terms !== null ? (
          <Box mt="m">
            <AutoHeightWebView
              source={{
                html: `${item?.terms}`,
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
          paddingHorizontal="l"
          paddingBottom="l"
          paddingTop="m"
          backgroundColor="white"
          flex={1}
          justifyContent="flex-end">
          <Box height={wp(10)}>
            <Button
              onPress={() => {
                redeem();
              }}
              label={'Redeem'}
              buttonStyle={{
                height: wp(10),
              }}
            />
          </Box>
        </Box>
      </ScrollView>

      {loading ? <LoadingOverlay /> : null}
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

export default VoucherDetails;
