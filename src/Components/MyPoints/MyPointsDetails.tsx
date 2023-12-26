import React, { memo, useEffect, useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import theme, {
    Box,
    palette,
    Text,
    TouchableBox,
} from '../Theme/Index';
import { Button, Header } from '../ReusableComponents/index';
import FastImage from 'react-native-fast-image';
import { wp } from '../Helpers/responsive-ratio';
import { useDispatch, useSelector } from 'react-redux';
import { Images } from '../../Constant/Image';
import {
    Tabs,
    CollapsibleRef,
    MaterialTabBar,
    CollapsibleProps,
    TabItemProps,
} from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const MyPointsDetails = ({ navigation, route }) => {
    const {
        user
    } = useSelector(state => state?.auth?.user);
    const [imageIndex, setImageindex] = useState(0);
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const data = useMemo(
        () => [
            {
                id: 1,
                source: Images?.VenueImage,
                popup: false
            }
        ],
        [],
    );



    return (
        <Box flex={1}
        >
            <Header
                backSpace={true}
                left={true}
                title={`Your points: ${user?.data?.total_loyalty_points}`}
                RenderRightComponent={() => {
                    return (
                        <TouchableBox onPress={() => {
                            navigation.navigate("NoPointsModal")
                        }}>
                            <FastImage
                                source={Images?.LikeHeart}
                                style={styles.heart}
                            />
                        </TouchableBox>
                    )
                }}
            />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                style={{
                    flex: 1,
                }}
            >
                <Carousel
                    panGestureHandlerProps={{
                        activeOffsetX: [-20, 20],
                    }}
                    loop
                    style={{ marginHorizontal: 20 }}
                    pagingEnabled={true}
                    width={wp(90)}
                    height={wp(55)}
                    autoPlay={true}
                    data={data}
                    scrollAnimationDuration={1000}
                    onSnapToItem={index => {
                        setImageindex(index);
                    }}
                    renderItem={({ item, index }) => {
                        const { source, popup } = item;
                        return (
                            <FastImage
                                source={source}
                                style={{
                                    height: wp(55),
                                    width: wp(90),
                                }}
                                resizeMode={FastImage?.resizeMode?.stretch}
                            />
                        );
                    }}
                />
                <Box
                    flex={1}
                    mt="m"
                    ml="l"
                >
                    <Text variant="blackshade18800Medium">Eagle Club Volleyball Training Pass</Text>
                    <Box mt="s" flexDirection="row" alignItems='center'>
                        <FastImage
                            source={Images?.Points}
                            style={{

                                height: wp(5),
                                width: wp(5),
                            }}
                            resizeMode={FastImage?.resizeMode?.stretch}
                        />
                        <Text ml="s" variant="primary16500Medium">500 points</Text>
                    </Box>
                </Box>
                <Box mt="l"
                    marginHorizontal="l"
                    flexDirection="row" alignItems='center'>
                    <FastImage
                        source={Images?.ProductDetails}
                        style={{

                            height: wp(5),
                            width: wp(5),
                        }}
                        resizeMode={FastImage?.resizeMode?.stretch}
                    />
                    <Text ml="s" variant="blackshade16800">Product Details</Text>
                </Box>
                <Box height={1}
                    mt="m"
                    backgroundColor="tertiary2"
                    marginHorizontal="l"
                />
                <Box mt="m" marginHorizontal="l">
                    <Text variant="blackshade16800Regular">
                        The Eagle Club Volleyball Training Pass is a special voucher offered by our app that entitles the holder to one training session with the Eagle Club Volleyball team. This training session is designed to provide players with a high level of instruction and skill development from experienced coaches and players.
                    </Text>
                </Box>
                <Box mt="l"
                    marginHorizontal="l"
                    flexDirection="row" alignItems='center'>
                    <FastImage
                        source={Images?.Terms}
                        style={{

                            height: wp(5),
                            width: wp(5),
                        }}
                        resizeMode={FastImage?.resizeMode?.stretch}
                    />
                    <Text ml="s" variant="blackshade16800">Terms & Conditions</Text>
                </Box>
                <Box height={1}
                    mt="m"
                    backgroundColor="tertiary2"
                    marginHorizontal="l"
                />
                <Box mt="m" marginHorizontal="l">
                    <Text variant="blackshade16800Regular">
                        1. This voucher is valid only for one training session with the Eagle Club Volleyball team.
                    </Text>
                    <Text variant="blackshade16800Regular">
                        2. The voucher cannot be redeemed for cash or any other form of compensation.
                    </Text>
                    <Text variant="blackshade16800Regular">
                        3. The voucher is non-transferable and cannot be shared or resold.
                    </Text>
                    <Text variant="blackshade16800Regular">
                        4. The voucher must be presented at the time of the training session.
                    </Text>
                    <Text variant="blackshade16800Regular">
                        5. The voucher is valid only for a limited time and must be redeemed before the expiration date.
                    </Text>
                </Box>
                <Box mt="l"
                    marginHorizontal="l"
                    flexDirection="row" alignItems='center'>
                    <FastImage
                        source={Images?.FAQ}
                        style={{

                            height: wp(5),
                            width: wp(5),
                        }}
                        resizeMode={FastImage?.resizeMode?.stretch}
                    />
                    <Text ml="s" variant="blackshade16800">FAQ</Text>
                </Box>
                <Box height={1}
                    mt="m"
                    backgroundColor="tertiary2"
                    marginHorizontal="l"
                />
                <Box mt="m" marginHorizontal="l">
                    <Text variant="blackshade16800Semi">How to use this Pass</Text>
                    <Text variant="blackshade16800Regular">
                        1. To use your Eagle Club Volleyball Training Pass, first ensure that you have made an appointment with the Eagle Club Volleyball team for a training session.
                    </Text>
                    <Text variant="blackshade16800Regular">
                        2. On the day of your training session, arrive at the designated location at least 15 minutes before the scheduled start time.
                    </Text>
                    <Text variant="blackshade16800Regular">
                        3. Present your Eagle Club Volleyball Training Pass to the coach or staff member on duty to confirm your eligibility for the training session.
                    </Text>
                </Box>
                <Box height={100} />

            </ScrollView>
            <Box
                paddingHorizontal="l"
                paddingBottom="l"
                paddingTop="m"
                backgroundColor="white" position="absolute"
                left={0}
                right={0}
                bottom={0}
            >

                <Button
                    onPress={() => {

                    }}
                    label={'Login'}
                    buttonStyle={{
                        height: wp(10),
                    }}
                />

            </Box>

        </Box>
    );
};

const styles = StyleSheet.create({
    heart: {
        height: wp(10),
        width: wp(10)
    },
    points: {
        height: wp(5),
        width: wp(5)
    },
    dashed: {
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: palette?.primary,
    },
    boxx: {
        height: wp(24),
        width: wp(24)
    },
    content: { flexGrow: 1 },
    headerImage: {
        height: wp(51),
        width: wp(100),
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 1,
    }
});

export default MyPointsDetails;

