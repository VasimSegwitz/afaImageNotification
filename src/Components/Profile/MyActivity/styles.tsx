import { StyleSheet } from 'react-native'
import { wp } from '../../Helpers/responsive-ratio';
import { palette } from '../../Theme/Index';

const styles = StyleSheet.create({
    mysportChip: {
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(2),
    },
    count: {
        backgroundColor: palette?.primary2,
        borderRadius: 15,
        width: wp(10),
        marginHorizontal: wp(1)
    }
})

export default styles
