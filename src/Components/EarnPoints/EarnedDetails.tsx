import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Image, ActivityIndicator} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
  os,
} from '../Theme/Index';
import {Input, Button, Header} from '../ReusableComponents/index';
import {size} from '../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../Helpers/responsive-ratio';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../Constant/Image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';

const EarnedDetails = ({navigation, route}) => {
  const {params} = route;
  const {item} = params;
  const [imageIndex, setImageindex] = useState(0);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const data = useMemo(
    () => [
      {
        id: 1,
        source: Images?.VenueThree,
        popup: false,
      },
    ],
    [],
  );

  return (
    <Box flex={1}>
      <Header
        backSpace={true}
        left={true}
        title={item?.mission?.title}
        RenderRightComponent={() => {
          return (
            <TouchableBox>
              <FastImage source={Images?.LikeHeart} style={styles.heart} />
            </TouchableBox>
          );
        }}
      />
      <ScrollView
        style={{
          flex: 1,
        }}>
        {/* <Carousel
                    panGestureHandlerProps={{
                        activeOffsetX: [-20, 20],
                    }}
                    loop
                    style={{ marginHorizontal: 20 }}
                    pagingEnabled={true}
                    width={wp(90)}
                    height={wp(55)}
                    autoPlay={true}
                    data={data}
                    scrollAnimationDuration={1000}
                    onSnapToItem={index => {
                        setImageindex(index);
                    }}
                    renderItem={({ item, index }) => {
                        const { source, popup } = item;
                        return (
                            <FastImage
                                source={source}
                                style={{
                                    height: wp(55),
                                    width: wp(90),
                                }}
                                resizeMode={FastImage?.resizeMode?.stretch}
                            />
                        );
                    }}
                /> */}
        {/* <Box
                    flex={1}
                    mt="m"
                    ml="l"
                >
                    <Text variant="blackshade18800Medium">{}</Text>
                </Box> */}
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
        <Box mb="xl" ml="l" flexDirection="row" alignItems="center">
          <Box mt="m">
            <AutoHeightWebView
              source={{
                html: item?.mission?.terms_and_conditions,
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
        </Box>
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
            Rewards
          </Text>
        </Box>
        <Box
          height={1}
          mt="m"
          backgroundColor="tertiary2"
          marginHorizontal="l"
        />
        <Box mb="xl" ml="l" flexDirection="row" alignItems="center">
          <Box mt="m">
            <AutoHeightWebView
              source={{
                html: item?.mission?.rewards,
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
        </Box>
        <Box height={100} />
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

export default EarnedDetails;
