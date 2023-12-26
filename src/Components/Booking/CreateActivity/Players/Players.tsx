import React, {memo, useState, useMemo, useReducer} from 'react';
import {ScrollView, StyleSheet, Switch, FlatList} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
  fonts,
} from '../../../Theme/Index';
import {Button} from '../../../ReusableComponents/index';
import FastImage from 'react-native-fast-image';
import Plus from '../../../../assets/Booking/CreateActivity/Plus/Plus.png';
import Minus from '../../../../assets/Booking/CreateActivity/Minus/Minus.png';
import GameSkillRequired from './GameSkillRequired/GameSkillRequired';
import {useDispatch, useSelector} from 'react-redux';
import RadioButton from '../../../ReusableComponents/RadioButton';

import {ActivityConstants} from '../../../../Redux';
import {displayErrorToast, ios} from '../../../../utils';
const statusData = [
  {
    id: 1,
    selected: false,
    name: 'Men',
  },
  {
    id: 2,
    selected: false,
    name: 'Women',
  },
  {
    id: 3,
    selected: false,
    name: 'Mixed',
  },
];
const statusData1 = [
  {
    id: 1,
    selected: false,
    name: 'Below 18',
    min: 1,
    max: 18,
  },
  {
    id: 2,
    selected: false,
    name: '18 & above',
    min: 18,
    max: 99,
  },
];

const Players = ({navigation, route}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setskillSwitch(previousState => !previousState);
  const toggleauto = () => setautolineup(previousState => !previousState);
  const toggleage = () => setageRequired(previousState => !previousState);

  const activityBody = useSelector(state => state?.activity?.activity?.body);

  const dispatch = useDispatch();
  const [skillId, setSkillId] = useState();
  const [skillSwitch, setskillSwitch] = useState(false);
  const [autolineup, setautolineup] = useState(false);
  const [ageRequired, setageRequired] = useState(false);
  const [age, setAge] = useState(statusData1);
  const [privacy, setPrivacy] = useState(statusData);

  /**
   * @function onSelectSkill
   * @param item
   * @description this function set skill
   */

  const onSelectSkill = item => {
    setSkillId(item[0]);
  };

  /**
   * @function reducer
   * @param {*} state
   * @param {*} action
   * @description it will increament or decrement to quantity
   */

  const reducer = (state, action) => {
    switch (action) {
      case 'add': {
        return {count: state.count + 1, max: state?.max};
      }
      case 'remove': {
        if (state?.count == 1) return state;

        return {count: state.count - 1, max: state?.max};
      }
      case 'maxadd': {
        return {max: state.max + 1, count: state?.count};
      }
      case 'maxremove': {
        if (state?.max == 1) return state;

        return {max: state.max - 1, count: state?.count};
      }
      case 'reset':
        return 0;
      default:
        throw new Error('Unexpected action');
    }
  };
  var initialState = {
    count: 1,
    max: 1,
  };

  function init(initialCount) {
    return initialCount;
  }

  const [cout, dispatchCount] = useReducer(reducer, initialState, init);

  /**
   * @function onSubmit
   * @description this function will validate the data and pass it to next tab
   */

  const onSubmit = () => {
    if (skillSwitch && !skillId) {
      displayErrorToast('Select the game skill');
      return;
    }

    if (!privacy?.some(item => item?.selected)) {
      displayErrorToast('Select the Gender from options');
      return;
    }

    if (!age?.some(item => item?.selected)) {
      displayErrorToast('Select the Age which is required');
      return;
    }

    if (cout?.count == cout?.max) {
      displayErrorToast('Select the maximum players');
      return;
    }
    const body = {
      game_skill: skillId,
      minimum_players: cout?.count,
      maximum_players: cout?.max,
      is_auto_lineup: autolineup,
      gender_options: privacy?.find(item => item?.selected)?.id,
      min_age: age?.find(item => item?.selected)?.min,
      max_age: age?.find(item => item?.selected)?.max,
      ...activityBody,
    };

    navigation.navigate('Payment');

    dispatch({
      type: ActivityConstants?.CREATEACTIVITYBODY,
      body: body,
    });
  };

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView contentContainerStyle={styles.content}>
        <Box flex={1}>
          <Box
            marginHorizontal="l"
            mt="l"
            flexDirection="row"
            justifyContent="space-between">
            <Text variant="blackshade16800Semi">Game Skill Required</Text>
            <Switch
              trackColor={{false: palette.inputBorder, true: palette.primary}}
              thumbColor={'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={skillSwitch}
              style={{
                transform: [
                  {scaleX: ios ? 0.6 : 0.9},
                  {scaleY: ios ? 0.6 : 0.9},
                ],
              }}
            />
          </Box>
          {skillSwitch && (
            <Box marginHorizontal="l">
              <GameSkillRequired onSelectSkill={onSelectSkill} />
            </Box>
          )}
          <Box marginHorizontal="l" mt="l">
            <Text variant="blackshade16800Semi">Players Quantity</Text>
            <Box
              mt="l"
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center">
              <Box flexDirection="row" alignItems="center">
                <Text variant="blackshade16800Regular">Minimum Players</Text>
                <Text variant="blackshade116500Regular" ml="s">
                  (incl. you)
                </Text>
              </Box>
              <Box flexDirection="row">
                <TouchableBox onPress={() => dispatchCount('remove')}>
                  <FastImage
                    resizeMode={FastImage?.resizeMode?.contain}
                    source={Minus}
                    style={{height: 34, width: 34}}
                  />
                </TouchableBox>
                <Box backgroundColor="primary3" borderRadius={5}>
                  <Text variant="blackshade18800Regular" m="s">
                    {cout?.count < 9 ? '0' + cout?.count : cout?.count}
                  </Text>
                </Box>
                <TouchableBox onPress={() => dispatchCount('add')}>
                  <FastImage
                    resizeMode={FastImage?.resizeMode?.contain}
                    source={Plus}
                    style={{height: 34, width: 34}}
                  />
                </TouchableBox>
              </Box>
            </Box>
            <Box justifyContent="space-between" flexDirection="row" mt="m">
              <Box flexDirection="row" alignItems="center">
                <Text variant="blackshade16800Regular">Maximum Players</Text>
                <Text variant="blackshade116500Regular" ml="s">
                  (incl. you)
                </Text>
              </Box>
              <Box flexDirection="row">
                <TouchableBox onPress={() => dispatchCount('maxremove')}>
                  <FastImage
                    resizeMode={FastImage?.resizeMode?.contain}
                    source={Minus}
                    style={{height: 34, width: 34}}
                  />
                </TouchableBox>
                <Box backgroundColor="primary3" borderRadius={5}>
                  <Text variant="blackshade18800Regular" m="s">
                    {cout?.max < 9 ? '0' + cout?.max : cout?.max}
                  </Text>
                </Box>
                <TouchableBox onPress={() => dispatchCount('maxadd')}>
                  <FastImage
                    resizeMode={FastImage?.resizeMode?.contain}
                    source={Plus}
                    style={{height: 34, width: 34}}
                  />
                </TouchableBox>
              </Box>
            </Box>
          </Box>
          <Box marginHorizontal="l">
            <Box mt="l" flexDirection="row" justifyContent="space-between">
              <Text variant="blackshade16800Semi">Auto Line-up</Text>
              <Switch
                trackColor={{false: palette.inputBorder, true: palette.primary}}
                thumbColor={'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleauto}
                value={autolineup}
                style={{
                  transform: [
                    {scaleX: ios ? 0.6 : 0.9},
                    {scaleY: ios ? 0.6 : 0.9},
                  ],
                }}
              />
            </Box>
            <Text variant="blackshade114800Regular" mt="s">
              Want to avoid bias and favouritism? Let us organise your confirmed
              Players into 2 teams.
            </Text>
            <Box marginVertical="l">
              <Text variant="blackshade16800Semi">Gender Options</Text>
            </Box>
            <FlatList
              data={privacy}
              renderItem={({item}) => {
                const {selected, name, subName} = item;
                return (
                  <Box flexDirection="row" mb="m">
                    <RadioButton
                      text={name}
                      selected={selected}
                      radio
                      onPress={() => {
                        const temp = privacy?.map(it => {
                          if (item?.name == it?.name)
                            return {...it, selected: !it?.selected};
                          else return {...it, selected: false};
                        });
                        setPrivacy(temp);
                      }}
                      textStyle={{
                        fontFamily: fonts?.regular,
                        fontWeight: '400',
                        fontSize: 16,
                        lineHeight: 22,
                        color: palette?.blackshade,
                      }}
                    />
                  </Box>
                );
              }}
            />

            <Box mt="l" flexDirection="row" justifyContent="space-between">
              <Text variant="blackshade16800Semi">Age Required</Text>
              <Switch
                trackColor={{false: palette.inputBorder, true: palette.primary}}
                thumbColor={'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleage}
                value={ageRequired}
                style={{
                  transform: [
                    {scaleX: ios ? 0.6 : 0.9},
                    {scaleY: ios ? 0.6 : 0.9},
                  ],
                }}
              />
            </Box>
            <Text variant="blackshade114800Regular" mt="s">
              To ensure a fair experience for everyone, we require you to
              specify the age group this Activity is for.
            </Text>
            {ageRequired && (
              <Box mt="l">
                <FlatList
                  data={age}
                  renderItem={({item}) => {
                    const {selected, name, subName} = item;
                    return (
                      <Box flexDirection="row" mb="m">
                        <RadioButton
                          text={name}
                          selected={selected}
                          radio
                          onPress={() => {
                            const temp = age?.map(it => {
                              if (item?.name == it?.name)
                                return {...it, selected: !it?.selected};
                              else return {...it, selected: false};
                            });
                            setAge(temp);
                          }}
                          textStyle={{
                            fontFamily: fonts?.regular,
                            fontWeight: '400',
                            fontSize: 16,
                            lineHeight: 22,
                            color: palette?.blackshade,
                          }}
                        />
                      </Box>
                    );
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </ScrollView>
      <Box flex={1} justifyContent="flex-end" mb="l">
        <Box height={46} marginHorizontal="l" mt="l">
          <Box height={46}>
            <Button
              label="Continue"
              onPress={() => {
                onSubmit();
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  content: {flexGrow: 1, paddingBottom: 50},
});

export default Players;
