import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import FastImage from 'react-native-fast-image'
import { ScrollView } from 'react-native-gesture-handler'
import { Images } from '../../../Constant/Image'
import { wp } from '../../Helpers/responsive-ratio'
import { Header } from '../../ReusableComponents'
import DashedLine from '../../ReusableComponents/DashedLine/dashedLine'
import { EvilIcon, feather } from '../../ReusableComponents/Icons'
import { Box, palette, Text, TouchableBox } from '../../Theme/Index'
import styles from './styles'
import PointsTab from './pointsTab'

const Earn = () => {
    return (
        <Box flex={1} backgroundColor={'white'}>
            <ImageBackground
                source={Images?.EarnPointsHeader}
                style={{ height: wp(60), width: '100%' }}
                resizeMode={FastImage?.resizeMode?.stretch}>
                <Header title={'Earn Points'} left white primary />
                <Box flexDirection={'row'} style={{ marginLeft: wp(6), marginTop: wp(12) }}>
                    <Text variant={'white36700'}>
                        130
                    </Text>
                    <Text variant={'white18500'} style={{ marginTop: wp(4) }} ml={'s'}>points</Text>
                </Box>
                <Box flexDirection={'row'} alignItems={'center'} style={{ marginLeft: wp(7) }}>
                    <Box>{feather('zap', wp(4), palette?.white)}</Box>
                    <Text variant='white14400' ml={'s'}>
                        Super Active
                    </Text>
                </Box>
            </ImageBackground>
            <Box
                flex={1}
                style={[styles.BottomContainer]}
                backgroundColor="white"
            >
                <Box flex={1} mt={'l'}>
                    <PointsTab />
                </Box>
            </Box>
        </Box>
    )
}

export default Earn