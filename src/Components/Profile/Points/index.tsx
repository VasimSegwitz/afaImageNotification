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

const Points = () => {
    const navigation = useNavigation()

    const options = [
        {
            id: 1,
            icon: Images?.Earn,
            title: 'Earn',
            icon2: Images?.RightArrow,
            goto: 'Earn'
        },
        {
            id: 2,
            icon: Images?.MyReward,
            title: 'My Rewards',
            icon2: Images?.RightArrow,
            goto: null
        }
    ]

    const handleNavigation = (data) => navigation.navigate(data)

    return (
        <Box flex={1} backgroundColor={'white'}>
            <ImageBackground
                source={Images?.PointsHeader}
                style={{ height: wp(60), width: '100%' }}
                resizeMode={FastImage?.resizeMode?.stretch}>
                <Header title={'My Points'} left white primary />
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
            <ScrollView showsVerticalScrollIndicator={false}>
                <Box flexDirection={'row'} ml={'m'} mt={'l'}>
                    {options.map((data) => {
                        return (
                            <TouchableBox
                                onPress={() => handleNavigation(data.goto)}
                                key={data?.id}
                                mr={'m'}
                                borderWidth={1.5}
                                borderRadius={10}
                                style={{ width: wp(45), height: wp(30), borderColor: palette?.primary }}
                            >
                                <Box flexDirection={'row'} p={'l'} justifyContent={'space-between'}>
                                    <Box>
                                        <FastImage
                                            source={data?.icon}
                                            style={{ height: wp(6), width: wp(6) }}
                                            resizeMode={FastImage?.resizeMode?.contain}
                                        />
                                        <Text variant={'blackshade16600'} mt={'m'}>{data?.title}</Text>
                                    </Box>
                                    <FastImage
                                        source={data?.icon2}
                                        style={{ height: wp(6), width: wp(6) }}
                                        resizeMode={FastImage?.resizeMode?.contain}
                                    />
                                </Box>
                            </TouchableBox>
                        )
                    })}
                </Box>
                <Box
                    ml={'m'}
                    mt={'l'}
                    borderWidth={1.5}
                    borderRadius={10}
                    style={{ width: wp(93), borderColor: palette?.primary }}
                >
                    <Box flexDirection={'row'} alignItems={'center'} style={{ marginLeft: wp(4), marginTop: wp(4) }}>
                        <Box>{feather('zap', wp(4), palette?.primary)}</Box>
                        <Text variant='blackshade16600' ml={'s'}>
                            Super Active
                        </Text>
                        <Box ml={'s'}>{EvilIcon('exclamation', wp(6), palette?.tertiary4)}</Box>
                    </Box>
                    <Box style={styles.timelineHeader}>
                        <Text
                            paddingHorizontal={'m'}
                            paddingVertical={'m'}
                            variant={'white12500'}>
                            Super active
                        </Text>
                    </Box>
                    <Box style={styles.activityMeter}>
                        <Text
                            variant={'white12500'}
                            style={{ marginTop: 2 }}
                            textAlign={'center'}>
                            55
                        </Text>
                    </Box>
                    <DashedLine length={20} color={palette.primary} circleSize={3} circleLength={4} justifyContent='space-evenly' />
                    <Text variant={'blackshade14400'} textAlign={'center'} marginVertical={'m'}>
                        {`22+ activities to reach \n On Fire level`}
                    </Text>
                </Box>
                <Box
                    ml={'m'}
                    marginVertical={'l'}
                    borderWidth={1.5}
                    borderRadius={10}
                    style={{ width: wp(93), borderColor: palette?.primary }}
                >
                    <Box flexDirection={'row'} justifyContent={'space-between'} style={{ marginLeft: wp(4), marginTop: wp(4) }}>
                        <Text variant='blackshade16600' ml={'s'}>
                            Refer your friends
                        </Text>
                        <FastImage
                            source={Images?.RightArrow}
                            style={{ height: wp(6), width: wp(6), marginRight: wp(4) }}
                            resizeMode={FastImage?.resizeMode?.contain}
                        />
                    </Box>
                    <Box style={{ marginLeft: wp(5), marginTop: wp(4) }}>
                        <Text variant={'blackshade14400'}>For each successful referral:</Text>
                        <Box mt={'m'} flexDirection={'row'} alignItems={'center'}>
                            <Text variant='primary14500'>•</Text>
                            <Text variant='placeholder14400' ml={'s'}>You get</Text>
                            <Text variant='blackshade14400' ml={'s'}>10 points + RM5 in your AFA Wallet</Text>
                        </Box>
                        <Box flexDirection={'row'} alignItems={'center'}>
                            <Text variant='primary14500'>•</Text>
                            <Text variant='placeholder14400' ml={'s'}>They get</Text>
                            <Text variant='blackshade14400' ml={'s'}>RM5 in their AFA Wallet</Text>
                        </Box>
                        <Box flexDirection={'row'} alignItems={'center'}>
                            <Box
                                flexDirection={'row'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                marginVertical={'m'}
                                style={{
                                    width: wp(58),
                                    borderColor: palette?.primary,
                                    borderWidth: 1,
                                    borderStyle: 'dashed',
                                    borderRadius: 3
                                }}
                            >
                                <Text mt={'s'} ml={'m'} variant='primary14500'>KCDIF219</Text>
                                <Text mr={'s'} variant='placeholder14400'>Copy</Text>
                            </Box>
                            <TouchableBox
                                p={'s'}
                                justifyContent={'center'}
                                borderRadius={10}
                                backgroundColor={'black'}
                                style={{ height: wp(8), marginLeft: wp(5) }}
                            >
                                <Text variant='white12500'>Share now</Text>
                            </TouchableBox>
                        </Box>
                        <Text variant='blackshade14400' mb={'s'}>You have referred 3 friends</Text>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    )
}

export default Points