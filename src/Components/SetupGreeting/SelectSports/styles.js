import {Platform, StyleSheet} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {fonts, palette} from '../../Theme/Index';
export const styles = StyleSheet.create({
  inputStyle: {
    // borderWidth: 1,
    // borderColor: '#DEDEDE',
    //   paddingRight: 15,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '400',
    color: '#171717',
    fontFamily: fonts.regular,
    height: 45,
    width: '90%',
    alignItems: 'center',
    //   marginLeft: 5,
    paddingLeft: 50,
    // backgroundColor: '#FAFDFF',
    // margin: 10,
    // marginTop: wp(2),
  },
});
