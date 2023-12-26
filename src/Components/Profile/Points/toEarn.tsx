import React from 'react'
import FastImage from 'react-native-fast-image'
import { Images } from '../../../Constant/Image'
import { wp } from '../../Helpers/responsive-ratio'
import { Box, Text } from '../../Theme/Index'

const ToEarn = () => {

    const grid_data = [
        {
            id: 1,
            icon: Images.AddcoHost,
            title: 'Wallet',
            body: `Top-up \nAFA Wallet`,
            footer: 'RM1 = 1 point'
        },
        {
            id: 2,
            icon: Images.AddcoHost,
            title: 'Booking',
            body: `Booking \nVenue`,
            footer: 'RM1 = 1 point'
        },
        {
            id: 3,
            icon: Images.AddcoHost,
            title: 'Activity',
            body: `Join Activity \nUsing AFA Pay`,
            footer: 'RM1 = 1 point'
        },
        {
            id: 4,
            icon: Images.AddcoHost,
            title: 'Friends',
            body: `Refer your \nfriends`,
            footer: '200 points'
        }
    ]

    return (
        <Box flex={1} backgroundColor="white" p={'m'}>
            <Text variant={'blackshade16400'} marginVertical={'m'}>Complete these mission to earn more points  </Text>
            <Box>
                {grid_data.map((data) => {
                    return (
                        <Box key={data.id}>
                            <Box>
                                <FastImage
                                    source={data?.icon}
                                    style={{ height: wp(6), width: wp(6) }}
                                    resizeMode={FastImage?.resizeMode?.contain}
                                />
                                <Text variant={'blackshade16600'} mt={'m'}>{data?.title}</Text>
                            </Box>
                            <Box>
                                
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

export default ToEarn