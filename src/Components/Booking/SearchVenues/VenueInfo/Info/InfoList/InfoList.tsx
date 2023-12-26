import React, {memo, useEffect, useMemo, useState, useReducer} from 'react';
import {
  ScrollView,
  StyleSheet,
  SectionList,
  TouchableWithoutFeedback,
  Image,
  LayoutAnimation,
} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
} from '../../../../../Theme/Index';
import Animated, {
  useAnimatedRef,
  measure,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  runOnUI,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../../../Helpers/responsive-ratio';
const Time = require('../../../../../../assets/Home/Time/Time.png');
const Dollar = require('../../../../../../assets/Home/Dollar/Dollar.png');
const Amenity = require('../../../../../../assets/Booking/SearchResults/Amenity/Amenity.png');
const Parking = require('../../../../../../assets/Booking/SearchResults/Parking/Parking.png');
const Surau = require('../../../../../../assets/Booking/SearchResults/Surau/Surau.png');
const Food = require('../../../../../../assets/Booking/SearchResults/Food/Food.png');
const Drink = require('../../../../../../assets/Booking/SearchResults/Drink/Drink.png');
const BelowArrow = require('../../../../../../assets/Booking/SearchResults/BelowArrow/BelowArrow.png');
const CenterLayout = require('../../../../../../assets/Booking/SearchResults/CenterLayout/CenterLayout.png');
const CenterLayoutImage = require('../../../../../../assets/Booking/SearchResults/CenterLayoutImage/CenterLayoutImage.png');
const CenterPolicy = require('../../../../../../assets/Booking/SearchResults/CenterPolicy/CenterPolicy.png');
import Chevron from './Chevron';
import moment from 'moment';
import {
  facilityPrice,
  PriceListing,
} from '../../../../../Helpers/HelperFunctions';
import AccordianButton from '../../../../../ReusableComponents/AccordianButton';
// import {facilityPrice} from '../../../../Helpers/HelperFunctions';

// const List = ({ Childen }) => {
//   const aref = useAnimatedRef<View>();
//   const open = useSharedValue(false);
//   const progress = useDerivedValue(() =>
//     open.value ? withSpring(1) : withTiming(0)
//   );
//   const height = useSharedValue(0);
//   const headerStyle = useAnimatedStyle(() => ({
//     borderBottomLeftRadius: progress.value === 0 ? 8 : 0,
//     borderBottomRightRadius: progress.value === 0 ? 8 : 0,
//   }));
//   const style = useAnimatedStyle(() => ({
//     height: height.value * progress.value + 1,
//     opacity: progress.value === 0 ? 0 : 1,
//   }));
//   return (
//     <Box >
//       <TouchableWithoutFeedback
//         onPress={() => {
//           if (height.value === 0) {
//             runOnUI(() => {
//               "worklet";
//               height.value = measure(aref).height;
//             })();
//           }
//           open.value = !open.value;
//         }}
//       >
//         <Animated.View style={[styles.container, headerStyle]}>
//           <Text style={styles.title}>Total Points</Text>
//           <Chevron {...{ progress }} />
//         </Animated.View>
//       </TouchableWithoutFeedback>
//       <Animated.View style={[styles.items, style]}>
//         <View
//           ref={aref}
//           onLayout={({
//             nativeEvent: {
//               layout: { height: h },
//             },
//           }) => console.log({ h })}
//         >
//           <Childen />
//         </View>
//       </Animated.View>
//     </Box>
//   );
// };

const InfoList = ({navigation, route, TypeOfSportsData, info}) => {
  const [preview, setPreview] = useState(false);

  return (
    <Box marginHorizontal="l" mt="l">
      {preview && (
        <TouchableBox
          onPress={() => setPreview(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            height: '100%',
            width: '100%',
            zIndex: 1,
            borderRadius: 10,
            padding: 5,
          }}>
          {info?.info?.floor_plan.length > 0 && (
            <Image
              source={{uri: info?.info?.floor_plan[0]}}
              style={{height: wp(50), width: wp(80)}}
            />
          )}
        </TouchableBox>
      )}
      <AccordianButton
        title={() => (
          <Box flexDirection="row">
            <FastImage
              source={Dollar}
              style={styles.image}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text ml="m" variant="blackshade16800">
              Pricing
            </Text>
          </Box>
        )}
        data={() => (
          <Box mt="m">
            {info?.facilities?.map(item => {
              return (
                <Box mt="m">
                  <Text variant="blackshade14500" mb="s">
                    {item?.name} :
                  </Text>
                  <Text variant="blackshade12400">
                    {item?.timings.length > 0
                      ? PriceListing(item?.timings, info?.info?.currency)
                      : 'No timings for this Facility'}
                  </Text>
                </Box>
              );
            })}
          </Box>
        )}
        defaultExpand={false}
      />

      <AccordianButton
        title={() => (
          <Box flexDirection="row">
            <FastImage
              source={Time}
              style={styles.image}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text ml="m" variant="blackshade16800">
              Opening Hours
            </Text>
          </Box>
        )}
        data={() => (
          <Box mt="m">
            <Text variant="blackshade12400">
              {info?.name} :
              {info?.opening + ' - ' + moment(info?.closing).format('LT')}
            </Text>
          </Box>
        )}
        defaultExpand={false}
      />

      <AccordianButton
        title={() => (
          <Box flexDirection="row">
            <FastImage
              source={Amenity}
              style={styles.image}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text ml="m" variant="blackshade16800">
              Amenities & Facilities
            </Text>
          </Box>
        )}
        data={() => (
          <Box mt="m">
            <Box>
              <Text variant="blackshade14800" mt="l">
                Amenities
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {info?.amenities?.length > 0 &&
                  info?.amenities?.map(item => {
                    const {amenity} = item;
                    return (
                      <Box
                        mt="l"
                        justifyContent="center"
                        alignItems="center"
                        mr="l">
                        <FastImage
                          tintColor={'#000000'}
                          source={{uri: amenity?.images[0]}}
                          style={{height: wp(7), width: wp(7)}}
                          resizeMode={FastImage?.resizeMode?.contain}
                        />
                        <Text mt="m" variant="blackshade12400">
                          {amenity?.name}
                        </Text>
                      </Box>
                    );
                  })}
              </ScrollView>
            </Box>
            <Box>
              <Text variant="blackshade14800" mt="l">
                Facilities
              </Text>
              <Box mt="m">
                {info?.facilities?.length > 0 &&
                  info?.facilities?.map((item, index) => {
                    return item?.categories?.map(data => {
                      return (
                        <Text variant="blackshade12400">
                          {data?.category?.name}{' '}
                        </Text>
                      );
                    });
                  })}
              </Box>
            </Box>
          </Box>
        )}
        defaultExpand={false}
      />

      <AccordianButton
        title={() => (
          <Box flexDirection="row">
            <FastImage
              source={CenterLayout}
              style={styles.image}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text ml="m" variant="blackshade16800">
              Centre Layout
            </Text>
          </Box>
        )}
        data={() => (
          <TouchableBox
            mt="m"
            alignItems={'center'}
            onPress={() => setPreview(true)}>
            {info?.info?.floor_plan.length > 0 && (
              <Image
                source={{uri: info?.info?.floor_plan[0]}}
                style={{height: wp(50), width: wp(100)}}
              />
            )}
          </TouchableBox>
        )}
        defaultExpand={false}
      />

      <AccordianButton
        title={() => (
          <Box flexDirection="row">
            <FastImage
              source={CenterPolicy}
              style={styles.image}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text ml="m" variant="blackshade16800">
              Centre Policy
            </Text>
          </Box>
        )}
        data={() => (
          <Box mt="l" mb="l">
            <Text variant="blackshade12400">{info?.info?.center_policy}</Text>
          </Box>
        )}
        defaultExpand={false}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {height: 24, width: 24},
  content: {flexGrow: 1},
  orangeDot: {
    backgroundColor: palette.primary,
    height: 8,
    borderRadius: 5,
    width: 20,
  },
  border: {
    width: 50,
    alignSelf: 'center',
    marginTop: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: palette.inputBorder,
  },
});

export default InfoList;
