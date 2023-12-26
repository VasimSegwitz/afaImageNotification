import React from 'react'
import { FlatList } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Images } from '../../../Constant/Image'
import { wp } from '../../Helpers/responsive-ratio'
import { Box, Text, TouchableBox } from '../../Theme/Index'

const UserNotification = () => {
    const DATA = [
        {
            id: 1,
            icon: Images?.Profile,
            text: "Charles wants to add you as friend",
            time: "14 hours ago",
            is_req: true
        },
        {
            id: 2,
            icon: Images?.Profile,
            text: "Emily accepted your friend request",
            time: "14 hours ago"
        },
        {
            id: 3,
            icon: Images?.Points,
            text: "You got 1 successful referral",
            time: "14 hours ago"
        },
        {
            id: 4,
            icon: Images?.Ticket,
            text: "Your ticket has been received and is being processed",
            time: "14 hours ago"
        },
    ]

    const renderItem = (items) => {
        const { icon, text, time, is_req } = items?.item;
        return (
            <TouchableBox style={{ marginLeft: wp(4), marginTop: wp(6) }}>
                <Box flexDirection={"row"} alignItems={"center"} flex={1}>
                    <Box flex={0.1}>
                        <FastImage
                            source={icon}
                            style={{ height: wp(8), width: wp(8), marginBottom: wp(5) }}
                            resizeMode={FastImage?.resizeMode?.contain}
                        />
                    </Box>
                    <Box flex={0.9} ml={"l"} mr={"m"}>
                        <Text variant={"blackshade16400"}>{text}</Text>
                        <Text variant="placeholder12400" marginVertical={"s"}>{time}</Text>
                        {is_req && (
                            <Box flexDirection={"row"} mb={"m"}>
                                <TouchableBox
                                    p={"s"}
                                    borderRadius={8}
                                    backgroundColor={"black"}
                                    width={wp(18)}
                                    alignItems={"center"}
                                >
                                    <Text variant="white12500">Accept</Text>
                                </TouchableBox>
                                <TouchableBox
                                    p={"s"}
                                    borderRadius={8}
                                    backgroundColor={"white"}
                                    width={wp(18)}
                                    alignItems={"center"}
                                    ml={"m"}
                                    borderWidth={1}
                                >
                                    <Text variant="blackshade12500">Reject</Text>
                                </TouchableBox>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box borderWidth={0.5} borderColor={"tertiary2"} mr={"l"} />
            </TouchableBox>
        )
    }

    return (
        <Box flex={1} backgroundColor={"white"}>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            />
        </Box>
    )
}

export default UserNotification