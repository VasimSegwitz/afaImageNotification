import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {wp} from '../../Helpers/responsive-ratio';
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
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Shimmer} from '../../ReusableComponents';

const WalletOut = props => {
  const {setAmount} = props;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const initialState = {transaction_data: [], new_transaction_data: []};
  const [state, setState] = useState(initialState);
  const [pagecount, setPageCount] = useState(1);

  const body = {type: 4, action: 2, per_page: 5, page: pagecount};
  const getTransactionsQuery = useQuery(
    ['getTransactions', body],
    getWalletTransactions,
    {
      onSuccess: result => {
        setAmount(result?.data?.wallet?.balance);
        setState({
          ...state,
          transaction_data:
            state.transaction_data
              .concat(result?.data?.data)
              .sort((a, b) => b.updated_at.localeCompare(a.updated_at)) || [],
          new_transaction_data: result?.data?.data || [],
        });
      },
      onError: error => {},
    },
  );

  /**
   * @function useEffect
   * @description Reset all states to it's initial state and Invokes wallet transaction api initially.
   */

  useEffect(() => {
    setPageCount(1);
    setState({...state, transaction_data: [], new_transaction_data: []});
    getTransactionsQuery.refetch();
  }, [isFocused]);

  const renderItem = items => {
    const {updated_at, amount, booking, user_activity, type} = items.item;

    return (
      <TouchableBox>
        <Box
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          style={{marginHorizontal: wp(4), marginTop: wp(4)}}>
          <Box>
            <Text variant="blackshade14400" style={{width: wp(60)}}>
              {type == 4 && 'Joined '}{' '}
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
            <Text variant={'placeholder12400'} mt={'s'}>{`${dateTimeFormatter(
              updated_at,
            )} (completed)`}</Text>
          </Box>
          <Box flexDirection={'row'} alignItems={'center'}>
            <Text variant="blackshade16400" mr={'s'}>
              -RM {amount}
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
    <Box flex={1} backgroundColor="white">
      <Box flex={1}>
        <FlatList
          data={state.transaction_data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={handleOnEndReached}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <Box flex={1}>
                {state.transaction_data.length === 0 && !loading ? (
                  <Box
                    height={size?.height / 2}
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <Text variant="blackshade16500">No transaction made</Text>
                  </Box>
                ) : (
                  <Box flex={1} paddingHorizontal="m">
                    <ScrollView
                      contentContainerStyle={{flexGrow: 1}}
                      showsVerticalScrollIndicator={false}>
                      {[0, 0, 0, 0, 1, 1].map((item, index) => {
                        return (
                          <Animated.View
                            entering={FadeIn.delay(100 * index)}
                            exiting={FadeOut.delay(200 * index)}>
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
                                    height={15}
                                    width={size.width / 1.2}
                                    borderRadius={5}
                                  />
                                  <Shimmer
                                    style={{marginTop: 10}}
                                    height={15}
                                    width={size.width / 1.5}
                                    borderRadius={5}
                                  />
                                  <Shimmer
                                    style={{marginTop: 10}}
                                    height={15}
                                    width={size.width / 1.2}
                                    borderRadius={5}
                                  />
                                  <Shimmer
                                    style={{marginTop: 10}}
                                    height={15}
                                    width={size.width / 1.3}
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
                      })}
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

export default WalletOut;
