import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native';
import {Images} from '../../Constant/Image';
import {wp} from '../Helpers/responsive-ratio';
import {Ionicon} from '../ReusableComponents/Icons';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../Theme/Index';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import DashedLine from '../ReusableComponents/DashedLine/dashedLine';
import Button from '../ReusableComponents/Button';
import {useMutation, useQuery} from 'react-query';
import {getUserProfile, updateGameSkill} from '../Services/ProfileApi';
import {displayErrorToast, displaySuccessToast} from '../../utils';
import LoadingOverlay from '../ReusableComponents/LoadingOverlay/index';
import {AuthConstants} from '../../Redux';
import GameSkillRequired from '../Booking/CreateActivity/Players/GameSkillRequired/GameSkillRequired';

const MySportsDrawer = props => {
  const {state, setState} = props;
  const dispatch = useDispatch();
  const sports_data = useSelector(
    state => state?.auth?.user?.user?.data?.favorite_sports,
  );

  const [sportId, setSportId] = useState(state.selected_sport_id);
  const [selectedSkill, setSelectedSkill] = useState(state.game_skill);
  const [isLoading, setIsLoading] = useState(false);
  const handleSportsLevel = id => setSportId(id);
  const handleSelectSkillLevel = id => setSelectedSkill(id);

  const getUserProfileQuery = useQuery('getUserProfile', getUserProfile, {
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
      }
    },
    onError: error => {},
  });

  const updateGameSkillMutation = useMutation(
    'updateGameSkill',
    updateGameSkill,
    {
      onSuccess: data => {
        setIsLoading(false);
        if (data?.success == 0) return displayErrorToast(data?.message);
        if (data?.success == 1) {
          getUserProfileQuery.refetch();
          displaySuccessToast(data?.message);
          setState({...state, toggle_mysports_drawer: false});
          return;
        }
      },
      onError: error => {
        setIsLoading(false);
        if (error?.data?.success == 0)
          return displayErrorToast(error?.data?.message);
      },
    },
  );

  const handleSubmit = () => {
    setIsLoading(true);
    const body = {
      category_id: sportId,
      game_skill: selectedSkill,
    };
    updateGameSkillMutation.mutate(body);
  };

  const skill_level = [
    {
      id: 1,
      name: 'Beginner',
    },
    {
      id: 2,
      name: 'Intermediate',
    },
    {
      id: 3,
      name: 'Advanced',
    },
  ];

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <Box
        backgroundColor={'white'}
        style={[
          TypographyStyles.cardShadow,
          {borderTopRightRadius: 15, borderTopLeftRadius: 15},
        ]}
        padding={'m'}>
        <TouchableBox
          alignItems={'flex-end'}
          onPress={() => setState({...state, toggle_mysports_drawer: false})}>
          {Ionicon('close', wp(7), palette?.blackshade)}
        </TouchableBox>
        <Text variant={'blackshade20500'} textAlign={'center'}>
          Edit your sport level
        </Text>
        <ScrollView
          horizontal={true}
          style={{
            marginLeft: wp(3),
            marginVertical: wp(5),
          }}
          showsHorizontalScrollIndicator={false}>
          {sports_data.map((data, i) => {
            return (
              <Box
                key={i}
                flexDirection={'row'}
                alignItems={'center'}
                mb={'m'}
                mr={'m'}
                ml={'s'}>
                <TouchableBox
                  backgroundColor="white"
                  style={[
                    styles.mysportChip,
                    TypographyStyles.cardShadow,
                    {
                      borderColor:
                        data?.category?.id == sportId
                          ? palette?.primary
                          : palette?.white,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => handleSportsLevel(data?.category?.id)}>
                  <FastImage
                    source={
                      data?.category?.images.length > 0
                        ? {uri: data?.category?.images[0]}
                        : Images.Tennis
                    }
                    style={{height: wp(7), width: wp(7)}}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text marginHorizontal={'m'} variant={'blackshade14400'}>
                    {data?.category?.name}
                  </Text>
                  <Box style={styles.count}>
                    <Text
                      p={'s'}
                      variant={'blackshade12500'}
                      textAlign={'center'}>
                      {data?.category?.order}
                    </Text>
                  </Box>
                </TouchableBox>
              </Box>
            );
          })}
        </ScrollView>
        <Box
          flexDirection={'row'}
          paddingHorizontal="m"
          justifyContent={'space-between'}
          style={{marginTop: wp(10), marginBottom: wp(3)}}>
          <GameSkillRequired
            onSelectSkill={setSelectedSkill}
            skillId={selectedSkill}
          />
          {/* {skill_level.map(data => {
            return (
              <TouchableBox onPress={() => handleSelectSkillLevel(data?.id)}>
                <Text
                  key={data?.id}
                  variant={
                    data?.id == selectedSkill
                      ? 'primary14500'
                      : 'placeholder14400'
                  }>
                  {data?.name}
                </Text>
              </TouchableBox>
            );
          })} */}
        </Box>
        {/* <DashedLine
          length={30}
          color={palette.primary}
          circleSize={3}
          circleLength={3}
          justifyContent="space-between"
        />  */}
        <Box height={45} marginHorizontal={'m'} marginVertical="l">
          <Button
            label="Save"
            onPress={() => handleSubmit()}
            disabled={selectedSkill == 0}
          />
        </Box>
      </Box>
    </>
  );
};

export default MySportsDrawer;
