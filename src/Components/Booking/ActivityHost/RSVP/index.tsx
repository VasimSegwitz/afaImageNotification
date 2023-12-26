import React from 'react';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Header} from '../../../ReusableComponents';
import AccordianButton from '../../../ReusableComponents/AccordianButton';
import {Ionicon} from '../../../ReusableComponents/Icons';
import {Box, palette, Text} from '../../../Theme/Index';
import UserList from './GoingUserList';
import NotGoingList from './NotGoingList';
import RequestList from './RequestList';
import {styles} from './styles';
import UnansweredList from './UnansweredList';
import {useQuery} from 'react-query';
import {getSingleActivity} from '../../../Services/Booking';
import {displayErrorToast} from '../../../../utils';
import authStore from '../../../../Zustand/store';
import {goingUser} from '../../../Helpers/HelperFunctions';

export default props => {
  const {vanue} = authStore(state => state?.vanue);
  const setVanue = authStore(state => state?.setVanue);

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getActivity = useQuery(
    ['getSingleActivity', vanue?.id],
    getSingleActivity,

    {
      onSuccess: data => {
        setVanue({
          vanue: data?.data,
        });

        props?.navigation?.setParams({vanue: data?.data});
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  const onSubmit = () => {
    getActivity?.refetch();
  };

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
                source={Images?.RightGreen}
                style={styles.image}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="m" variant="blackshade16800">
                Going ({' '}
                {goingUser(
                  vanue?.users?.filter(item => item?.request_type == 4),
                )}
                )
                {/* {vanue?.users?.filter(item => item?.request_type == 4)?.length}) */}
              </Text>
            </Box>
          )}
          data={() => (
            <Box mt="m">
              <Box flex={1}>
                <UserList
                  data={vanue?.users?.filter(item => item?.request_type == 4)}
                  Joiner={props?.route?.params?.from}
                  onSubmit={onSubmit}
                />
              </Box>
            </Box>
          )}
        />
        <AccordianButton
          title={() => (
            // <Box justifyContent="space-between" flexDirection="row">
            <Box flexDirection="row">
              <FastImage
                source={Images?.RedCross}
                style={styles.image}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="m" variant="blackshade16800">
                Not Going (
                {vanue?.users?.filter(item => item?.request_type == 3)?.length})
              </Text>
            </Box>
          )}
          data={() => (
            <Box mt="m">
              <Box flex={1}>
                <NotGoingList
                  data={vanue?.users?.filter(item => item?.request_type == 3)}
                  onSubmit={onSubmit}
                  Joiner={props?.route?.params?.from}
                />
              </Box>
            </Box>
          )}
        />
        <AccordianButton
          title={() => (
            // <Box justifyContent="space-between" flexDirection="row">
            <Box flexDirection="row">
              <FastImage
                source={Images?.BlackDots}
                style={styles.image}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="m" variant="blackshade16800">
                Requests (
                {goingUser(
                  vanue?.users?.filter(item => item?.request_type == 2),
                )}
                )
              </Text>
            </Box>
          )}
          data={() => (
            <Box mt="m">
              <Box flex={1}>
                <RequestList
                  data={vanue?.users?.filter(item => item?.request_type == 2)}
                  Joiner={props?.route?.params?.from}
                  onSubmit={onSubmit}
                />
              </Box>
            </Box>
          )}
        />
        <AccordianButton
          title={() => (
            // <Box justifyContent="space-between" flexDirection="row">
            <Box flexDirection="row">
              <FastImage
                source={Images?.QuestionGray}
                style={styles.image}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Text ml="m" variant="blackshade16800">
                Unanswered (
                {vanue?.users?.filter(item => item?.request_type == 1)?.length})
              </Text>
            </Box>
          )}
          data={() => (
            <Box mt="m">
              <Box flex={1}>
                <UnansweredList
                  data={vanue?.users?.filter(item => item?.request_type == 1)}
                  onSubmit={onSubmit}
                  Joiner={props?.route?.params?.from}
                />
              </Box>
            </Box>
          )}
        />
      </ScrollView>
    </Box>
  );
};
