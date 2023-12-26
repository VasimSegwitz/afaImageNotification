import React from 'react';
import {Image} from 'react-native';
import {TouchableBox, Text, palette} from '../../Theme/Index';
import {styles} from './styles';

/**
 * @function Button
 * @param label,buttonStyle,onPress...etc
 * @decription Button component as per the theme
 */

const Button = ({
  label,
  buttonStyle,
  onPress,
  disabled,
  buttonColor,
  textStyle,
  img = false,
  imageStyle,
  Imagewithlabel = false,
  RenderComponent = () => {},
}) => {
  return (
    <TouchableBox
      style={[
        styles.button,
        buttonStyle,
        {
          backgroundColor: disabled
            ? 'lightgrey'
            : buttonColor || palette.primary,
        },
      ]}
      onPress={onPress}
      disabled={disabled}>
      {RenderComponent() ? (
        RenderComponent()
      ) : Imagewithlabel ? (
        <>
          <Image
            source={img}
            style={[styles.image, imageStyle]}
            resizeMode="contain"
          />
          <Text style={[styles.buttonText, textStyle]}>{label}</Text>
        </>
      ) : img ? (
        <Image source={img} style={[styles.image, imageStyle]} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{label}</Text>
      )}
    </TouchableBox>
  );
};

export default Button;
