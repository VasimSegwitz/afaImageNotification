import React from 'react'
import { ImageBackground, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Images } from '../../../../Constant/Image'
import { wp } from '../../../Helpers/responsive-ratio'
import { Header } from '../../../ReusableComponents'
import AccordianButton from '../../../ReusableComponents/AccordianButton'
import { Box, Text } from '../../../Theme/Index'
import { styles } from '../styles'
import LoveIt from './loveIt'
import NotReally from './notReally'

const Feedback = () => {

    const DATA = [
        {
            id: 1,
            icon: Images?.LoveIt,
            title: 'Love it',
            component: <LoveIt />
        },
        {
            id: 2,
            icon: Images?.NotReally,
            title: 'Not really',
            component: <NotReally />
        }
    ]

    return (
        <Box flex={1} backgroundColor="white">
            <ImageBackground
                source={Images?.FeedbackHeader}
                style={{
                    height: wp(60),
                    width: '100%',
                }}
                resizeMode={FastImage?.resizeMode?.stretch}>
                <Header left primary/>
            </ImageBackground>
            <Box
                flex={1}
                p={"l"}
                style={[styles.bottomContainer]}
                backgroundColor="white"
            >
                <Text variant={"primary24500"} >Enjoying your AFA journey so far?</Text>
                <Text variant={'tertiary16400'} mt="m">Let us know how much you love it! This will make our day better :)</Text>
                <Box flex={1}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {DATA.map((data) => {
                            return (
                                <AccordianButton
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
        </Box>
    )
}

export default Feedback