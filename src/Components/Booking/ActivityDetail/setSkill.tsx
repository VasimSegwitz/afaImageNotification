import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {wp} from '../../Helpers/responsive-ratio';
import {Button} from '../../ReusableComponents';
import {EntypoIcon, feather, Ionicon} from '../../ReusableComponents/Icons';
import RadioButton from '../../ReusableComponents/RadioButton';
import {getUserProfile, updateGameSkill} from '../../Services/ProfileApi';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import styles from './style';
import {AuthConstants} from '../../../Redux';

const SetSkill = props => {
  const {state, setState, category_id, refreshPage, game_skill} = props;
  const [skill, setSkill] = useState(0);

  const game_skill_list = [
    {id: 1, lable: 'Beginner'},
    {id: 2, lable: 'Intermediate'},
    {id: 3, lable: 'Advanced'},
  ];
  const handleClose = () => setState({...state, skill_level: false});
  const onClickItem = id => {
    if (game_skill > id) {
      displayErrorToast(
        `${
          game_skill_list?.find(item => item?.id == game_skill)?.lable
        } skill is required `,
      );
      return;
    }
    setSkill(id);
  };

  const dispatch = useDispatch();

  // const getUserProfileQuery = useQuery('getUserProfile', getUserProfile, {
  //   onSuccess: data => {

  //     if (data?.success == 1) {
  //       setState({
  //         ...state,
  //         userdata: data?.data?.favorite_sports,
  //       });
  //       dispatch({
  //         type: AuthConstants.USER_INFO_RECEIVED,
  //         user: data,
  //       });
  //     }
  //   },
  //   onError: error => {

  //   },
  // });

  const updateGameSkillMutation = useMutation(
    'updateGameSkill',
    updateGameSkill,
    {
      onSuccess: data => {
        if (data?.success == 0) return displayErrorToast(data?.message);
        if (data?.success == 1) {
          // getUserProfileQuery?.refetch();

          setState({...state, skill_level: false, reload: true});
          displaySuccessToast(data?.message);
          refreshPage();

          return;
        }
      },
      onError: error => {
        if (error?.data?.success == 0)
          return displayErrorToast(error?.data?.message);
      },
    },
  );

  const handleSetSkill = () => {
    if (skill == 0) {
      displayErrorToast('Select the skill first');
      return;
    }
    const body = {
      category_id: category_id,
      game_skill: skill,
    };
    updateGameSkillMutation.mutate(body);
  };

  return (
    <Box
      backgroundColor={'white'}
      style={[styles.confirmationModal, TypographyStyles.cardShadow]}
      p={'l'}>
      <TouchableBox
        onPress={handleClose}
        style={{alignItems: 'flex-end', marginTop: -10}}>
        {Ionicon('close', wp(7), palette?.blackshade)}
      </TouchableBox>
      <Text variant={'blackshade20500'}>Set your skill level</Text>
      <Text variant={'blackshade16400'} mt={'l'}>
        How would you rate yourself at Badminton
      </Text>
      <Box marginVertical={'l'}>
        {game_skill_list.map(data => {
          return (
            <Box marginRight={'l'} mb={'m'}>
              <RadioButton
                text={data.lable}
                selected={skill === data.id}
                onPress={() => onClickItem(data.id)}
                radio={true}
              />
            </Box>
          );
        })}
      </Box>
      <Box height={45}>
        <Button label="Set my Skill" onPress={handleSetSkill} />
      </Box>
    </Box>
  );
};

export default SetSkill;
