import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Image, ActivityIndicator} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../Theme/Index';
import {Input, Button, Header} from '../ReusableComponents/index';
import {size, os} from '../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../Helpers/responsive-ratio';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../Constant/Image';
import {
  Tabs,
  CollapsibleRef,
  MaterialTabBar,
  CollapsibleProps,
  TabItemProps,
} from 'react-native-collapsible-tab-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import {returnType} from './ToEarnItem';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
const ToEarnDetails = ({navigation, route}) => {
  const {params} = route;
  const {item} = params;
  const [imageIndex, setImageindex] = useState(0);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  return (
    <Box flex={1} backgroundColor="white">
      <Header backSpace={true} left={true} title="Mission" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: 'white',
        }}
        style={{
          flex: 1,
        }}>
        <Box flex={1}>
          <FastImage
            source={Images?.Booking}
            style={{
              marginTop: 10,
              marginLeft: 20,
              height: wp(10),
              width: wp(10),
            }}
          />
          <Text ml="l" mt="s" variant="blackshade112400">
            {returnType(item?.type)}
          </Text>
          <Box ml="l" mt="m">
            <Text variant="primary24500">{item?.title}</Text>
          </Box>
          <Box alignItems="center" flexDirection="row" ml="l" mt="s">
            <FastImage
              style={{
                height: wp(5),
                width: wp(5),
              }}
              tintColor={palette?.primary}
              source={Images?.Flash}
            />
            <Box>
              <Text variant="primary16500">
                {item?.earning_type === 1
                  ? `${item?.earning_value}`
                  : `RM1 = ${item?.earning_value}`}{' '}
                points
              </Text>
            </Box>
          </Box>
          <Box mt="l">
            <Box ml="l" flexDirection="row" alignItems="center">
              <FastImage
                source={Images?.BeginMission}
                style={{
                  height: wp(8),
                  width: wp(8),
                }}
              />
              <Box ml="l">
                <Text variant="blackshade16800">Begin mission</Text>
              </Box>
            </Box>
            <Box ml="l" flexDirection="row">
              <FastImage
                source={Images?.BeginMission}
                style={{
                  height: wp(8),
                  width: wp(8),
                }}
                tintColor={'white'}
              />
              <Box ml="l">
                <Text variant="blackshade114500">{item?.start_date}</Text>
              </Box>
            </Box>
            <Box alignItems="center" ml="l" flexDirection="row">
              <FastImage
                source={Images?.Challenge}
                style={{
                  height: wp(8),
                  width: wp(8),
                }}
              />
              <Box ml="l">
                <Text variant="blackshade16800">T&C</Text>
              </Box>
            </Box>
            <Box mb="m" ml="l" flexDirection="row" alignItems="center">
              <FastImage
                source={Images?.BeginMission}
                style={{
                  height: wp(8),
                  width: wp(8),
                }}
                tintColor={'white'}
              />
              <Box mt="m">
                <AutoHeightWebView
                  source={{
                    html: item?.terms_and_conditions,
                  }}
                  style={{marginLeft: 20, width: size?.width / 1.3}}
                  customScript={`document.body.style.background = 'white';`}
                  customStyle={`* {font-family: 'Poppins-Regular'}
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
          </Box>
          <Box alignItems="center" ml="l" flexDirection="row">
            <FastImage
              source={Images?.Rewards}
              style={{
                height: wp(8),
                width: wp(8),
              }}
            />
            <Box ml="l">
              <Text variant="blackshade16800">Rewards</Text>
            </Box>
          </Box>
          <Box mb="xl" ml="l" flexDirection="row">
            <FastImage
              source={Images?.BeginMission}
              style={{
                height: wp(8),
                width: wp(8),
              }}
              tintColor={'white'}
            />
            <Box ml="l">
              <Box mt="m">
                <AutoHeightWebView
                  source={{
                    html: item?.rewards,
                  }}
                  style={{width: size?.width / 1.3}}
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
          </Box>
        </Box>
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

export default ToEarnDetails;
