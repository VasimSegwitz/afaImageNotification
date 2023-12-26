import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Helpers/responsive-ratio';
import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: 'red',
    justifyContent: 'flex-end',
  },
  topImageWrap: {
    // height: hp(48),
    marginTop: 30,

    // height: hp(50),
    // width: wp(100),
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logo: {height: wp(30), width: wp(60)},
  backlogo: {
    height: wp(50),
    width: wp(100),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  whiteCard: {
    // paddingHorizontal: 25,
    // paddingVertical: 40,
    marginTop: 10,
    paddingBottom: 30,
    // shadowColor: 'rgba(0,0,0,0.3)',
    // shadowOffset: {
    //   width: 1,
    //   height: 2,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.medium,
    fontWeight: '500',
    lineHeight: 28,
    color: palette.blackshade,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: '400',
    lineHeight: 22,
    color: palette.blackshade,
    // marginBottom: 20,
    // alignSelf: 'center',
  },
  number: {
    fontSize: 24,
    fontFamily: fonts.regular,
    fontWeight: '500',
    lineHeight: 32,
    color: palette.blackshade,
    marginBottom: 20,
    // alignSelf: 'center',
  },
  timerText: {
    fontSize: 22,
    fontFamily: fonts.medium,
    color: palette.black,
    marginBottom: 25,
  },
});
