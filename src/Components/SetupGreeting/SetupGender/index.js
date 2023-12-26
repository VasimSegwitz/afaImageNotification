/* eslint-disable react-hooks/exhaustive-deps */
import React, {useReducer, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Header} from '../../ReusableComponents';
import Button from '../../ReusableComponents/Button';
import Options from '../../ReusableComponents/CheckoutProgress/Options';
import StepIndicator from '../../ReusableComponents/CheckoutProgress';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import Dropdown from '../../ReusableComponents/DropDown';
import {
  displayErrorToast,
  generateArrayOfDays,
  generateArrayOfMonths,
  generateArrayOfYears,
} from '../../../utils';
import moment, {months} from 'moment';

export default props => {
  const {navigation, route, onPress} = props;

  const date = generateArrayOfDays();
  const yearList = generateArrayOfYears();
  const Monthlist = generateArrayOfMonths();

  const [male, setMale] = useState(false);
  const [female, setFemale] = useState(true);
  const [other, setOther] = useState(false);

  const [selectDate, setSelectDate] = useState();
  const [selectMonth, setSelectMonth] = useState();
  const [selectYear, setSelectYear] = useState();

  const TabArray = [
    {
      name: 'Male',
      Method: setMale,
      value: male,
      image: Images?.Male,
      label: 1,
    },
    {
      name: 'Female',
      Method: setFemale,
      value: female,
      image: Images.Female,
      label: 2,
    },
    {
      name: 'Other',
      Method: setOther,
      value: other,
      image: Images?.OtherGender,
      label: 3,
    },
  ];

  const SelectTab = item => {
    TabArray.map(it => {
      if (item == it) item.Method(!item?.value);
      else it.Method(false);
    });
  };

  const onSubmit = () => {
    const dob = selectDate + '-' + selectMonth + '-' + selectYear;

    const d = new Date(selectYear, selectMonth, selectDate, 0);

    if (
      selectMonth == undefined ||
      selectYear == undefined ||
      selectDate == undefined
    ) {
      displayErrorToast('Select valid date of birth');
      return;
    }

    if (!moment(dob?.toString(), 'DD-MM-YYYY').isValid()) {
      displayErrorToast('Select valid date of birth');
      return;
    }

    const gender = TabArray.find(item => item?.value)?.label;

    const body = {
      dob,
      gender,
    };
    onPress(body);
  };

  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      style={{
        backgroundColor: palette.white,

        paddingBottom: route?.params?.space?.bottom,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={{
            flex: 1,
          }}
          keyboardShouldPersistTaps="handled">
          <Box flex={1} p="t" onStartShouldSetResponder={Keyboard.dismiss}>
            <Box alignItems={'center'} justifyContent="center">
              <FastImage
                source={Images.Gender}
                resizeMode="contain"
                style={{height: wp(8), width: wp(8), marginBottom: 10}}
              />
              <Text variant={'blackshade24500'}>Select your gender</Text>
              <Text variant={'blackshade14400'} textAlign="center" mt="s">
                This helps to filter the suitable activities according to your
                gender
              </Text>
            </Box>
            <Box
              flexDirection={'row'}
              justifyContent="space-around"
              width={wp(100) - 40}
              mt="xl"
              alignItems={'center'}>
              {TabArray.map((item, index) => {
                return (
                  <TouchableBox onPress={() => SelectTab(item)}>
                    <Box
                      p="m"
                      height={wp(22)}
                      width={wp(23)}
                      justifyContent={'space-between'}
                      alignItems="center"
                      borderRadius={15}
                      // borderColor={"primary"}
                      style={{
                        borderColor: item?.value
                          ? palette?.primary
                          : palette?.tertiary,
                      }}
                      borderWidth={1}>
                      <FastImage
                        source={item?.image}
                        resizeMode="contain"
                        style={{height: wp(7), width: wp(7)}}
                      />
                      <Text variant="blackshade16400">{item?.name}</Text>
                    </Box>
                  </TouchableBox>
                );
              })}
            </Box>
            <Box alignItems={'center'} justifyContent="center" mt="xl">
              <FastImage
                source={Images.Birthday}
                resizeMode="contain"
                style={{height: wp(8), width: wp(8), marginBottom: 10}}
              />
              <Text variant={'blackshade24500'}>Your birthday</Text>
              <Text variant={'blackshade14400'} textAlign="center" mt="s">
                This helps to filter the suitable activities according to your
                age.
              </Text>
            </Box>
            <Box flexDirection={'row'} justifyContent="space-around" mt="xl">
              <Box width={wp(25)}>
                <Dropdown
                  data={date}
                  title={'Date'}
                  onSelect={data => setSelectDate(data?.value)}
                />
              </Box>
              <Box width={wp(35)}>
                <Dropdown
                  data={Monthlist}
                  title={'Month'}
                  onSelect={data => setSelectMonth(data?.value)}
                />
              </Box>
              <Box width={wp(25)}>
                <Dropdown
                  data={yearList}
                  title={'Year'}
                  onSelect={data => setSelectYear(data?.value)}
                />
              </Box>
            </Box>
            <Box
              width={wp(100) - 30}
              position={'absolute'}
              bottom={wp(1)}
              alignSelf="center">
              <Button
                onPress={() => onSubmit()}
                label={'Confirm'}
                buttonStyle={{
                  height: wp(10),
                  marginBottom: 10,
                }}
              />
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};
