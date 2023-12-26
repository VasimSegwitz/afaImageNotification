import React from 'react';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {Button} from '../../ReusableComponents';
import styles from './style';
import {Ionicon} from '../../ReusableComponents/Icons';
import {useSelector} from 'react-redux';

const ActivityPaid = props => {
  const {state, setState} = props;
  const total = useSelector(state => state?.activity?.activity?.totalPayable);
  const handleOkCancel = () => setState({...state, is_activity_paid: false});
  return (
    <Box
      backgroundColor={'white'}
      style={[
        styles.confirmationModal,
        TypographyStyles.cardShadow,
        {top: wp(25)},
      ]}
      p={'l'}>
      <TouchableBox
        onPress={handleOkCancel}
        style={{alignItems: 'flex-end', marginTop: -10}}>
        {Ionicon('close', wp(7), palette?.blackshade)}
      </TouchableBox>
      <FastImage
        source={Images?.ActivityPaid}
        resizeMode={FastImage?.resizeMode?.contain}
        style={{height: wp(70), width: wp(80)}}
      />
      <Text variant={'blackshade20500'} marginVertical={'l'}>
        Payment made
      </Text>
      <Text variant={'blackshade16400'}>
        RM {total} will be deducted from Wallet when request will be accepted.
      </Text>
      <Box height={45} mt={'l'}>
        <Button label="Ok" onPress={handleOkCancel} />
      </Box>
    </Box>
  );
};

export default ActivityPaid;
