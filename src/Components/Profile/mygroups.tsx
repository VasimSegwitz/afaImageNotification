import React from "react"
import { ScrollView } from "react-native"
import FastImage from "react-native-fast-image"
import { Images } from "../../Constant/Image"
import { wp } from "../Helpers/responsive-ratio"
import { Box, palette, Text, TouchableBox, TypographyStyles } from "../Theme/Index"
import styles from "./styles"

const MyGroups = () => {

    const groups_data = [
        {
            image: Images.Group1,
            member_count: 132,
            header: 'Morning Workout',
            venue: '5-8pm, Sat-Sun @Wangsa Maju KL Player level'
        },
        {
            image: Images.Group2,
            member_count: 132,
            header: 'Yoga & Meditation',
            venue: '5-8pm, Sat-Sun @Wangsa Maju KL Player level'
        },
        {
            image: Images.Group1,
            member_count: 132,
            header: 'Morning Workout',
            venue: '5-8pm, Sat-Sun @Wangsa Maju KL Player level'
        },
        {
            image: Images.Group2,
            member_count: 132,
            header: 'Yoga & Meditation',
            venue: '5-8pm, Sat-Sun @Wangsa Maju KL Player level'
        }
    ]

    return (
        <Box flex={1} backgroundColor="white" mt={"l"}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {groups_data.map((data, i) => {
                    return (
                        <TouchableBox backgroundColor={'white'} style={[styles.mygroupsCard, TypographyStyles.cardShadow]}>
                            <FastImage
                                source={data.image}
                                style={{ height: wp(25), borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                                resizeMode={FastImage?.resizeMode?.contain}
                            />
                            <Box ml={"m"} mt={"m"} flexDirection={"row"} alignItems={"center"}>
                                <FastImage
                                    source={Images.Earth}
                                    style={{ height: wp(5), width: wp(5) }}
                                    resizeMode={FastImage?.resizeMode?.contain}
                                />
                                <Text variant={"placeholder12400"} ml={"m"} mt={"s"}>{data.member_count} members</Text>
                            </Box>
                            <Text ml={"m"} marginVertical={"s"} variant={"blackshade16500"}>{data.header}</Text>
                            <Text ml={"m"} variant={"placeholder14400"}>{data.venue}</Text>
                        </TouchableBox>
                    )
                })}
            </ScrollView>
        </Box>
    )
}

export default MyGroups