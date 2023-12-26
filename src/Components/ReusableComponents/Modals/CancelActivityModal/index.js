import React, {useState} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {Box, palette, TouchableBox, Text, fonts} from '../../../Theme/Index';
import {styles} from './styles';
import Button from '../../Button';
import {Down, Ionicon} from '../../Icons';
import {wp} from '../../../Helpers/responsive-ratio';
import {Images} from '../../../../Constant/Image';
import {Input} from '../../Input';
import RadioButton from '../../RadioButton';
import FastImage from 'react-native-fast-image';

const CancelActivityModal = ({
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
    const d = reason?.map(i => {
      if (item == i)
        return {
          ...i,
          flag: true,
        };
      else
        return {
          ...i,
          flag: false,
        };
    });

    setReason(d);

    onItemPress(item);
  };

  const Data = [
    {name: 'Insufficient Players', flag: false, value: 1},
    {name: 'Bad Weather', flag: false, value: 2},
    {name: 'No Venue available to book', flag: false, value: 3},
  ];

  const [reason, setReason] = useState(Data);

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
            {/* {Ionicon('close', 20, palette?.white)} */}

            <Text style={styles.blessingImg}>{title}</Text>
            <TouchableBox style={styles.closeIcon} onPress={() => onClose()}>
              {Ionicon('close', 20, palette?.black)}
              {/* <Ionicons name="close" size={30} color={palette.black} /> */}
            </TouchableBox>
          </Box>
          <ScrollView>
            <Box style={styles.textWrap} paddingVertical="l">
              <Text
                variant="blackshade12900"
                // style={styles.midText}
                textTransform="uppercase"
                textAlign={left ? 'left' : 'center'}>
                {detail}
              </Text>
            </Box>
            <Box style={styles.textWrap}>
              <Text
                variant="blackshade16400"
                // style={styles.midText}

                textAlign={left ? 'left' : 'center'}>
                May we know what is the reason you want to cancel this Activity?
              </Text>
            </Box>
            <Box style={styles.textWrap} marginVertical="l">
              {reason?.map(item => {
                return (
                  <Box mb="s">
                    <RadioButton
                      text={item?.name}
                      selected={item?.flag}
                      onPress={() => onClickItem(item)}
                      textStyle={{
                        fontSize: 16,
                        fontWeight: '400',
                        fontFamiliy: fonts?.regular,
                        lineHeight: 22,
                        color: palette?.blackshade,
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
            <Box style={styles.textWrap} paddingBottom="l">
              <Text
                variant="blackshade12900"
                // style={styles.midText}
                textTransform="uppercase"
                textAlign={left ? 'left' : 'center'}>
                Money refund
              </Text>
            </Box>
            <Box style={styles.textWrap}>
              <Text
                variant="blackshade16400"
                // style={styles.midText}

                textAlign={left ? 'left' : 'center'}>
                For the Activity that needs to Pay by Wallet, the money will be
                automatically refunded to the Players.
              </Text>
            </Box>
            <Box style={styles?.textWrap} mt="l">
              <Box flexDirection="row">
                <FastImage
                  source={Images?.Info}
                  style={{
                    height: 18,
                    width: 18,
                  }}
                  resizeMode="contain"
                />
                <Text variant="blackshade12400" ml="m">
                  Read more about our Refund Policy
                </Text>
              </Box>
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

          <Button
            label={buttonLabel}
            onPress={onPress}
            buttonColor={buttonColor}
          />
          <TouchableBox onPress={onClose}>
            <Box style={styles.textEditWrap}>
              <Text style={styles.Editnumber}>Cancel</Text>
            </Box>
          </TouchableBox>
        </Box>
      </Box>
    </Modal>
  );
};

export default CancelActivityModal;
