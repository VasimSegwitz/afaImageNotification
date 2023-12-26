import React, { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';

const Banner1 = require("../../../../../../assets/Booking/SearchResults/VenueImage/VenueImage.png")
const Banner2 = require("../../../../../../assets/Home/Banner/BannerAnimation2.png")
const Banner3 = require("../../../../../../assets/Home/Banner/BannerAnimation3.png")
import Carousel from 'react-native-reanimated-carousel';
import { size, Box, Text, TouchableBox } from '../../../../../Theme/Index';
import FastImage from 'react-native-fast-image';
import { wp } from '../../../../../Helpers/responsive-ratio';

const Banner = (props) => {
    const { data } = props
    const img = data?.images
    
    return (
        <Box>
            <Carousel
                panGestureHandlerProps={{
                    activeOffsetX: [-10, 10],
                }}
                loop
                pagingEnabled={true}
                width={size.width}
                height={250}
                autoPlay={true}
                data={img}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => { }}
                renderItem={({ item, index }) => {
                    return (
                        <Box borderRadius={10}>
                            <FastImage
                                source={{ uri: item }}
                                style={{
                                    borderRadius: 10,
                                    height: 220,
                                    width: size.width - 40,
                                }}
                                resizeMode={FastImage?.resizeMode?.contain}
                            />
                        </Box>
                    )
                }}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    content: { flexGrow: 1 },
});

export default memo(Banner)