import { StyleSheet } from 'react-native';
import { wp } from '../../Helpers/responsive-ratio';
import { palette } from '../../Theme/Index';

const styles = StyleSheet.create({
    placeHolder: {
        height: wp(25),
        width: wp(35),
        fontSize: 64,
        fontWeight: "600",
        marginTop: wp(2)
    },
    rm: {
        marginTop: wp(-4), 
        marginLeft: wp(4), 
        marginRight: wp(1)
    },
    walletBalance: {
        textAlign: "center"
    },
    amountChip: {
        width: wp(24),
        height: wp(11),
        borderRadius: 10,
        borderWidth: wp(0.3),
        borderColor: palette.primary,
        margin: wp(2)
    },
    selectedChip: {
        width: wp(24),
        height: wp(11),
        borderRadius: 10,
        backgroundColor: palette.primary,
        margin: wp(2)
    },
    hoverCard: {
        height: wp(23),
        width: wp(90),
        borderRadius: 10,
        zIndex: 5,
        top: wp(-4)
    },
    confirmationModal: {
        position: 'absolute',
        left:0,
        right: 0,
        bottom: 0,
        // top: wp(50),
        // marginHorizontal: wp(4),
        borderRadius: 10
    },
    overLay: {
        position: 'absolute',
        // flex: 1,
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.overlay,
        height: '100%',
        width: '100%',
        zIndex: 1,
      }
});

export default styles;
