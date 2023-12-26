import React, { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import theme, { Box, Text, TouchableBox, TypographyStyles } from '../../Theme/Index';
const Group1 = require("../../../assets/Home/Group1/Group1.png")
const Group2 = require("../../../assets/Home/Group2/Group2.png")
const Earth = require("../../../assets/Home/Earth/Earth.png")
const Tick = require("../../../assets/Home/Tick/Tick.png")
import { size } from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import { wp } from '../../Helpers/responsive-ratio';

const DealOfWeek = ({ navigation, route }) => {

    const data =

        useMemo(
            () => [{
                id: 1,
                source: Group1
            }, {
                id: 2,
                source: Group2
            }]
            ,
            []
        );

    return (
        <Box mt="l">
            <FlatList
                showsHorizontalScrollIndicator={false}
                style={styles.listStyle}
                horizontal={true}
                data={data}
                renderItem={({ item, index }) => {
                    const { source } = item
                    return (
                        <Box width={size.width / 2 - 20} mb="s" ml="s" borderRadius={10} style={TypographyStyles.cardShadow} mr="m" minHeight={220} backgroundColor="white" >
                            <FastImage
                                source={source}
                                style={{
                                    borderTopRightRadius: 10,
                                    borderTopLeftRadius: 10,
                                    height: 105,
                                    width: size.width / 2 - 20,
                                }}
                                resizeMode={FastImage?.resizeMode?.stretch}
                            />
                            <Box mt="l" marginHorizontal="m" mb="l">
                                <Box flexDirection="row" >
                                    <FastImage
                                        source={Earth}
                                        style={{

                                            height: 18,
                                            width: 18,
                                        }}
                                        resizeMode={FastImage?.resizeMode?.stretch}
                                    />
                                    <Box>
                                        <Text variant="blackshade112500" ml="m">132 members</Text>
                                    </Box>
                                </Box>

                                <Text mt="m" variant="blackshade16800">Playground No.6 Sports Centre</Text>
                                <Box mt="m">
                                    <Text variant="blackshade114500" numberOfLines={3}>5-8pm, Sat-Sun
                                        @Wangsa Maju KL
                                        Player level</Text>
                                </Box>
                                {index === 0 ? <Box mt="m" alignItems="center" marginHorizontal={"m"} mb="l" justifyContent="center" >
                                    <TouchableBox
                                        width={size.width / 5}
                                        backgroundColor="white"
                                        height={40} borderWidth={1}
                                        borderColor="primary"
                                        justifyContent="center"
                                        alignItems="center"
                                        borderRadius={10}>
                                        <Text variant="blackshade14800">Join</Text>
                                    </TouchableBox>
                                </Box> :
                                    <Box mt="m" alignItems="center" marginHorizontal={"m"} mb="l" justifyContent="center" >
                                        <TouchableBox
                                            width={size.width / 5}
                                            backgroundColor="primary"
                                            height={40} borderWidth={1}
                                            borderColor="primary"
                                            justifyContent="center"
                                            alignItems="center"
                                            borderRadius={10}>
                                            <Box flexDirection="row" alignItems="center">
                                                <FastImage
                                                    source={Tick}
                                                    style={{
                                                        height: 18,
                                                        width: 18,
                                                    }}
                                                    resizeMode={FastImage?.resizeMode?.stretch}
                                                />
                                                <Text ml="s" variant="white14Medium">Joined</Text>
                                            </Box>

                                        </TouchableBox>
                                    </Box>
                                }
                            </Box>
                        </Box>
                    )
                }}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    content: { flexGrow: 1 },
    listStyle: {
        flexGrow: 0,
        height: 340,
    },

});

export default memo(DealOfWeek)