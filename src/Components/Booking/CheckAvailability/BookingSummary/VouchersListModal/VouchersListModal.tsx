import {
  getMyRewards,
  getMyVouchersList,
  getStatusOfVouchers,
} from '../../../../Services/RewardsApi';
import React, {useEffect, useState} from 'react';
import {
  TouchableBox,
  Box,
  Text,
  palette,
  size,
  fonts,
} from '../../../../Theme/Index';
import {Image, StyleSheet, RefreshControl, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../../Helpers/responsive-ratio';
import {Images} from '../../../../../Constant/Image';
import {Button} from '../../../../ReusableComponents';
import {Down, Ionicon} from '../../../../ReusableComponents/Icons';
import Animated, {
  BounceInDown,
  BounceOutDown,
  FadeInDown,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';

const VouchersListModal = ({route, navigation}) => {
  const {params} = route;
  const {applied} = params;
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    getMyVouchersInfo();
  }, []);

  const getMyVouchersInfo = () => {
    setLoading(true);
    getMyVouchersList(1)
      .then(response => {
        setLoading(false);
        if (response?.success == 1) {
          const {data} = response;
          setVouchers(data?.userRewardUsageRows);
        } else {
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };
  return (
    <Animated.View entering={SlideInDown} flex={1} style={styles.content}>
      <TouchableBox
        flex={0.1}
        justifyContent="center"
        alignItems="center"
        onPress={() => {
          navigation.goBack(null);
        }}
      />
      <Box
        flex={1}
        backgroundColor="white"
        borderTopRightRadius={30}
        borderTopLeftRadius={30}>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Box ml="l">
            <Text variant="blackshade20500">Vouchers</Text>
          </Box>
          <TouchableBox
            m="l"
            style={styles.closeIcon}
            onPress={() => {
              navigation.goBack(null);
            }}
            alignSelf="flex-end">
            {Ionicon('close', 20, palette?.black)}
          </TouchableBox>
        </Box>
        <Box marginHorizontal="l">
          <Text variant="blackshade16500">
            Choose from list of Vouchers below
          </Text>
        </Box>
        <Box flex={1}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={getMyVouchersInfo}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <Box flex={1} justifyContent="center" alignItems="center">
                  <Text>No Vouchers</Text>
                </Box>
              );
            }}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
            keyExtractor={(item, index) => index?.toString()}
            data={vouchers}
            renderItem={({item}) => {
              const {reward, code} = item;

              return (
                <TouchableBox
                  onPress={() => {
                    navigation.goBack(null);
                    applied(code);
                  }}
                  mt="m"
                  flexDirection="row"
                  marginHorizontal="m"
                  alignItems="center">
                  <Box
                    borderRadius={18}
                    justifyContent="center"
                    alignItems="center"
                    style={[styles.dashed, styles.cardShadow]}
                    height={wp(30)}
                    width={wp(27)}
                    backgroundColor="white">
                    <FastImage
                      style={styles.boxx}
                      resizeMode={FastImage?.resizeMode?.contain}
                      source={
                        reward?.images.length > 0
                          ? {uri: reward?.images[0]}
                          : Images?.RedeemBox
                      }
                    />
                  </Box>
                  <Box
                    flex={1}
                    borderRadius={18}
                    backgroundColor="white"
                    style={styles.cardShadow}
                    paddingLeft="m">
                    <Text pt="m" variant="blackshade16800">
                      {reward?.title}
                    </Text>
                    <Box flexDirection="row" alignItems="center">
                      <FastImage
                        source={Images?.Points}
                        style={styles.points}
                      />
                      <Text variant="primary16500Medium">
                        {reward?.cost} points
                      </Text>
                    </Box>
                    <Text mt="m" variant="blackshade114800Regular">
                      To book venue or join activity{' '}
                    </Text>
                    <Text variant="blackshade114800Regular">
                      Validity: {reward?.validity} days
                    </Text>

                    <Box
                      mb="m"
                      mt="s"
                      flexDirection="row"
                      alignItems="center"
                      mr="l"
                      justifyContent="space-between">
                      <Box width={size?.width / 3}>
                        <Text numberoflines={2}>{code}</Text>
                      </Box>

                      <Box
                        height={40}
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={8}
                        borderWidth={1}
                        width={size?.width / 4}
                        borderColor="primary">
                        <Text variant="blackshade14500">Apply</Text>
                      </Box>
                    </Box>
                  </Box>
                </TouchableBox>
              );
            }}
          />
        </Box>
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {backgroundColor: 'rgba(0,0,0,.7)'},
  closeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: palette.blackshade,
  },
  points: {
    height: wp(5),
    width: wp(5),
  },
  dashed: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: palette?.primary,
  },
  boxx: {
    height: wp(26),
    width: wp(22),
  },
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
  },
});

export default VouchersListModal;
