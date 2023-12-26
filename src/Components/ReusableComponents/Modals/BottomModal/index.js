import React from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {Box, palette, TouchableBox, Text, fonts} from '../../../Theme/Index';
import {styles} from './styles';
import Button from '../../Button';
import {Down, Ionicon} from '../../Icons';
import {wp} from '../../../Helpers/responsive-ratio';
import {Images} from '../../../../Constant/Image';
import {Input} from '../../Input';

const GeneralModal = ({
  visible = false,
  onClose,
  onPress,
  onItemPress,

  title,

  buttonLabel,
  detail,
  left = false,
  buttonColor = palette?.primary,
  number = 12345678,
}) => {
  const onClickItem = item => {
    onItemPress(item);
  };

  return (
    <Modal
      transparent
      isVisible={visible}
      propagateSwipe={true}
      // swipeDirection="down"
      onSwipeComplete={() => onClose()}
      onBackdropPress={() => onClose()}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <Pressable style={styles.overlay} onPress={() => onClose()} />
      <Box style={styles.modalStyle}>
        <Box style={styles.whiteCard}>
          <Box style={styles.buttonsWrap}>
            {Ionicon('close', 20, palette?.white)}
            <Box width={'80%'}>
              <Text style={styles.blessingImg}>{title}</Text>
            </Box>
            <TouchableBox style={styles.closeIcon} onPress={() => onClose()}>
              {Ionicon('close', 20, palette?.black)}
              {/* <Ionicons name="close" size={30} color={palette.black} /> */}
            </TouchableBox>
          </Box>
          <ScrollView
            style={{flexGrow: 1, paddingBotton: 60, marginBottom: 90}}>
            <Box style={styles.textWrap} paddingVertical="l">
              <Text style={styles.midText} textAlign={left ? 'left' : 'center'}>
                {detail}
              </Text>
            </Box>
          </ScrollView>

          <Box
            height={1}
            width={wp(90)}
            backgroundColor="tertiary2"
            marginVertical="t"
            alignSelf="center"
          />
          {/* <Box style={styles.textWrap} paddingVertical="xxl">
            <Text style={styles.number}>+60 {number}</Text>
          </Box> */}
          <Box position="absolute" bottom={130} width="100%">
            <Button
              label={buttonLabel}
              onPress={onPress}
              buttonColor={buttonColor}
            />
          </Box>

          {/* <Box style={styles.textEditWrap}>
            <Text style={styles.Editnumber}>Edit the phone number</Text>
          </Box> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default GeneralModal;
