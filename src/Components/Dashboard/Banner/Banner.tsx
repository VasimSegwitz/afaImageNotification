import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
} from 'react-native';
import theme, {Box, palette, Text, TouchableBox} from '../../Theme/Index';

// old

// const Banner1 = require('../../../assets/Home/Banner/1.png');
// const Banner2 = require('../../../assets/Home/Banner/2.png');

// new

const Banner1 = require('../../../assets/Home/Banner/Banner/Advertise_with_us.png');
const Banner2 = require('../../../assets/Home/Banner/Banner/image-2.png');
const Banner3 = require('../../../assets/Home/Banner/Banner/image-3.png');
const Banner4 = require('../../../assets/Home/Banner/Banner/image-4.png');

import Carousel from 'react-native-reanimated-carousel';
import {size} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {useQuery} from 'react-query';
import {getBanner} from '../../Services/Booking';
import {useNavigation} from '@react-navigation/native';
import {ios} from '../../../utils';
const Banner = props => {
  const navigation = useNavigation();
  const {setBannerPopUp} = props;
  const [data, setData] = useState([]);

  // const data = useMemo(
  //   () => [
  //     {
  //       id: 1,
  //       source: Banner1,
  //       popup: true,
  //       // url: 'https://shp.ee/7mnqgq9',
  //       url: 'http://wa.me/60182063015',
  //     },
  //     {
  //       id: 2,
  //       source: Banner4,
  //       popup: true,
  //       // url: 'https://forms.gle/wR45GRiHFRJAhceD8',
  //       url: ios
  //         ? 'https://forms.gle/wR45GRiHFRJAhceD8'
  //         : 'https://docs.google.com/forms/d/e/1FAIpQLSdkYMWd17ZpIzuJqs8HQZ43JV4MlF5-5xd7GLjycGEd1oDA2w/viewform',
  //     },

  //     {
  //       id: 3,
  //       source: Banner3,
  //       popup: true,
  //       url: 'https://shopee.com.my/smazh.premium.outlet',
  //       // url: ios
  //       //   ? 'https://forms.gle/wR45GRiHFRJAhceD8'
  //       //   : 'https://docs.google.com/forms/d/e/1FAIpQLSdkYMWd17ZpIzuJqs8HQZ43JV4MlF5-5xd7GLjycGEd1oDA2w/viewform',
  //     },
  //   ],
  //   [],
  // );

  const getBannerQuery = useQuery('getBanner', getBanner, {
    onSuccess: result => {
      setData(result?.data);
    },
    onError: error => {
      // setData(result?.data);
    },
  });

  useEffect(() => {
    getBannerQuery.refetch();
  }, []);

  const [imageIndex, setImageindex] = useState(0);
  return (
    <Box>
      <Carousel
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        loop
        pagingEnabled={true}
        width={wp(100)}
        height={wp(55)}
        autoPlay={true}
        data={data}
        scrollAnimationDuration={1000}
        onSnapToItem={index => {
          setImageindex(index);
        }}
        renderItem={({item, index}) => {
          const {popup, external_url, images} = item;
          const newImage = {uri: images[0]};

          return (
            <TouchableBox
              onPress={() =>
                external_url !== null
                  ? navigation?.navigate('OpenWeb', {url: external_url})
                  : setBannerPopUp(popup)
              }>
              <Image
                source={newImage}
                style={{
                  height: wp(55),
                  width: wp(100),
                }}
                resizeMode={FastImage?.resizeMode?.stretch}
              />
            </TouchableBox>
          );
        }}
      />
      <Box>
        <ScrollView
          horizontal={true}
          style={{
            alignSelf: 'center',
            bottom: 45,
            backgroundColor: 'transparent',
          }}>
          {data?.map((item, index) => {
            return (
              <Box
                height={10}
                width={10}
                m="s"
                alignSelf="center"
                borderRadius={10}
                backgroundColor={imageIndex == index ? 'primary' : 'white'}
              />
            );
          })}
        </ScrollView>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
});

export default memo(Banner);
