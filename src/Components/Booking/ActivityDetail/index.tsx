import React, {memo} from 'react';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Ionicon} from '../../ReusableComponents/Icons';
import {Box, palette, Text} from '../../Theme/Index';
import {ScrollView} from 'react-native';
import moment from 'moment';
import {getStatusEnum, getSkillEnum, selectAgePrice} from '../../Helpers/Enums';
import Stars from 'react-native-stars';
import {Button} from '../../ReusableComponents';
import authStore from '../../../Zustand/store';
import {goingUser} from '../../Helpers/HelperFunctions';

const ActivityDetail = props => {
  const {navigaiton, route} = props;
  const {is_activity_completed} = props || route?.params;
  const {vanue} = authStore(state => state?.vanue);

  return (
    <Box flex={1}>
      <Box flex={1} m="l">
        <ScrollView
          style={{flex: 1, marginBottom: 60}}
          contentContainerStyle={{
            paddingBottom: wp(10),
          }}
          showsVerticalScrollIndicator={false}>
          {/* {is_activity_completed && (
            <Box
              flexDirection="row"
              alignSelf="flex-start"
              alignItems="center"
              mb="l">
              <Stars
                display={4}
                spacing={5}
                count={5}
                starSize={wp(8)}
                fullStar={Images?.selectedStar}
                emptyStar={Images?.unselectedStar}
              />
              <Text variant="blackshade114400" mt="m" ml="m">
                3 Ratings
              </Text>
            </Box>
          )} */}
          <Box flexDirection="row" alignItems="center">
            <FastImage
              source={Images?.Calender}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Text variant="blackshade16500">
              {moment(vanue?.date)?.format('DD MMM, ')}
              {moment(vanue?.start, 'hh:mm')?.format('LT')}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" mt="t">
            <FastImage
              source={Images?.Time}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Text variant="blackshade16500">
              {moment(vanue?.start, 'hh:mm')?.format('LT')} -{' '}
              {moment(vanue?.end, 'hh:mm')?.format('LT')}
            </Text>
          </Box>

          <Box flexDirection="row" mt="t">
            <FastImage
              source={Images?.Location}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Box
              flexDirection="column"
              style={{marginTop: wp(-1)}}
              width={wp(80)}>
              <Text variant="blackshade16500">
                {vanue?.location?.sports_complex?.name ||
                  vanue?.location?.address}
              </Text>
              {!vanue?.location?.address && (
                <Text variant="blackshade114400" mt="s">
                  {vanue?.location?.sports_complex?.info?.address}
                </Text>
              )}
              <Box flexDirection="row" alignItems="center" mt="s">
                {Ionicon(
                  'ellipsis-horizontal-circle-sharp',
                  wp(5),
                  palette?.blackshade,
                )}
                <Text variant="blackshade14500" ml="s">
                  Court {getStatusEnum(vanue?.location?.status)?.name}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box
              flexDirection="row"
              alignItems={
                vanue?.payment?.different_pricing?.length == 0
                  ? 'center'
                  : 'flex-start'
              }
              mt="t">
              <FastImage
                source={Images?.Dollar}
                style={{
                  height: wp(5),
                  width: wp(5),
                  marginRight: wp(2),
                }}
              />

              {vanue?.payment?.payment_type == 3 ? (
                <Text variant="blackshade16500">
                  Pay by Wallet :{' '}
                  {vanue?.payment?.different_pricing?.length == 0 ? (
                    'RM ' + vanue?.payment?.fair_price?.toFixed(2) + '/ per'
                  ) : (
                    <Box
                      style={{
                        paddingTop: 3,
                      }}></Box>
                  )}
                </Text>
              ) : vanue?.payment?.payment_type == 2 ? (
                <Text variant="blackshade16500">
                  Pay by Cash : RM{vanue?.payment?.fair_price?.toFixed(2)}
                  /person
                </Text>
              ) : (
                <Text variant="blackshade16500">Free Activity</Text>
              )}
              {/* <FastImage
                source={Images?.Info}
                resizeMode={FastImage?.resizeMode?.contain}
                style={{height: wp(4.5), width: wp(4.5), marginLeft: wp(2)}}
              /> */}
            </Box>
            <Box style={{marginLeft: wp(7)}} mt="s">
              {vanue?.payment?.different_pricing?.length > 0 && (
                <Box
                  style={{
                    paddingTop: 3,
                  }}>
                  {vanue?.payment?.different_pricing?.map(i => {
                    return (
                      <Text variant="blackshade14500">
                        RM{parseFloat(i?.price)?.toFixed(2)} / per{' '}
                        {selectAgePrice(i?.age, i?.gender)?.name}
                      </Text>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>

          {vanue?.payment?.refund_hours != 0 &&
            vanue?.payment?.payment_type == 3 && (
              <Text
                mt="m"
                mb="sm"
                variant="blackshade16500"
                style={{
                  marginLeft: wp(7),
                }}>
                Full refund before : {vanue?.payment?.refund_hours} hours
                pre-game
              </Text>
            )}
          <Box flexDirection="row" mt="t">
            <FastImage
              source={Images?.Prejoin}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Box
              flexDirection="column"
              style={{
                marginTop: wp(-1),
              }}>
              <Box flexDirection="row" alignItems="center">
                <Box borderWidth={1} p="s" borderRadius={5} mr="m">
                  <Text variant="blackshade16500">
                    {goingUser(
                      vanue?.users?.filter(item => item?.request_type == 4),
                    ) || 0}
                    /{vanue?.setting?.maximum_players}
                  </Text>
                </Box>
                {is_activity_completed && (
                  <Text variant="blackshade14500">
                    Game skill :{' '}
                    {getSkillEnum(vanue?.setting?.game_skill)?.name}
                  </Text>
                )}
                {!is_activity_completed && (
                  <Text variant="blackshade16400">
                    {parseInt(vanue?.setting?.maximum_players) -
                      parseInt(
                        goingUser(
                          vanue?.users?.filter(item => item?.request_type == 4),
                        ),
                      )}{' '}
                    more Player needed
                  </Text>
                )}
              </Box>
              {/* {!is_activity_completed && ( */}
              <>
                <Box flexDirection="row" mt="m" mb="s">
                  {vanue?.users.map((item, index) => {
                    if (item?.request_type == 4)
                      return (
                        <FastImage
                          source={
                            item?.user?.image
                              ? {uri: item?.user?.image}
                              : Images?.Profile
                          }
                          style={{
                            height: wp(10),
                            width: wp(10),
                            left: index > 0 ? index * -8 : 0,
                            borderRadius: wp(5),
                          }}
                        />
                      );
                  })}
                </Box>
                {!is_activity_completed && (
                  <Text variant="blackshade14500">
                    Game skill: {getSkillEnum(vanue?.setting?.game_skill)?.name}
                  </Text>
                )}
              </>
              {/* )} */}
            </Box>
          </Box>
          <Box marginHoriozontal="l" marginVertical="m">
            <Text variant="blackshade16500">Host Details</Text>
            <Box flexDirection="row" mt="m" alignItems="center">
              <FastImage
                source={
                  vanue?.user?.image
                    ? {uri: vanue?.user?.image}
                    : Images?.Profile
                }
                style={{
                  height: wp(14),
                  width: wp(14),
                  borderRadius: wp(7),
                }}
              />
              <Box ml="m">
                <Text variant="blackshade16800">{vanue?.user?.full_name}</Text>
                <Text variant="support412600">+60 {vanue?.user?.phone}</Text>
              </Box>
            </Box>
          </Box>
          <Box flexDirection="row" mt="t">
            <FastImage
              source={Images?.CenterPolicy}
              style={{height: wp(5), width: wp(5), marginRight: wp(2)}}
            />
            <Box flexDirection="column" width={wp(80)}>
              <Text variant="blackshade16500">Other Instructions:</Text>
              {vanue?.setting?.is_bring_own_equipment && (
                <Text variant="blackshade14400">Bring your own equipment</Text>
              )}
              <Text variant="blackshade14400">
                {vanue?.setting?.additional_information}
              </Text>
            </Box>
          </Box>
        </ScrollView>
      </Box>
      {/* {is_activity_completed && (
        <Box
          width={wp(100) - 30}
          position={'absolute'}
          bottom={wp(4)}
          alignSelf="center">
          <Button
            // onPress={handleRateActivity}
            label={'Rate this Activity'}
            buttonStyle={{
              height: wp(11),
            }}
          />
        </Box>
      )} */}
    </Box>
  );
};

export default memo(ActivityDetail);
