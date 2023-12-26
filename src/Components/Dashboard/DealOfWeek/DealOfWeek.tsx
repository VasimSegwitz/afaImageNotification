import React, { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import theme, { Box, Text, TouchableBox, TypographyStyles } from '../../Theme/Index';
const Deal1 = require("../../../assets/Home/Deal1/Deal1.png")
const Deal2 = require("../../../assets/Home/Deal2/Deal2.png")
const Banner3 = require("../../../assets/Home/Banner/BannerAnimation3.png")
import Carousel from 'react-native-reanimated-carousel';
import { size } from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import { wp } from '../../Helpers/responsive-ratio';

const DealOfWeek = ({ navigation, route }) => {

    const data =

        useMemo(
            () => [{
                id: 1,
                source: Deal1
            }, {
                id: 2,
                source: Deal2
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
                renderItem={({ item }) => {
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
                                <Text variant="blackshade112500">Kuala Lumpur</Text>
                                <Text mt="m" variant="blackshade16800">Playground No.6 Sports Centre</Text>
                                <Box mt="m">
                                    <Text variant="blackshade114500" numberOfLines={3}>Use promo code CCDSGL20 for all bookings</Text>
                                </Box>
                                <TouchableBox mt="m" mb="m" alignItems="center" justifyContent="center" backgroundColor="primary" height={28} width={82} borderRadius={30}>
                                    <Text variant="white14Medium">20% OFF</Text>
                                </TouchableBox>
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
        height: 320,
    },

});

export default memo(DealOfWeek)