import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  SectionList,
  FlatList,
  Switch,
} from 'react-native';
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
import Search from './Search/Search';
import {useDispatch, useSelector} from 'react-redux';
import RadioButton from '../../../ReusableComponents/RadioButton';
import {wp} from '../../../Helpers/responsive-ratio';
import {EntypoIcon, Ionicon} from '../../../ReusableComponents/Icons';
import {Images} from '../../../../Constant/Image';
import {ActivityConstants} from '../../../../Redux';
import {displayErrorToast, displaySuccessToast, ios} from '../../../../utils';
import GameSkillRequired from '../Players/GameSkillRequired/GameSkillRequired';
import {Slider} from '../../../ReusableComponents/Slider';
import MultiLine from '../Settings/MultiLine/MultiLine';
import {createActivity, updateActivity} from '../../../Services/Booking';
import {useMutation} from 'react-query';
const Location = require('../../../../assets/Home/Location/Location.png');

const BookstatusData = [
  {
    id: 1,
    selected: false,
    name: 'Booked',
  },
  {
    id: 2,
    selected: false,
    name: 'Not yet, will book later',
  },
];

const statusData = [
  {
    id: 1,
    selected: false,
    name: 'Public',
    subName: 'This Activity can be discovered by all Players on the App',
  },
  {
    id: 2,
    selected: false,
    name: 'Invite only',
    subName:
      'This Activity cannot be searched and can be accessed only via shared link',
  },
];

const statusDataGender = [
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
  {
    id: 3,
    selected: false,
    name: 'No Age Limit',
    min: 1,
    max: 99,
  },
];

const DATA = [
  {
    id: 1,
    selected: false,
    name: 'Bring your own equipment',
  },
  {
    id: 2,
    selected: false,
    name: 'Additional information ',
  },
];

const Where = ({navigation, route}) => {
  const activityBody = useSelector(state => state?.activity?.activity?.body);
  const clean = useSelector(state => state?.activity?.activity?.clean);

  const activityId = useSelector(
    state => state?.activity?.activity?.activityId,
  );

  const dispatch = useDispatch();

  const [data, setData] = useState(BookstatusData);
  const {details, from} = route?.params;
  const [location, setLocation] = useState('');
  const [privacyAccess, setPrivacyAccess] = useState(statusData);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSkillSwitch = () =>
    setskillSwitch(previousState => !previousState);
  const toggleauto = () => setautolineup(previousState => !previousState);
  const toggleage = () => setageRequired(previousState => !previousState);
  const [skillSwitch, setskillSwitch] = useState(true);
  const [ActOpen, setActOpen] = useState(true);

  const [additional, setAdditional] = useState(DATA);
  const [additionalInfo, setAdditionalinfo] = useState('');

  const [age, setAge] = useState(statusData1);

  const [privacy, setPrivacy] = useState(statusDataGender);
  const [autolineup, setautolineup] = useState(false);
  const [ageRequired, setageRequired] = useState(true);

  useEffect(() => {
    if (from !== undefined && from === 'Edit' && details) {
      const d = statusData?.map(it => {
        if (details?.setting?.privacy_level == it?.id)
          return {...it, selected: !it?.selected};
        else return {...it, selected: false};
      });

      setData(
        data?.map(i => {
          return {
            ...i,
            selected: i?.id == details?.location?.status,
          };
        }),
      );
      setPrivacyAccess(d);
      setskillSwitch(details?.setting?.game_skill !== null ? true : false);
      setSkillId(
        details?.setting?.game_skill !== null
          ? getSkillVAlue(details?.setting?.game_skill)
          : '',
      );
      setautolineup(
        details?.setting?.is_auto_lineup !== null
          ? details?.setting?.is_auto_lineup
          : false,
      );
      const temp = statusDataGender?.map(it => {
        if (details?.setting?.gender_options == it?.id)
          return {...it, selected: !it?.selected};
        else return {...it, selected: false};
      });
      let newArr = DATA;

      if (details?.setting?.additional_information !== null) {
        newArr[1].selected = true;
        setAdditional(newArr);
        setAdditionalinfo(details?.setting?.additional_information || '');
      }

      if (details?.setting?.is_bring_own_equipment) {
        newArr[0].selected = details?.setting?.is_bring_own_equipment;
        setAdditional(newArr);
      }

      if (details?.setting?.min_age) {
        // toggleage();
        const ev = age?.map(i => {
          return {
            ...i,
            selected:
              i?.min == details?.setting?.min_age &&
              i?.max == details?.setting?.max_age,
          };
        });
        setAge(ev);
      }
      setPrivacy(temp);
    }
  }, [details]);

  /**
   * @function changeLocation
   * @param item
   * @description this function set the location
   */

  const changeLocation = item => {
    setLocation(item);
  };

  /**
   * @function onSelectSkill
   * @param item
   * @description this function set skill
   */

  const onSelectSkill = item => {
    setSkillId(item);
  };

  const [skillId, setSkillId] = useState();

  // useEffect(() => {

  //   setData(BookstatusData);
  //   setLocation('');
  //   setPrivacyAccess(statusData);
  //   setIsEnabled(false);
  //   setskillSwitch(true);
  //   setAdditional(DATA);
  //   setAdditionalinfo('');
  //   setAge(statusData1);
  //   setPrivacy(statusDataGender);
  //   setautolineup(false);
  //   setageRequired(true);
  // }, [clean]);

  const getSkillVAlue = item => {
    switch (item) {
      case 1:
        return [1];
        break;
      case 2:
        return [2];
        break;
      case 3:
        return [3];
        break;
      default:
        break;
    }
  };

  const selectSkil = item => {
    switch (item) {
      case 1:
        return 1;
        break;
      case 2:
        return 2;
        break;
      case 3:
        return 3;
        break;
      default:
        break;
    }
  };

  /**
   * @function onSubmit
   * @description this function will validate the data and pass it to next tab
   */

  const onSubmit = () => {
    if (!privacyAccess?.some(item => item?.selected)) {
      displayErrorToast('kindly select privacy access');
      return;
    }
    if (skillSwitch && !skillId) {
      displayErrorToast('Select the game skill');
      return;
    }

    if (!age?.some(item => item?.selected)) {
      displayErrorToast('Select the Age which is required');
      return;
    }

    if (!privacy?.some(item => item?.selected)) {
      displayErrorToast('Select the Gender from options');
      return;
    }

    const body = {
      ...activityBody,

      privacy_level: privacyAccess?.find(item => item?.selected)?.id,
      game_skill: selectSkil(skillId[0] || skillId),
      is_auto_lineup: autolineup,
      gender_options: privacy?.find(item => item?.selected)?.id,
      min_age: age?.find(item => item?.selected)?.min,
      max_age: age?.find(item => item?.selected)?.max,
      is_bring_own_equipment:
        additional?.find(item => item?.selected)?.id == 1 ? true : false,
      additional_information: additionalInfo,
      booking_status: data?.find(item => item?.selected)?.id,
    };

    dispatch({
      type: ActivityConstants?.CREATEACTIVITYBODY,
      body: body,
    });

    if (activityId) {
      update?.mutate({
        id: activityId,
        body: body,
      });
    } else {
      creatingActivity?.mutate(body);
    }

    // navigation.navigate('Settings');
  };

  /**
   * @function creatingActivity
   * @description this function will call the createActivity api
   */

  const creatingActivity = useMutation('createActivity', createActivity, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        if (data?.data?.data) {
          const key = Object.keys(data?.data?.data)[0];
          displayErrorToast(data?.data?.data[key]);
        } else {
          displayErrorToast(data?.data?.message);
        }
      } else {
        dispatch({
          type: ActivityConstants?.CREATEACTIVITYBODY,
          body: [],
        });
        dispatch({
          type: ActivityConstants?.ACTIVITYCLEAN,
          clean: true,
        });
        displaySuccessToast('Activity created');
        setTimeout(() => {
          navigation?.navigate('ActivityCreateModal', {newActivity: true});

          // navigation.navigate('Tabs', {screen: 'Home', initial: false});
        }, 300);
      }
    },
  });

  /**
   * @function update
   * @description this function will update the activity
   */

  const update = useMutation('updateActivity', updateActivity, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        if (data?.data?.data) {
          const key = Object.keys(data?.data?.data)[0];
          displayErrorToast(data?.data?.data[key]);
        } else {
          displayErrorToast(data?.data?.message);
        }
      } else {
        dispatch({
          type: ActivityConstants?.CREATEACTIVITYBODY,
          body: [],
        });
        dispatch({
          type: ActivityConstants?.ACTIVITYID,
          activityId: undefined,
        });

        dispatch({
          type: ActivityConstants?.ACTIVITYCLEAN,
          clean: true,
        });
        navigation?.setParams({
          details: {},
        });

        displaySuccessToast('Activity updated');
        setTimeout(() => {
          navigation?.navigate('ActivityCreateModal', {newActivity: false});

          // navigation.navigate('Tabs', {screen: 'Home', initial: false});
        }, 300);
        // navigation.navigate('Tabs', {screen: 'Home', initial: false});
      }
    },
  });

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView contentContainerStyle={styles.content}>
        <Box flex={1}>
          <Box marginHorizontal="l" mt="l">
            <Text
              // variant="primary12900"
              color="black"
              fontWeight="600"
              fontSize={16}
              textTransform="capitalize"
              mb="l"
              fontFamily={fonts?.bold}>
              Activity
            </Text>
            <Text variant="blackshade16800Semi" mb="l">
              Privacy Access
            </Text>
            <FlatList
              data={privacyAccess}
              ItemSeparatorComponent={() => <Box height={10} />}
              renderItem={({item}) => {
                const {selected, name, subName} = item;
                return (
                  <Box mb="m">
                    <RadioButton
                      text={name}
                      capital="none"
                      subname={subName}
                      selected={selected}
                      se
                      onPress={() => {
                        const d = privacyAccess?.map(it => {
                          if (item?.name == it?.name)
                            return {...it, selected: !it?.selected};
                          else return {...it, selected: false};
                        });
                        setPrivacyAccess(d);
                      }}
                      radio
                      textStyle={{
                        fontFamily: fonts?.regular,
                        fontWeight: '400',
                        fontSize: 16,
                        lineHeight: 22,
                        color: palette?.blackshade,
                        // textTransform: 'lowerCase',
                      }}
                      subnameStyle={{
                        fontFamily: fonts?.regular,
                        fontWeight: '400',
                        fontSize: 12,
                        lineHeight: 22,
                        color: palette?.blackshade1,
                      }}
                    />

                    {/* <Box
                      justifyContent="center"
                      alignItems="center"
                      borderWidth={1}
                      borderColor={selected ? 'primary' : 'tertiary2'}
                      height={25}
                      width={25}
                      borderRadius={25 / 2}>
                      <Box
                        backgroundColor={selected ? 'primary' : 'white'}
                        height={16}
                        width={16}
                        borderRadius={16 / 2}
                      />
                    </Box>
                    <Box ml="m">
                      <Text variant="blackshade16800Regular">{name}</Text>
                      <Text variant="blackshade114800Regular">{subName}</Text>
                    </Box> */}
                  </Box>
                );
              }}
            />
          </Box>

          {/* <Box
            flexDirection="row"
            justifyContent="space-between"
            marginHorizontal="l"
            mt="l">
            <Text variant="blackshade16800Semi">Post to your Group</Text>
            <Switch
              style={{transform: [{scaleX: 0.6}, {scaleY: 0.6}]}}
              trackColor={{false: palette.inputBorder, true: palette.primary}}
              thumbColor={'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </Box> */}

          {/* <Text variant="blackshade114800Regular" mt="s" marginHorizontal="l">
            Choose Groups that you want to share with other members about this
            Activity
          </Text> */}

          <Box marginHorizontal="l" mt="l">
            <Text variant="blackshade16800Semi" mb="l">
              Booking Status
            </Text>
            <FlatList
              data={data}
              renderItem={({item}) => {
                const {selected, name} = item;
                return (
                  <Box flexDirection="row" mb="m">
                    <RadioButton
                      text={name}
                      selected={selected}
                      onPress={() => {
                        const d = data?.map(it => {
                          if (item?.name == it?.name)
                            return {...it, selected: !it?.selected};
                          else return {...it, selected: false};
                        });
                        setData(d);
                      }}
                      radio
                      textStyle={{
                        fontFamily: fonts?.regular,
                        fontWeight: '400',
                        fontSize: 16,
                        lineHeight: 22,
                        color: palette?.blackshade,
                      }}
                    />
                    {/* <Box
                      justifyContent="center"
                      alignItems="center"
                      borderWidth={1}
                      borderColor={selected ? 'primary' : 'tertiary2'}
                      height={25}
                      width={25}
                      borderRadius={25 / 2}>
                      <Box
                        backgroundColor={selected ? 'primary' : 'white'}
                        height={16}
                        width={16}
                        borderRadius={16 / 2}
                      />
                    </Box>
                    <Box ml="m" justifyContent="center" alignItems="center">
                      <Text variant="blackshade16800Regular">{name}</Text>
                    </Box> */}
                  </Box>
                );
              }}
            />
          </Box>

          <Box
            marginHorizontal="l"
            mt="l"
            flexDirection="row"
            justifyContent="space-between">
            <Text
              variant="primary12900"
              textTransform="uppercase"
              letterSpacing={1}
              fontFamily={fonts?.bold}>
              Players
            </Text>
          </Box>
          <Box
            marginHorizontal="l"
            mt="l"
            flexDirection="row"
            justifyContent="space-between">
            <Text variant="blackshade16800Semi">Game Skill Required</Text>
            {/* <Switch
              trackColor={{false: palette.inputBorder, true: palette.primary}}
              thumbColor={'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSkillSwitch}
              value={skillSwitch}
              style={{
                transform: [
                  {scaleX: ios ? 0.6 : 0.8},
                  {scaleY: ios ? 0.6 : 0.8},
                ],
              }}
            /> */}
          </Box>
          {/* <Box height={30} /> */}
          {skillSwitch && (
            <Box marginHorizontal="l" mt="xl" flex={1}>
              <Box height={30} />

              {/* <Slider
                containerStyle={{flex: 1, width: wp(85), marginLeft: 5}}
                maximumTrackTintColor={palette?.white}
                minimumTrackTintColor={palette?.primary}
                thumbTintColor={palette?.primary}
                label={['Beginner', 'Intermediate', 'Advanced']}
                // trackRightPadding={-10}a
                trackStyle={{
                  height: 20,
                  // marginHorizontal: 50,
                  borderRadius: 10,
                }}
                // renderAboveThumbComponent={(e, v) => <Text>{e}</Text>}
                // renderTrackMarkComponent={e => <Text>{e}</Text>}

                thumbStyle={{
                  height: 40,
                  width: 40,
                  borderRadius: 40 / 2,
                }}
                thumbTouchSize={{width: 50, height: 50}}
                minimumValue={10}
                maximumValue={30}
                value={10}
                thumbImage={Images?.SliderGameThumb}
                step={10}
                trackMarks={[10, 20, 30]}
                renderTrackMarkComponent={e => {
                  return EntypoIcon(
                    'controller-record',
                    wp(6),
                    e == 4 ? palette?.primary : palette?.tertiary2,
                  );
                }}
                maximumTrackStyle={{
                  borderWidth: 1,
                  borderColor: palette?.primary,
                }}
              /> */}
              <GameSkillRequired
                onSelectSkill={onSelectSkill}
                skillId={skillId}
              />
            </Box>
          )}
          <Box marginHorizontal="l">
            {/* <Box mt="l" flexDirection="row" justifyContent="space-between">
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
            </Box> */}
            {/* <Text variant="blackshade114800Regular" mt="s">
              Want to avoid bias and favouritism? Let us organise your confirmed
              Players into 2 teams.
            </Text> */}

            <Box mt="l" flexDirection="row" justifyContent="space-between">
              <Text variant="blackshade16800Semi">Age Required</Text>
              {/* <Switch
                trackColor={{false: palette.inputBorder, true: palette.primary}}
                thumbColor={'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleage}
                value={ageRequired}
                style={{
                  transform: [
                    {scaleX: ios ? 0.6 : 0.8},
                    {scaleY: ios ? 0.6 : 0.8},
                  ],
                }}
              /> */}
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
          </Box>
          <Box marginHorizontal="l">
            <Box mt="l" flexDirection="row" alignItems="center">
              <Text
                variant="primary12900"
                color="primary"
                textTransform="uppercase"
                fontFamily={fonts?.bold}>
                Additional Instruction
              </Text>
              {/* <Text variant="blackshade116500Regular" ml="s">
                (optional)
              </Text> */}
            </Box>
            <Box mb="l">
              <FlatList
                data={additional}
                renderItem={({item}) => {
                  const {name, selected} = item;
                  return (
                    <Box flexDirection="row" mt="m">
                      <RadioButton
                        text={name}
                        selected={selected}
                        capital="none"
                        onPress={() => {
                          const d = additional?.map(it => {
                            if (item?.name == it?.name)
                              return {...it, selected: !it?.selected};
                            else return {...it, selected: it?.selected};
                          });
                          setAdditional(d);
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
            {additional[1]?.selected == true ? (
              <Box mt="s" mb="l">
                <MultiLine
                  inputStyle={{height: 102}}
                  placeholder="Add more details"
                  onChangeText={e => setAdditionalinfo(e)}
                  value={additionalInfo}
                />
              </Box>
            ) : null}
          </Box>
        </Box>
      </ScrollView>

      <Box flex={1} justifyContent="flex-end">
        <Box style={{marginBottom: 50}}>
          <Box marginHorizontal="l" height={46}>
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
  image: {
    marginLeft: 10,
    height: 22,
    width: 22,
  },
  text: {
    flex: 1,
    marginTop: 5,
    paddingRight: 40,
    height: 40,
    alignSelf: 'center',
    fontSize: 14,
  },
});

export default Where;
