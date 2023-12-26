import {Platform, StyleSheet} from 'react-native';

import {fonts, palette} from '../../Theme/Index';
import {wp, hp} from '../../Helpers/responsive-ratio';

export const styles = StyleSheet.create({
  dropdown3BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: palette.border,
    // left: '0%',
    // marginRight: 10,
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingRight: 0,
  },
  dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    color: 'black',
    // textAlign: 'center',

    fontSize: wp(4),
    lineHeight: 24,
    fontWeight: '500',
    color: palette.blackshade,

    // marginHorizontal: 5,
    fontFamily: fonts.medium,
  },
  dropdown3DropdownStyle: {
    backgroundColor: 'white',
    marginTop: hp(Platform.OS === 'ios' ? 0.2 : -4),
  },
  dropdown3RowStyle: {
    backgroundColor: '#fff',
    borderBottomColor: '#444',
    borderBottomWidth: 0.4,
    borderBottomColor: palette.border,
    // marginHorizontal: 15,
    height: 45,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 0,
    // paddingHorizontal: 15,
    // borderWidth: 1,
    // borderColor: palette.border,
  },
  dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3RowTxt: {
    color: '#000',
    // textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    marginHorizontal: 0,
    width: '100%',
    fontFamily: 'Poppins-Regular',
  },
});
