import React from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {Box, TouchableBox} from '../../Theme/Index';
// import RadioButton from '../../Dashboard/purchaseJourney/radioButton';
import {styles} from './styles';
import Button from '../Button';
import RadioButton from '../RadioButton';

const ActionSheet = ({
  visible = false,
  onClose,
  onItemPress,
  items,
  selectedItem,
  title,
  onFinal,
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
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <Box style={styles.titleArea}>
          {items?.length ? (
            <Text style={styles.subTitleText}>{`Select ${title} here`}</Text>
          ) : null}
        </Box>
        <Box style={styles.divider} />
        <ScrollView
          contentContainerStyle={styles.scrollView}
          nestedScrollEnabled>
          <TouchableBox activeOpacity={1}>
            {items && items.length > 0
              ? items.map((item, index) => {
                  return (
                    <Box
                      key={'items' + index.toString()}
                      style={styles.touchHomeRowInfo}>
                      <RadioButton
                        // checked={selectedItem?.value === item.value}
                        // item={item?.label}
                        text={item?.label}
                        selected={selectedItem?.value === item.value}
                        onPress={() => onClickItem(item)}
                      />
                    </Box>
                  );
                })
              : null}
          </TouchableBox>
        </ScrollView>
        <Button
          onPress={onFinal}
          label={'Assign'}
          buttonStyle={styles.buttonStyle}
        />
      </View>
      {/* </View> */}
    </Modal>
  );
};

export default ActionSheet;
