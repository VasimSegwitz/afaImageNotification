import {StyleSheet} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  headerWrap: (insets, back) => ({
    paddingTop: insets?.top + 5,
    paddingBottom: 10,

    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: back ? 'flex-start' : 'space-between',
    // borderBottomWidth: 0.5,
    // borderBottomColor: palette.borderShade1,
    // shadowColor: 'rgba(0, 0, 0, 0.3)',
    // shadowOffset: {
    //   width: 3,
    //   height: 5,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 2.6,
    // elevation: 4,

    // borderBottomColor: '#000',
  }),
  headerWrapSearch: insets => ({
    paddingTop: insets?.top + 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 0.3,
    // borderBottomColor: '#eee',
    paddingBottom: 10,

    // justifyContent: 'space-between',
  }),
  titleStyle: {
    fontFamily: fonts.medium,
    fontWeight: '500',
    fontSize: 18,
    marginLeft: 10,
  },
  backIcon: {
    marginTop: 3,
    marginRight: 15,
  },
  iconStyle: {
    // paddingTop: 25,
    // paddingLeft: 12,
    color: palette.placeholder,
  },
  iconArea: title => ({
    // height: '45%',
    // marginRight: 15,
    width: title ? 'auto' : '10%',

    // backgroundColor: 'blue',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // backgroundColor: 'blue',
    // marginTop: 13,
    // flexDirection: 'row',
  }),
  innerHeaderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
