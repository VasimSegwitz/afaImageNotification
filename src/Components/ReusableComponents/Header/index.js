import React from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {styles} from './styles';
import Octicons from 'react-native-vector-icons/Octicons';
import {wp} from '../../Helpers/responsive-ratio';
import {Back, BackSpace, feather, Ionicon} from '../Icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Image} from 'react-native';
import {Images} from '../../../Constant/Image';
import {useDrawerStatus} from '@react-navigation/drawer';
// import FastImage from 'react-native-fast-image';
import SearchBar from '../SearchBar';
import {useNavigation} from '@react-navigation/native';
// import SearchBar from '../SearchBar';

const Header = ({
  title,
  containerStyle,
  searchBarStyle,
  // navigation,
  white,
  onback,
  close,
  onRight,
  RenderRightComponent = () => {},
  right = false,
  left,
  backSpace,
  menu,
  search,
  logo,
  drawer,
  searchbar,
  placeholder,
  onChange,
  searchValue,
  onFilter = () => {},
  filter = false,
  primary = false,
  placeholderTextColor,
  renderRightComponent = () => {},
  onFocus = () => {},
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const isDrawerOpen = !menu
    ? null
    : useDrawerStatus() === 'open'
    ? false
    : true;

  if (searchbar)
    return (
      <Box style={[styles.headerWrapSearch(insets), containerStyle]}>
        <TouchableBox
          hitSlop={{left: 20, top: 20, bottom: 20, right: 20}}
          style={styles.iconArea(title)}
          onPress={onback ? onback : () => navigation.goBack()}>
          {/* {BackSpace('keyboard-backspace', wp(7), palette?.primary)} */}
          {Back(
            close ? 'close-a' : 'angle-left',
            wp(5),
            primary
              ? palette?.border
              : filter
              ? palette?.primary
              : palette?.border,
          )}
        </TouchableBox>
        <Box>
          <SearchBar
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onChange={onChange}
            value={searchValue}
            filter={filter}
            onFilter={onFilter}
            inputStyle={searchBarStyle}
            onFocus={onFocus}
            primary={primary}
            renderRightComponent={renderRightComponent}
          />
        </Box>
      </Box>
    );
  else
    return (
      <>
        <Box style={[styles.headerWrap(insets), containerStyle]}>
          <TouchableBox
            hitSlop={{left: 20, top: 20, bottom: 20, right: 20}}
            style={styles.innerHeaderWrap}
            onPress={onback ? onback : () => navigation.goBack()}>
            {left &&
              Back(
                (name = close ? 'close-a' : 'angle-left'),
                wp(4),
                primary ? palette?.primary : palette?.black,
              )}
            {menu &&
              isDrawerOpen &&
              feather(
                (name = 'menu'),
                wp(5),
                drawer ? palette.white : palette?.primary,
              )}
            {drawer && feather((name = 'menu'), wp(5), palette.white)}
            {backSpace && (
              <Image
                source={Images.Back}
                style={{height: wp(4), widsth: wp(4), marginRight: 10}}
                resizeMode={'contain'}
              />
            )}
            {close && (
              <Fontisto
                name={close ? 'close-a' : 'angle-left'}
                size={wp(3.5)}
                style={{marginRight: 10}}
                color={white ? palette.white : palette.border}
              />
            )}
            <Box width={wp(70)}>
              <Text
                numberOfLines={2}
                //
                style={[
                  styles.titleStyle,
                  {color: white ? palette.white : palette.black},
                ]}>
                {title}
              </Text>
            </Box>
            {/* </Box> */}
          </TouchableBox>
          {logo && (
            <Image
              source={Images.logo}
              style={{
                width: wp(35),
                height: wp(15),
                // backgroundColor: 'blue',
                left: '-20%',
              }}
              resizeMode="contain"
            />
          )}
          {RenderRightComponent()
            ? RenderRightComponent()
            : search && (
                <TouchableBox style={styles.iconArea} onPress={onRight}>
                  {search && (
                    <Image
                      source={Images.Search}
                      style={{height: wp(9), widsth: wp(9)}}
                      resizeMode={'contain'}
                    />
                  )}
                </TouchableBox>
              )}
        </Box>
        {/* <Box
          height={0.3}
          backgroundColor="white"
          style={{
            shadowColor: 'rgba(0, 0, 0, .3)',
            shadowOffset: {
              width: 1,
              height: 0.5,
            },
            shadowOpacity: 1,
            shadowRadius: 1,
            elevation: 4,
          }}
        /> */}
      </>
    );
};

export default Header;
