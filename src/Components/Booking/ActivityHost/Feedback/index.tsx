import React from 'react';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { Images } from '../../../../Constant/Image';
import { wp } from '../../../Helpers/responsive-ratio';
import { Button, Header } from '../../../ReusableComponents';
import AccordianButton from '../../../ReusableComponents/AccordianButton';
import { Ionicon } from '../../../ReusableComponents/Icons';
import { Box, fonts, palette, Text } from '../../../Theme/Index';

import { styles } from './style';
import Stars from 'react-native-stars';
import MultiLine from '../../CreateActivity/Settings/MultiLine/MultiLine';

export default props => {
  const { is_activity_completed } = props
  return (
    <Box flex={1} p="l">
      <ScrollView
        contentContainerStyle={{
          marginBottom: 55,
          paddingBottom: 55,
          flexGrow: 1,
        }}>
        <AccordianButton
          title={() => (
            // <Box justifyContent="space-between" flexDirection="row">
            <Box flexDirection="row">
              <FastImage
                source={Images?.cal}
                style={styles.image}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="m" variant="blackshade16800">
                Activity
              </Text>
            </Box>
          )}
          data={() => (
            <Box mt="m">
              <Box flexGrow={1} height={wp(30)}>
                <Text variant={'blackshade16400'}>How was your Activity?</Text>
                <Box flexDirection="row" alignSelf={'center'} mt="l">
                  <Stars
                    display={4}
                    spacing={5}
                    count={5}
                    starSize={wp(8)}
                    fullStar={Images?.selectedStar}
                    emptyStar={Images?.unselectedStar}
                  />
                </Box>
              </Box>
            </Box>
          )}
        />
        <AccordianButton
          title={() => (
            // <Box justifyContent="space-between" flexDirection="row">
            <Box flexDirection="row">
              <FastImage
                source={Images?.RSVPLocation}
                style={styles.image}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="m" variant="blackshade16800">
                Venue
              </Text>
            </Box>
          )}
          data={() => (
            <Box mt="m">
              <Box flexGrow={1} minHeight={wp(30)}>
                <Text variant={'blackshade16400'}>How was vanue?</Text>
                <Box flexDirection="row" alignSelf={'center'} mt="l">
                  <Stars
                    display={4}
                    spacing={5}
                    count={5}
                    starSize={wp(8)}
                    fullStar={Images?.selectedStar}
                    emptyStar={Images?.unselectedStar}
                  />
                </Box>
                <Box mt="l">
                  <Text variant={'blackshade16400'}>
                    Can you leave a review?
                  </Text>
                </Box>
                <Box mt="s">
                  <MultiLine
                    placeholder={'Share details of your own experience here.'}
                  />
                </Box>
              </Box>
            </Box>
          )}
        />
        {!is_activity_completed && (
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
          </Box>)}
      </ScrollView>
      <Box
        width={wp(100) - 40}
        position={'absolute'}
        bottom={wp(4)}
        flexDirection="row"
        justifyContent={'space-between'}
        alignItems="center"
        alignSelf="center">
        {is_activity_completed ? (
          <Box
            width={wp(100) - 30}
            position={'absolute'}
            bottom={wp(4)}
            alignSelf="center">
            <Button
              // onPress={handleRateActivity}
              label={'Submit Review'}
              buttonStyle={{
                height: wp(11)
              }}
            />
          </Box>
        ) : (
          <>
            <Button
              onPress={() => { }}
              label={'Submit Review'}
              buttonStyle={{
                height: wp(11),
                width: (wp(100) - 50) / 2,
                marginBottom: 10,
              }}
            />
            <Button
              onPress={() => { }}
              label={'Raise Ticket'}
              imageStyle={{ height: 20, width: 20, marginRight: 10 }}
              img={Images?.Ticket}
              Imagewithlabel
              buttonStyle={{
                height: wp(11),
                width: (wp(100) - 50) / 2,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: palette?.primary,
              }}
              textStyle={{
                color: palette?.blackshade,
                fontSize: 16,
                fontFamily: fonts.medium,
                fontWeight: '500',
              }}
              buttonColor="white"
            />
          </>
        )}
      </Box>
    </Box>
  );
};
