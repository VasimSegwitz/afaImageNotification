import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  SectionList,
  FlatList,
  Image,
} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
  fonts,
} from '../../../Theme/Index';
import {Button} from '../../../ReusableComponents/index';
import {Input} from '../../../ReusableComponents/Input/index';
import FastImage from 'react-native-fast-image';
import RadioButton from '../../../ReusableComponents/RadioButton';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import ActionSheet from '../../../ReusableComponents/ActionSheet';
import {useDispatch, useSelector} from 'react-redux';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import {useMutation} from 'react-query';
import {createActivity} from '../../../Services/Booking';
import BottomModal from '../../../ReusableComponents/Modals/BottomModal';
import {useNavigation} from '@react-navigation/native';
const Info = require('../../../../assets/Booking/CreateActivity/info/info.png');
const Price = require('../../../../assets/Booking/CreateActivity/Price/Price.png');
const BelowArrow = require('../../../../assets/Booking/SearchResults/BelowArrow/BelowArrow.png');
const Plus = require('../../../../assets/Booking/CreateActivity/Plus/Plus.png');
import ActivityConstants from '../../../../Redux/Activity/ActivityConstants';
const statusData = [
  {
    id: 1,
    selected: false,
    name: 'Pay by Wallet',
    showInfo: true,
    source: Info,
  },
  {
    id: 2,
    selected: false,
    name: 'Cash',
    showInfo: false,
    source: null,
  },
  {
    id: 3,
    selected: false,
    name: 'Free',
    showInfo: false,
    source: null,
  },
];

const ageSelection = [
  {
    label: 'Adult (19-39 years old)',
    value: 19,
  },
  {
    label: 'Youth (13-18 years old)',
    value: 18,
  },
  {
    label: 'Kids (below 12 years old)',
    value: 12,
  },
  {
    label: 'Veteran (above 40 years old)',
    value: 40,
  },
];

const genderSelection = [
  {
    label: 'Male',
    value: 1,
  },
  {
    label: 'Female',
    value: 2,
  },
];

const Payment = ({route}) => {
  const activityBody = useSelector(state => state?.activity?.activity?.body);
  const navigation = useNavigation();
  const [payment, setPayment] = useState(statusData);
  const [fairPrice, setfairPrice] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const [fairPricing, setFairPricing] = useState('');
  const [price, setPrice] = useState(false);
  const [DiffPricing, setDiffPricing] = useState([]);

  /**
   * @function onAddList
   * @description this function check previous added value is set or not and then add new list
   */

  const onAddList = () => {
    const arr = [...DiffPricing];
    if (
      arr[arr?.length - 1]?.gender == '' ||
      arr[arr?.length - 1]?.age == '' ||
      arr[arr?.length - 1]?.price == ''
    ) {
      displayErrorToast('add the proper details then you can add new');
      return;
    }
    setDiffPricing([
      ...arr,
      {
        gender: '',
        age: '',

        price: '',
        opengender: false,
        openage: false,
        openprice: false,
      },
    ]);
  };

  /**
   * @function onChangeGender
   * @param e
   * @param index
   * @description this function set the gender
   */

  const onChangeGender = (e, index) => {
    const arr = [...DiffPricing];

    arr[index].gender = e;
    setDiffPricing(arr);
  };

  /**
   * @function oncloseGender
   * @param index
   * @description this function will toggle the gender modal
   */

  const oncloseGender = (e, index) => {
    const arr = [...DiffPricing];
    arr[index].opengender = !arr[index].opengender;
    setDiffPricing(arr);
  };

  /**
   * @function oncloseAge
   * @param index
   * @description this function will toggle the age modal
   */

  const oncloseAge = (e, index) => {
    const arr = [...DiffPricing];
    arr[index].openage = !arr[index].openage;
    setDiffPricing(arr);
  };

  /**
   * @function onChangeAge
   * @param e
   * @param index
   * @description this function set the age
   */

  const onChangeAge = (e, index) => {
    const arr = [...DiffPricing];

    arr[index].age = e;
    setDiffPricing(arr);
  };

  /**
   * @function onChangePrice
   * @param e
   * @param index
   * @description this function set the price
   */

  const onChangePrice = (e, index) => {
    const arr = [...DiffPricing];

    arr[index].price = e;
    setDiffPricing(arr);
  };

  /**
   * @function creatingActivity
   * @description this function will call the createActivity api
   */

  const creatingActivity = useMutation('createActivity', createActivity, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        if (data?.data?.data) {
          const key = Object.keys(data?.data?.data)[0];
          displayErrorToast(data?.data?.data[key]);
        } else {
          displayErrorToast(data?.data?.message);
        }
      } else {
        dispatch({
          type: ActivityConstants?.CREATEACTIVITYBODY,
          body: [],
        });
        displaySuccessToast('Activity created');
        navigation.navigate('Tabs', {screen: 'Home', initial: false});
      }
    },
  });

  /**
   * @function onSubmit
   * @description will validate the data and call the api
   */

  const onSubmit = () => {
    if (!payment?.some(item => item?.selected)) {
      displayErrorToast('kindly select the payment option');
      return;
    }

    if (
      fairPricing == '' &&
      (DiffPricing[0]?.gender == '' ||
        DiffPricing[0]?.age == '' ||
        DiffPricing[0]?.price == '')
    ) {
      displayErrorToast('kindly provide the price');
      return;
    }

    const body = {
      ...activityBody,

      payment_type: payment?.find(item => item?.selected)?.id,
      fair_price: fairPricing || '',
      different_pricing:
        DiffPricing?.length > 0
          ? DiffPricing.map(item => {
              return {
                gender: item?.gender?.value || 1,
                age: item?.age?.value || 1,
                price: item?.price || 0,
              };
            })
          : [],
    };

    creatingActivity?.mutate(body);
  };

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView contentContainerStyle={styles.content}>
        <Box flex={1}>
          <Box marginHorizontal="l">
            <Text variant="blackshade16800Semi" marginVertical="m">
              Payment
            </Text>
            <FlatList
              data={payment}
              renderItem={({item}) => {
                const {selected, name, source} = item;
                return (
                  <Box flexDirection="row" mb="m" alignItems="center">
                    <RadioButton
                      text={name}
                      selected={selected}
                      radio
                      onPress={() => {
                        const temp = payment?.map(it => {
                          if (item?.name == it?.name)
                            return {...it, selected: !it?.selected};
                          else return {...it, selected: false};
                        });
                        setPayment(temp);
                      }}
                      textStyle={{
                        fontFamily: fonts?.regular,
                        fontWeight: '400',
                        fontSize: 16,
                        lineHeight: 22,
                        color: palette?.blackshade,
                      }}
                    />
                    <TouchableBox onPress={() => setOpen(!open)}>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={source}
                        style={{marginLeft: 10, height: 18, width: 18}}
                      />
                    </TouchableBox>
                  </Box>
                );
              }}
            />
          </Box>
          {payment?.find(item => item?.selected)?.id != 3 && (
            <Box marginHorizontal="l">
              <Text variant="blackshade16800Semi" marginVertical="m">
                Price per Person
              </Text>
              {/* <Box flexDirection="row"> */}
              <TouchableBox
                onPress={() => {
                  setPrice(false);

                  setfairPrice(!fairPrice);
                }}>
                <Box flexDirection="row" mb="m">
                  <Image
                    source={
                      fairPrice ? Images?.RadioCheck : Images?.RadioUnCheck
                    }
                    style={{
                      height: wp(6),
                      width: wp(6),
                    }}
                  />
                  <Box flexDirection="row" alignItems="center" ml="m">
                    <FastImage
                      resizeMode={FastImage?.resizeMode?.contain}
                      source={Price}
                      style={{height: 18, width: 18}}
                    />
                    <Text ml="m" variant="blackshade16800Regular">
                      Fair price
                    </Text>
                  </Box>
                </Box>
              </TouchableBox>
              {fairPrice && (
                <Box ml="l">
                  <Box ml="m">
                    <Text variant="blackshade114800Regular" mt="s">
                      The money will be transferred to your AFA Wallet
                      immediately after the Activity ends.
                    </Text>
                  </Box>

                  <Box mt="l" ml="m" width={'90%'}>
                    <Input
                      placeholder="Price per Player"
                      onChange={e => setFairPricing(e)}
                      value={fairPricing}
                    />
                  </Box>
                </Box>
              )}
              <Box>
                <TouchableBox
                  onPress={() => {
                    setPrice(!price);
                    setfairPrice(false);
                  }}>
                  <Box flexDirection="row" mt="m">
                    <Image
                      source={price ? Images?.RadioCheck : Images?.RadioUnCheck}
                      style={{
                        height: wp(6),
                        width: wp(6),
                      }}
                    />
                    <Box flexDirection="row" alignItems="center" ml="m">
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Price}
                        style={{height: 18, width: 18}}
                      />
                      <Text ml="m" variant="blackshade16800Regular">
                        Different pricing
                      </Text>
                    </Box>
                  </Box>
                </TouchableBox>
                {price && (
                  <Box flexDirection="row" mb="m" ml="m">
                    <Box ml="m">
                      <Box ml="m">
                        <Text variant="blackshade114800Regular" mt="s">
                          You can set different pricings for different groups of
                          Player.
                        </Text>
                      </Box>
                      {DiffPricing?.map((item, index) => {
                        const {
                          gender,
                          age,
                          price,
                          opengender,
                          openage,
                          openprice,
                        } = item;

                        return (
                          <Box mt="m" flexDirection="row">
                            <TouchableBox
                              // width={size.width / 3}
                              justifyContent="space-between"
                              alignItems="center"
                              flexDirection="row"
                              borderRadius={8}
                              height={wp(12)}
                              borderColor="placeholder"
                              p="s"
                              // borderWidth={1}
                              style={{
                                shadowOffset: {
                                  width: 1,
                                  height: 0.5,
                                },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,

                                elevation: 4,
                                backgroundColor: 'white',
                              }}
                              onPress={() => {
                                oncloseGender(1, index);
                              }}>
                              <Box width={wp(18)}>
                                <Text
                                  ml="m"
                                  variant="placeholder14400"
                                  width={'80%'}>
                                  {!gender ? 'Gender' : gender?.label}
                                </Text>
                              </Box>
                              <FastImage
                                resizeMode={FastImage?.resizeMode?.contain}
                                source={BelowArrow}
                                style={{height: 18, width: 18, marginRight: 10}}
                              />
                            </TouchableBox>
                            <TouchableBox
                              marginHorizontal="m"
                              p="s"
                              // width={size.width / 5}
                              justifyContent="space-between"
                              alignItems="center"
                              flexDirection="row"
                              borderRadius={8}
                              height={wp(12)}
                              borderColor="placeholder"
                              // borderWidth={1}
                              style={{
                                shadowOffset: {
                                  width: 1,
                                  height: 0.5,
                                },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,

                                elevation: 4,
                                backgroundColor: 'white',
                              }}
                              onPress={() => {
                                oncloseAge(1, index);
                              }}>
                              <Box width={wp(20)}>
                                <Text
                                  marginHorizontal="m"
                                  variant="placeholder14400"
                                  width={20}>
                                  {!age ? 'Age' : age?.label?.split(' (')[0]}
                                </Text>
                              </Box>
                              <FastImage
                                resizeMode={FastImage?.resizeMode?.contain}
                                source={BelowArrow}
                                style={{height: 18, width: 18, marginRight: 10}}
                              />
                            </TouchableBox>

                            <Input
                              placeholder="price"
                              note={false}
                              otp={false}
                              onChange={e => onChangePrice(e, index)}
                              inputStyle={{
                                width: size.width / 5,
                                borderWidth: 1,
                                borderColor: palette?.placeholder,
                                // height: 20,
                              }}
                            />

                            <ActionSheet
                              visible={opengender}
                              onClose={() => oncloseGender(1, index)}
                              onFinal={() => oncloseGender(1, index)}
                              onItemPress={e => onChangeGender(e, index)}
                              items={genderSelection}
                              title={'Gender'}
                              selectedItem={gender}
                            />
                            <ActionSheet
                              visible={openage}
                              onClose={() => oncloseAge(1, index)}
                              onFinal={() => oncloseAge(1, index)}
                              onItemPress={e => onChangeAge(e, index)}
                              items={ageSelection}
                              title={'Age'}
                              selectedItem={age}
                            />
                          </Box>
                        );
                      })}
                      <TouchableBox onPress={() => onAddList()}>
                        <Box mt="m" flexDirection="row" alignItems="center">
                          <FastImage
                            resizeMode={FastImage?.resizeMode?.contain}
                            source={Plus}
                            style={{height: 40, width: 40}}
                          />
                          <Box>
                            <Text
                              variant="placeholder14400"
                              textDecorationLine="underline">
                              Add more
                            </Text>
                          </Box>
                        </Box>
                      </TouchableBox>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </ScrollView>
      <Box flex={1} justifyContent="flex-end" mb="l">
        <Box height={46} marginHorizontal="l" mt="l">
          <Box height={46}>
            <Button
              label="Continue"
              onPress={() => {
                onSubmit();
                //navigation.popToTop()
              }}
            />
          </Box>
        </Box>
      </Box>
      <BottomModal
        visible={open}
        title={`How I get paid \n from Players by AFA Pay?`}
        detail={`\nReceiving funds has never been easier with AFA Pay! Just activate your AFA Wallet to get started.\n\nMembers will be asked to pay the Activity fee via AFA Pay to confirm their participation. This way ‘no show’ Players will not stop the Activity from commencing! \n\nAll payments collected will be auto-credited to the Host’s AFA Wallet. \nIf there are disputes after the Activity, the Host's Wallet will be frozen and further investigated by AFA. \n\nIn the case that the dispute is solved and the Players were found to be right, credits will be deducted from the Host's AFA Wallet upon verification from AFA. \n`}
        buttonLabel={'OK'}
        left
        buttonColor={palette?.blackshade}
        onClose={() => setOpen(false)}
        onPress={() => setOpen(false)}
      />
    </Box>
  );
};
const styles = StyleSheet.create({
  content: {flexGrow: 1, paddingBottom: 50},
});

export default Payment;
