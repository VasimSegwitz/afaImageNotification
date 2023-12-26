import React, {useState} from 'react';
import {wp} from '../Helpers/responsive-ratio';
import {Box, Text, TouchableBox} from '../Theme/Index';
import About from './about';
import MyGroups from './mygroups';
import MySports from './mysports';

const ProfileTab = props => {
  const {drawer, setDrawer} = props;

  const initialState = {is_about: true, is_mysport: false, is_mygroup: false};
  const [state, setState] = useState(initialState);

  const handleAbout = () =>
    setState({...state, is_about: true, is_mysport: false, is_mygroup: false});
  const handleMySports = () =>
    setState({...state, is_about: false, is_mysport: true, is_mygroup: false});
  const handleMyGroups = () =>
    setState({...state, is_about: false, is_mysport: false, is_mygroup: true});

  return (
    <Box flex={1} backgroundColor="white">
      <Box
        flexDirection={'row'}
        alignItems={'center'}
        // justifyContent={"space-evenly"}
        style={{marginLeft: wp(4)}}>
        <TouchableBox onPress={handleAbout}>
          <Text
            variant={state.is_about ? 'blackshade16500' : 'blackshade116500'}>
            About
          </Text>
          {/* {state.is_about && ( */}
          <Box
            marginHorizontal="m"
            height={wp(1)}
            mt="s"
            backgroundColor={state.is_about ? 'primary' : 'white'}
            style={{borderRadius: wp(5)}}
          />
          {/* )} */}
        </TouchableBox>
        <TouchableBox onPress={handleMySports} style={{marginLeft: wp(6)}}>
          <Text
            variant={state.is_mysport ? 'blackshade16500' : 'blackshade116500'}>
            My Sports
          </Text>
          {/* {state.is_mysport && ( */}
          <Box
            marginHorizontal="m"
            height={wp(1)}
            mt="s"
            backgroundColor={state.is_mysport ? 'primary' : 'white'}
            style={{borderRadius: wp(5)}}
          />
          {/* )} */}
        </TouchableBox>
        {/* <TouchableBox onPress={handleMyGroups}>
                    <Text variant={state.is_mygroup ? "blackshade16500" : "blackshade116500"}>My Groups</Text>
                    {state.is_mygroup && <Box marginHorizontal="m" height={wp(1)} mt="s" backgroundColor="primary" style={{ borderRadius: wp(5) }} />}
                </TouchableBox> */}
      </Box>
      <Box style={{marginLeft: wp(4)}}>
        {state.is_about && <About />}
        {state.is_mysport && <MySports drawer={drawer} setDrawer={setDrawer} />}
        {state.is_mygroup && <MyGroups />}
      </Box>
    </Box>
  );
};

export default ProfileTab;
