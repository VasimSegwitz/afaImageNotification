import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Image, View} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {Input, Button, LoadingOverlay} from '../../ReusableComponents/index';
import {size} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {
  Tabs,
  CollapsibleRef,
  MaterialTabBar,
  CollapsibleProps,
  TabItemProps,
} from 'react-native-collapsible-tab-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import DealsItem from './DealsItem';
import VoucherItem from './SportsItem';
import {getAllDeals} from '../../Services/Booking';
import {displayErrorToast} from '../../../utils';
const HEADER_HEIGHT = 200;

const DATA = [
  {
    id: 1,
    name: 'Active',
    selected: false,
    number: 3,
  },
  {
    id: 2,
    name: 'Used',
    selected: false,
    number: 8,
  },
  {
    id: 3,
    name: 'expired',
    selected: false,
    number: 10,
  },
];

const Deals = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {category} = useSelector(state => state?.book?.booking);
  const inset = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(1);
  const [venuesList, setVenuesList] = useState([]);
  const [sports, setSports] = useState([]);

  const makeLabel = useCallback(
    <T extends TabName>(label: string) =>
      (props: TabItemProps<T>) =>
        (
          <TabItem
            index={props.index}
            indexDecimal={props.indexDecimal}
            label={label}
          />
        ),
    [],
  );

  type Props = {
    emptyContacts?: boolean;
  } & Partial<CollapsibleProps>;

  function TabItem<T extends TabName>({
    index,
    indexDecimal,
    label,
  }: Pick<TabItemProps<T>, 'index' | 'indexDecimal'> & {label: string}) {
    const textStyle = useAnimatedStyle(() => {
      return {
        color: interpolateColor(
          indexDecimal.value,
          [index - 1, index, index + 1],
          [palette?.blackshade1, palette?.blackshade, palette?.blackshade1],
        ),
      };
    });

    return (
      <View style={styles.tabItemContainer}>
        <Animated.Text style={textStyle}>{label}</Animated.Text>
      </View>
    );
  }

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getDeals = useQuery(
    [
      'getAllDeals',
      {
        per_page: 10,
        page: 1,
        type: type,
      },
    ],
    getAllDeals,
    {
      // enabled: false,
      onSuccess: data => {
        setLoading(false);
        if (data?.success == 1) {
          if (type == 1) {
            setVenuesList(data?.data?.data);
          } else {
            setSports(data?.data?.data);
          }

          // props?.navigation?.setParams({ vanue: data?.data });
        } else {
        }
      },
      onError: error => {
        setLoading(false);
        displayErrorToast(error?.data?.message);
      },
    },
  );

  useEffect(() => {
    setLoading(true);
    getDeals.refetch();
  }, [type]);

  return (
    <Box flex={1}>
      <Tabs.Container
        headerContainerStyle={{
          backgroundColor: palette?.secondary1,
          shadowColor: '#FFFF',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        }}
        tabBarHeight={100 + insets?.top}
        onIndexChange={index => {
          setType(index);
        }}
        renderTabBar={props => (
          <MaterialTabBar
            indicatorStyle={{
              backgroundColor: palette?.primary,
            }}
            style={{
              // borderTopLeftRadius: 30,
              //borderTopRightRadius: 30,
              backgroundColor: 'white',
              height: 50,
            }}
            {...props}
            scrollEnabled
          />
        )}
        headerHeight={HEADER_HEIGHT}
        renderHeader={() => {
          return (
            <Box
              flex={1}
              style={[
                {
                  width: '100%',
                  height: HEADER_HEIGHT,
                },
              ]}>
              <FastImage
                source={Images?.RedeemPointsImg}
                style={styles.headerImage}
                resizeMode={FastImage?.resizeMode?.stretch}
              />
              <Box zIndex={100} position="absolute" top={40} left={wp(1)}>
                <Box flexDirection="row" alignItems="center">
                  <TouchableBox
                    style={{
                      padding: 10,
                    }}
                    onPress={() => {
                      navigation.goBack(null);
                    }}>
                    <Image
                      source={Images?.LeftArrow}
                      style={{
                        tintColor: 'white',
                        height: 20,
                        width: 20,
                      }}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />
                  </TouchableBox>
                </Box>
              </Box>
              <Box position="absolute" right={0} left={20} bottom={30}>
                <Box flexDirection="row">
                  <Text variant="white36700">Deals</Text>
                </Box>
              </Box>
              <Box
                position="absolute"
                bottom={-1}
                right={0}
                left={0}
                height={20}
                borderTopRightRadius={20}
                borderTopLeftRadius={20}
                backgroundColor="white"></Box>
            </Box>
          );
        }}>
        <Tabs.Tab name="A" label={makeLabel('Venues')}>
          <Tabs.FlatList
            contentContainerStyle={{
              backgroundColor: '#FAFAFA',
              paddingBottom: 50,
            }}
            data={venuesList}
            renderItem={({item}) => {
              return (
                <DealsItem item={item} navigation={navigation} route={route} />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <Box flex={1} justifyContent="center" alignItems="center">
                  <Text>No Data</Text>
                </Box>
              );
            }}
            keyExtractor={(item, index) => index?.toString()}
          />
        </Tabs.Tab>
        <Tabs.Tab name="B" label={makeLabel('Sports Items')}>
          <Tabs.FlatList
            contentContainerStyle={{backgroundColor: 'white'}}
            data={[]}
            renderItem={({item}) => {
              return (
                <VoucherItem
                  item={item}
                  navigation={navigation}
                  route={route}
                />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <Box flex={1} justifyContent="center" alignItems="center">
                  <Text>No Data</Text>
                </Box>
              );
            }}
            keyExtractor={(item, index) => index?.toString()}
          />
        </Tabs.Tab>
      </Tabs.Container>
      {loading ? <LoadingOverlay /> : null}
    </Box>
  );
};

const styles = StyleSheet.create({
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
    height: wp(24),
    width: wp(24),
  },
  content: {flexGrow: 1},
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

export default Deals;
