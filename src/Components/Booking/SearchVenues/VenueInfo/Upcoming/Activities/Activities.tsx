import React, { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import theme, { Box, size, Text, TouchableBox, TypographyStyles } from '../../../../../Theme/Index';
const badminton = require("../../../../../../assets/Home/badminton/badminton.png")
const Save = require("../../../../../../assets/Home/Save/Save.png")
const Time = require("../../../../../../assets/Home/Time/Time.png")
const User = require("../../../../../../assets/Home/User/User.png")
const Location = require("../../../../../../assets/Home/Location/Location.png")
const Dollar = require("../../../../../../assets/Home/Dollar/Dollar.png")
const Calender = require("../../../../../../assets/Home/Calender/Calender.png")

import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { wp } from '../../../../../Helpers/responsive-ratio';

const Activities = ({ navigation, showDollar }) => {

  const { first_name } = useSelector(state => state?.auth?.user?.user?.data);

    return (
        <Box borderRadius={10} backgroundColor="white" minHeight={175} style={TypographyStyles.cardShadow}>
            <Box alignItems="center" justifyContent="space-between" flexDirection="row" >
                <Box flexDirection="row" ml="m" mt="m" alignItems="center">
                    <FastImage
                        source={badminton}
                        style={styles.badImage}
                        resizeMode={FastImage?.resizeMode?.contain}
                    />
                    <Text ml="m" variant="blackshade16800">Badminton doubles</Text>
                </Box>
                <TouchableBox mr="m">
                    <FastImage
                        source={Save}
                        style={styles.saveImg}
                        resizeMode={FastImage?.resizeMode?.contain}
                    />
                </TouchableBox>
            </Box>
            <Box marginHorizontal={"m"}>
                <Text variant="blackshade112500">Intermediate • 3/4 joined • Min 2 to start</Text>
            </Box>
            <Box backgroundColor="tertiary2" marginVertical="m" height={1} marginHorizontal="m" />
            <Box marginHorizontal="m" flexDirection="row">
                <Box alignItems="center" mt="m">
                    <FastImage
                        source={User}
                        style={styles.userImg}
                        resizeMode={FastImage?.resizeMode?.contain}
                    />
                    <Text style={{width: wp(12)}} variant="blackshade112500">{first_name}</Text>
                    <Text variant="blackshade112500">(Host)</Text>
                </Box>
                <Box mt="m" ml="m">
                    <Box flexDirection="row" alignItems="center">
                        <FastImage
                            source={Time}
                            style={styles.badImage}
                            resizeMode={FastImage?.resizeMode?.contain}
                        />
                        <Text ml="s" variant="blackshade14800">24 July, 10 : 30 AM</Text>
                    </Box>
                    <Box flexDirection="row" justifyContent="center" mt="m">
                        <FastImage
                            source={Location}
                            style={[styles.badImage, { marginTop: 5 }]}
                            resizeMode={FastImage?.resizeMode?.contain}
                        />
                        <Box width={size.width / 1.7} mb="m">
                            <Text numberOfLines={2} ml="s" variant="blackshade14800">Sungai Chua Kajang Badminton Centre</Text>
                            <Text numberOfLines={2} ml="s" variant="blackshade112500">Sungai Chua Kajang Badminton Centre</Text>
                        </Box>

                    </Box>
                    {showDollar ?
                        <Box flexDirection="row" alignItems="center" mt="m" mb="m">
                            <Box flexDirection="row" alignItems="center">
                                <FastImage
                                    source={Calender}
                                    style={styles.badImage}
                                    resizeMode={FastImage?.resizeMode?.contain}
                                />
                                <Text ml="s" variant="blackshade14400">Court booked</Text>
                            </Box>
                            <Box ml="m" flexDirection="row" alignItems="center">
                                <FastImage
                                    source={Dollar}
                                    style={styles.badImage}
                                    resizeMode={FastImage?.resizeMode?.contain}
                                />
                                <Text ml="s" variant="blackshade14400">RM 25/pax</Text>
                            </Box>
                        </Box> : null}
                </Box>
            </Box>

        </Box>
    );
};

const styles = StyleSheet.create({
    content: { flexGrow: 1 },
    badImage: {
        height: 18, width: 18
    },
    saveImg: {
        height: 20, width: 20
    }, 
    userImg: {
        height: 40, width: 40
    }
});

export default memo(Activities)