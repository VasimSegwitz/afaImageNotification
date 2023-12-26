import React from 'react'
import FastImage from 'react-native-fast-image'
import { ScrollView } from 'react-native'
import { Images } from '../../../Constant/Image'
import { Header } from '../../ReusableComponents'
import AccordianButton from '../../ReusableComponents/AccordianButton'
import { Box, Text } from '../../Theme/Index'
import Location from './Preferences/location'
import Notificaion from './Preferences/notification'
import Sport from './Preferences/sport'

const Preferences = () => {

    const DATA = [
        {
            id: 1,
            icon: Images?.Running,
            title: 'Sport',
            component: <Sport />
        },
        {
            id: 2,
            icon: Images?.Location,
            title: 'Location',
            component: <Location />
        },
        // {
        //     id: 3,
        //     icon: Images?.NotificationBell,
        //     title: 'Notification',
        //     component: <Notificaion />
        // }
    ]

    return (
        <Box flex={1} backgroundColor={"white"}>
            <Header title={"Preferences"} left />
            <Box p={"l"} flex={1}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {DATA.map((data) => {
                        return (
                            <AccordianButton
                                key={data?.id}
                                title={() => (
                                    <Box flexDirection="row">
                                        <FastImage
                                            source={data?.icon}
                                            style={{ height: 24, width: 24 }}
                                            resizeMode={FastImage?.resizeMode?.contain}
                                        />
                                        <Text ml="m" variant="blackshade16800">{data?.title}</Text>
                                    </Box>
                                )}
                                data={() => (
                                    <Box mt="l">{data?.component}</Box>
                                )}
                                defaultExpand={false}
                            />
                        )
                    })}
                </ScrollView>
            </Box>
        </Box>
    )
}

export default Preferences