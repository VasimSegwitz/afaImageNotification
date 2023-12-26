/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useReducer, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {BookingConstants} from '../../../Redux';
import AuthConstants from '../../../Redux/AuthConstants';
import {getSports} from '../../../utils';
import {wp} from '../../Helpers/responsive-ratio';
import {Header} from '../../ReusableComponents';
import Button from '../../ReusableComponents/Button';
import SearchBar from '../../ReusableComponents/SearchBar';
import {getCategory, getSportComplex} from '../../Services/SportComplex';
import {Box, fonts, palette, Text, TouchableBox} from '../../Theme/Index';
import {styles} from './styles';

export default props => {
  const {navigation, route} = props;
  const is_booking = route?.params?.from == 'booking';
  const is_greeting = route?.params?.from == 'greeting';
  const {category} = useSelector(state => state?.book?.booking);
  const [mainCat, setMaincat] = useState(category);

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      search: '',
    },
  );

  const sportList = getSports();

  const dispatch = useDispatch();

  const [sport, setSport] = useState(sportList);

  const body = {without_subcategory: is_booking || is_greeting ? 1 : 0};
  const CategoryList = useQuery(['getCategory', body], getCategory, {
    onSuccess: result => {
      const d = result?.data.map(item => {
        return {
          ...item,
          flag: false,
        };
      });
      setMaincat(d);
      dispatch({
        type: BookingConstants?.CATEGORY,
        category: d,
      });

      // setCateList(result?.data?.data);
    },
    onError: error => {},
  });

  useEffect(() => {
    CategoryList?.refetch();
  }, []);

  /**
   * @function onChange
   * @description this function is for char changes and set to state
   */

  const onChange = e => {
    setState({search: e});
    let filteredData = category.filter(function (item) {
      return item.name.toUpperCase().includes(e.toUpperCase());
    });

    if (e.length < 1) {
      setMaincat(category);
    } else {
      setMaincat(filteredData);
    }
  };

  /**
   * @function onSubmit
   * @description this function for setting the sports values
   */

  const onSubmit = () => {
    if (route?.params?.from && route?.params?.from == 'booking')
      dispatch({
        type: AuthConstants?.ANOTHERSPORT,
        anothersport: mainCat.filter(it => it?.flag == true && it),
      });
    else if (route?.params?.selectSport)
      route?.params?.selectSport(mainCat.filter(it => it?.flag == true && it));
    else
      dispatch({
        type: AuthConstants?.USERSPORT,
        sport: mainCat.filter(it => it?.flag == true && it),
      });
    navigation?.goBack();
  };

  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      style={{
        backgroundColor: palette.white,
        paddingBottom: route?.params?.space?.bottom,
      }}>
      <Header title={'Select Your Sport'} left />
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          marginBottom: wp(11) + 20,
          paddingBottom: wp(11) + 20,
        }}
        style={{
          flex: 1,
        }}
        keyboardShouldPersistTaps="handled">
        <Box
          // style={{ marginTop: 50 }}
          onStartShouldSetResponder={Keyboard.dismiss}>
          <Box alignItems={'center'} justifyContent="center" width={wp(100)}>
            <SearchBar
              placeholder={'Search a sport name'}
              onChange={onChange}
              inputStyle={styles.inputStyle}
            />
          </Box>

          <ScrollView
            top={wp(5)}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingBottom: 10,
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            {mainCat.map(item => {
              if (!item?.parent_id)
                return (
                  <TouchableBox
                    onPress={() => {
                      const d = mainCat.map(it => {
                        if (item === it) {
                          return {
                            ...it,
                            flag: !it?.flag,
                          };
                        } else {
                          return {
                            ...it,
                            flag:
                              route?.params?.from == 'booking'
                                ? false
                                : it.flag,
                          };
                        }
                      });
                      setMaincat(d);
                    }}>
                    <Box
                      paddingVertical="m"
                      height={wp(22)}
                      width={wp(28)}
                      // m="sm"
                      justifyContent={'space-between'}
                      alignItems="center"
                      borderRadius={15}
                      backgroundColor="white">
                      <FastImage
                        source={
                          item?.images?.length > 0
                            ? {uri: item?.images[0]}
                            : Images?.SportIcon
                        }
                        resizeMode="contain"
                        style={{height: wp(7), width: wp(7)}}
                      />
                      {item?.flag && (
                        <FastImage
                          source={Images?.Tick}
                          resizeMode="contain"
                          style={{
                            height: wp(5),
                            width: wp(5),
                            position: 'absolute',
                            right: 5,
                          }}
                        />
                      )}
                      <Text variant="blackshade14400">{item?.name}</Text>
                    </Box>
                  </TouchableBox>
                );
            })}
          </ScrollView>
        </Box>
      </ScrollView>
      {mainCat.some(it => it?.flag == true) && (
        <Box
          width={wp(100) - 30}
          position={'absolute'}
          bottom={wp(1)}
          flexDirection="row"
          justifyContent={'space-between'}
          alignItems="center"
          alignSelf="center">
          <Button
            onPress={() => onSubmit()}
            label={'Done'}
            buttonStyle={{
              height: wp(11),
              width: (wp(100) - 40) / 2,
              marginBottom: 10,
            }}
          />
          <Button
            onPress={() => navigation?.goBack()}
            label={'Clear'}
            buttonColor="white"
            textStyle={{
              color: 'black',
              fontSize: 16,
              fontFamily: fonts.medium,
              fontWeight: '500',
            }}
            buttonStyle={{
              height: wp(11),
              width: (wp(100) - 40) / 2,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: palette?.primary,
            }}
          />
        </Box>
      )}
      {/* </KeyboardAvoidingView> */}
    </Box>
  );
};
