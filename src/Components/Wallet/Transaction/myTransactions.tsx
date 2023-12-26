import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {wp} from '../../Helpers/responsive-ratio';
import {Header, Shimmer} from '../../ReusableComponents/index';
import {dateTimeFormatter} from '../../ReusableComponents/DateTimeFormatter/datetimeformatter';
import {feather} from '../../ReusableComponents/Icons';
import {getWalletTransactions} from '../../Services/WalletApi';
import {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import moment from 'moment';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

const MyTransactions = () => {
  const isFocused = useIsFocused();
  const initialState = {transaction_data: [], new_transaction_data: []};
  const [state, setState] = useState(initialState);
  const [pagecount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const body = {per_page: 5, page: pagecount};
  const getTransactionsQuery = useQuery(
    ['getTransactions', body],
    getWalletTransactions,
    {
      onSuccess: result => {
        setState({
          ...state,
          transaction_data:
            state.transaction_data
              .concat(result?.data?.data)
              .sort((a, b) => b.updated_at.localeCompare(a.updated_at)) || [],
          new_transaction_data: result?.data?.data || [],
        });
        setLoading(false);
      },
      onError: error => {},
    },
  );

  useEffect(() => {
    setPageCount(1);
    setState({...state, transaction_data: [], new_transaction_data: []});
    getTransactionsQuery.refetch();
  }, [isFocused]);

  const renderItem = items => {
    const {updated_at, amount, booking, type, start, user_activity, action} =
      items.item;

    return (
      <TouchableBox>
        <Box
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          style={{marginHorizontal: wp(4), marginTop: wp(4)}}>
          <Box>
            <Text variant="blackshade14400" style={{width: wp(60)}}>
              {type == 1 && 'Refund from '}
              {type == 4 && 'Joined '}
              {/* {user_activity ? 'Activity' + ' #' + user_activity?.id : ''} */}
              {booking
                ? `${booking?.sports_facility?.sports_complex?.name} -`
                : user_activity
                ? user_activity?.setting?.name
                : 'Top up'}{' '}
              {booking ? `${booking?.sports_facility?.name} - ` : ''}{' '}
              {booking
                ? `${booking?.date}, ${moment(
                    booking?.start,
                    'HH:mm:ss',
                  ).format('LT')}`
                : ''}
            </Text>
            <Text variant={'placeholder12400'} mt={'s'}>
              {dateTimeFormatter(updated_at)}
            </Text>
          </Box>
          <Box flexDirection={'row'} alignItems={'center'}>
            <Text variant="blackshade16400" mr={'s'}>
              {type == 4 && '- '}RM {amount.toFixed(2)}
            </Text>
            {feather('chevron-right', wp(4), palette.placeholder)}
          </Box>
        </Box>
        <Box
          marginHorizontal="m"
          height={wp(0.3)}
          mt="s"
          backgroundColor="tertiary2"
          mr={'l'}
        />
      </TouchableBox>
    );
  };

  const handleOnEndReached = () =>
    state.new_transaction_data.length >= 5 && setPageCount(pagecount + 1);

  return (
    <Box flex={1} backgroundColor={'white'}>
      <Header left title={'My Transaction'} />

      <Box flex={1}>
        <FlatList
          data={state.transaction_data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={handleOnEndReached}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <Box mt="l" justifyContent="center">
                {state.transaction_data.length === 0 && !loading ? (
                  <Box>
                    <Text
                      mt="l"
                      textAlign={'center'}
                      variant="blackshade116500">
                      No Activities On This Day
                    </Text>
                  </Box>
                ) : (
                  <Box flex={1}>
                    <ScrollView
                      contentContainerStyle={{flexGrow: 1}}
                      showsVerticalScrollIndicator={false}>
                      {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, , 0].map(
                        (item, index) => {
                          return (
                            <Animated.View
                              entering={FadeIn.delay(100 * index)}
                              exiting={FadeOut.delay(150 * index)}>
                              <Box
                                mt="m"
                                mb="m"
                                key={index.toString()}
                                borderRadius={12}
                                backgroundColor="white"
                                overflow="hidden"
                                style={TypographyStyles.cardShadow}>
                                <Box ml="m" flexDirection="row">
                                  <Box>
                                    <Shimmer
                                      height={20}
                                      width={size.width / 1.2}
                                      borderRadius={5}
                                    />
                                    <Shimmer
                                      style={{marginTop: 10}}
                                      height={20}
                                      width={size.width / 1.5}
                                      borderRadius={5}
                                    />
                                    <Shimmer
                                      style={{marginTop: 10}}
                                      height={2}
                                      width={size.width / 1.2}
                                      borderRadius={5}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </Animated.View>
                          );
                        },
                      )}
                    </ScrollView>
                  </Box>
                )}
              </Box>
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default MyTransactions;
