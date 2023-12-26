import React from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {Box, TouchableBox} from '../../Theme/Index';
// import RadioButton from '../../Dashboard/purchaseJourney/radioButton';
import {styles} from './styles';
import Button from '../Button';
import RadioButton from '../RadioButton';
import {Input} from '../Input';

const CancelSheet = ({
  visible = false,
  onClose,
  onItemPress,
  items,
  selectedItem,
  title,
  onFinal,
  onChange,
  value,
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
      {/* <View style={styles.modalStyle}> */}
      <View style={styles.inputHomeRowInfo}>
        <Box style={styles.border} />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            Are you sure you want to reject this request
          </Text>
        </View>
        <Box style={styles.titleArea}>
          <Text>{`if you reject this booking You don't have chance to undo it.Do you want to reject this booking ?`}</Text>
        </Box>
        {/* <Box style={styles.divider} /> */}
        <ScrollView
          contentContainerStyle={styles.scrollView}
          nestedScrollEnabled>
          <Text style={styles.label}>Reject Cause *</Text>
          <Input
            // placeholder={''}
            onChange={onChange}
            value={value}
            multiline={true}
            numberOfLines={5}
            place="Please ! Let the patient know about rejection reason"
            note
          />
        </ScrollView>
        <Button
          onPress={onFinal}
          label={'Reject'}
          buttonStyle={styles.buttonStyle}
        />
      </View>
      {/* </View> */}
    </Modal>
  );
};

export default CancelSheet;
