import React, {useState} from 'react';
import {Alert, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {Images} from '../../../Constant/Image';
import {Box, Text, TouchableBox, TypographyStyles} from '../../Theme/Index';
import {styles} from './styles';

const ImageUpload = ({onChange, image}) => {
  const [result, setResult] = useState();

  const onPicker = async () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
    }).then(image => {
      const data = [
        {
          name: image?.path,
          type: image?.mime,
          uri: image?.path,
        },
      ];
      setResult(data);
      onChange(data);
    });
  };

  const onCaptureImage = () =>
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
    }).then(image => {
      const data = [
        {
          name: image?.path,
          type: image?.mime,
          uri: image?.path,
        },
      ];
      setResult(data);
      onChange(data);
    });

  const onPress = () =>
    Alert.alert('Alert', 'What Would You Like To Do', [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'Upload Image',
        onPress: onPicker,
      },
      {text: 'Capture Image', onPress: onCaptureImage},
    ]);
  return (
    <TouchableBox onPress={() => onPress()}>
      <Box justifyContent={'center'} alignItems={'center'} marginVertical={'l'}>
        {result?.length ? (
          <FastImage
            source={result?.[0]?.uri ? {uri: result?.[0]?.uri} : Images.Profile}
            style={[styles.userImage, TypographyStyles.cardShadow]}
            resizeMode={FastImage?.resizeMode?.contain}
          />
        ) : (
          <FastImage
            source={
              image
                ? {
                    uri: image,
                  }
                : Images.Profile
            }
            style={styles.userImage}
          />
        )}
        <Text ml="l" marginVertical={'m'} variant={'blackshade14500'}>
          Change profile picture
        </Text>
      </Box>
    </TouchableBox>
  );
};

export default ImageUpload;
