import React, {useState, useEffect, useReducer, useCallback} from 'react';
import {ScrollView, StyleSheet, FlatList, Modal} from 'react-native';
import theme, {
  Box,
  fonts,
  palette,
  size,
  Text,
  TouchableBox,
} from '../../Theme/Index';
import {Header, Button} from '../../ReusableComponents/index';
import FastImage from 'react-native-fast-image';
import RadioButton from '../../ReusableComponents/RadioButton';
import {useMutation, useQuery} from 'react-query';
import {displayErrorToast, displaySuccessToast, ios} from '../../../utils';
import {getWalletBalance} from '../../Services/WalletApi';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {currencyCode} from '../../Helpers/Enums';

import {wp} from '../../Helpers/responsive-ratio';
import {AuthConstants, BookingConstants} from '../../../Redux';
import {useDispatch, useSelector} from 'react-redux';
import {
  getInsuranceDetails,
  saveInsuranceDetails,
} from '../../Services/Booking';
import {Images} from '../../../Constant/Image';
import {Input} from '../../ReusableComponents/Input';
import Animated, {
  BounceIn,
  BounceInDown,
  BounceInUp,
  BounceOutUp,
  Easing,
  FadeIn,
  FadeInUp,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import DatePicker from 'react-native-date-picker';
import moment, {invalid} from 'moment';
import {LockSlot} from '../../Services/Booking';
const buttonHeight = wp(45);
const showHeight = wp(250);

const Insurance = ({navigation, route, value, onChangeText}) => {
  const userData = useSelector(state => state?.auth?.user?.user?.data);

  const {params} = route;
  const progress = useSharedValue(0);
  const {apiBody, booking, mode, vanue, is_deposit} = params;

  const subtractYears = (date, years) => {
    const dateCopy = new Date(date);
    dateCopy.setFullYear(date.getFullYear() - years);
    return dateCopy;
  };

  const [radio, setRadio] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);
  const [givenInfo, setGivenInfo] = useState(false);
  const [showDob, setShowDob] = useState(false);
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportId, setPassportId] = useState('');
  const [phone, setPhone] = useState('');
  const [chosenDate, setChosenDate] = useState(new Date());
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [code, setCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const [passportIdError, setPassportIdError] = useState('');
  const [nationalityError, setNationalityError] = useState('');
  const [nameError, setNameError] = useState('');

  const newDate = subtractYears(new Date(), 12);

  useEffect(() => {
    getInsurance();
  }, []);

  const getInsurance = () => {
    getInsuranceDetails()
      .then(response => {
        const {success, data} = response;
        if (success === 1) {
          setName(data?.full_name !== undefined ? data?.full_name : '');
          setNationality(
            data?.nationality !== undefined ? data?.nationality : 'Malaysia',
          );
          setPassportId(data?.passport !== undefined ? data?.passport : '');
          //setPhone(data?.)
          setChosenDate(
            data?.date_of_birth !== undefined
              ? new Date(data?.date_of_birth)
              : new Date(),
          );
          setDocumentNumber(
            data?.document_no !== undefined ? data?.document_no : '',
          );
        } else {
          let newData = moment().format('DD-MM-YYYY');
          setName('');
          setNationality('Malaysia');
          setPassportId('');
          //setPhone(data?.)
          setChosenDate(newData);
          setDocumentNumber('');
        }
      })
      .catch(error => {});
  };

  const generateDob = () => {
    const dob = moment(chosenDate).format('DD-MM-YYYY');
    const isValidDob = moment(chosenDate, 'DD-MM-YYYY', true).isValid();

    return isValidDob ? dob : null;
  };

  const saveInsurance = () => {
    // setPhone("")
    // setName("")
    // setNationality("")
    // setPassportId("")
    // setChosenDate(new Date())
    // setDocumentNumber("")

    saveInsuranceDetails({
      full_name: name,
      nationality: nationality,
      document_no: documentNumber,
      date_of_birth: generateDob(),
      passport: passportId,
      age_declaration: true,
    })
      .then(response => {
        const {success} = response;
        if (success === 1) {
          navigation.navigate('BookingSummary', {
            apiBody: apiBody,
            booking: booking,
            mode: mode,
            vanue: vanue,
            is_deposit: is_deposit,
            is_insured: true,
          });
        } else {
        }
      })
      .catch(error => {});
  };

  const onSubmit = () => {
    if (radio) {
      if (name.trim().length === 0) {
        setNameError('Enter Name');
        return;
      }

      if (nationality.trim().length === 0) {
        setNationalityError('Enter Nationality');
        return;
      }

      if (code !== 'MYS' && passportId.trim().length === 0) {
        setPassportIdError('Enter Passport Number');
        return;
      }

      if (documentNumber.trim().length === 0) {
        setPassportIdError('Enter Document Number');
        return;
      }

      if (!ageConsent) {
        displayErrorToast('Please declare your age.');
        return;
      }
      if (!givenInfo) {
        displayErrorToast('Please declare your info is correct.');
        return;
      }

      saveInsurance();
    } else {
      navigation.navigate('BookingSummary', {
        apiBody: apiBody,
        booking: booking,
        mode: mode,
        vanue: vanue,
        is_deposit: is_deposit,
        is_insured: false,
      });
    }
  };

  const handleDatePicker = e => {
    setChosenDate(new Date(e));
  };

  const SelectCountry = val => {
    setNationality(val.country);
    setCode(val.code);
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Header title="YAS ACTYVE Insurance" left />
      <ScrollView flex={1}>
        <Box mt="m" marginHorizontal="l">
          <Text variant="support414600">YOUR SAFETY IS OUR PRIORITY</Text>
          <Text variant="primary32500">
            We now offer sport insurance to all our users!
          </Text>
        </Box>
        <Box mt="l" marginHorizontal="l">
          <Box
            paddingHorizontal="m"
            paddingVertical="m"
            borderRadius={10}
            backgroundColor="white"
            style={{
              shadowColor: 'rgba(0,0,0,0.3)',
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 8,
            }}>
            <Box flexDirection="row">
              <FastImage
                style={styles.tickStyle}
                resizeMode={FastImage?.resizeMode?.contain}
                source={Images?.GreenTick}
              />
              <Text variant="blackshade114500" ml="m">
                Medical Expenses: cover up to RM2,000
              </Text>
            </Box>
            <Box flexDirection="row">
              <FastImage
                style={styles.tickStyle}
                resizeMode={FastImage?.resizeMode?.contain}
                source={Images?.GreenTick}
              />
              <Text variant="blackshade114500" ml="m">
                Personal Effects: cover up to RM2,000
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center">
              <FastImage
                style={styles.tickStyle}
                resizeMode={FastImage?.resizeMode?.contain}
                source={Images?.GreenTick}
              />
              <Box>
                <Text variant="blackshade114500" ml="m">
                  Accidental Death & Total/Partial Disability: cover up to RM
                  10,000
                </Text>
                <Box ml="m">
                  <Text variant="primary14500">and more</Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt="m">
            <RadioButton
              capital={'none'}
              text={'Enable YAS ACTYVE Insurance at just '}
              selected={radio}
              onPress={() => {
                setRadio(prev => !prev);
              }}
              subname={'RM2'}
              textStyle={{
                fontFamily: fonts?.regular,
                fontWeight: '900',
                fontSize: 16,
                lineHeight: 22,
                color: palette?.blackshade,
                marginLeft: 10,
              }}
              subnameStyle={{marginLeft: 10, color: palette?.primary}}
            />
          </Box>
          {radio ? (
            <Animated.View
              style={{flex: 1}}
              entering={FadeInUp}
              exiting={FadeOut}>
              <Box mt="m" style={{marginLeft: wp(10)}}>
                <Text variant="blackshade12500">
                  Insure your booking with YAS ACTYVE Insurance.{' '}
                </Text>
                <TouchableBox>
                  <Text variant="primary12500">Click here to know more</Text>
                </TouchableBox>
              </Box>
              <Box marginVertical="l" backgroundColor="tertiary2" height={1} />
              <Box
                backgroundColor="primary2"
                borderRadius={10}
                marginVertical="l">
                <Box flexDirection="row">
                  <Box ml="m" mt="m">
                    <FastImage
                      source={Images?.SmilyFace}
                      style={{height: wp(10), width: wp(10)}}
                    />
                  </Box>
                  <Box ml="m" mt="m" width={size.width / 1.4}>
                    <Text variant="blackshade16800Semi">
                      Just one step away to get protected!
                    </Text>
                    <Text mt="s" variant="support414600">
                      To get you covered, we kindly ask for some additional
                      information for insurance purposes.
                    </Text>
                    <Text mt="s" variant="support414600">
                      You'll only need to provide this information once, and it
                      will be auto-saved for future bookings
                    </Text>
                  </Box>
                </Box>
                <Box marginHorizontal="m" mt="s">
                  <Box marginVertical="s">
                    <Text variant="tertiary514900Medium">
                      Full name as written on your ID
                    </Text>
                  </Box>
                  <Input
                    //place="Enter your phone number"
                    value={name}
                    error={nameError}
                    onChange={e => setName(e)}
                  />
                </Box>
                <TouchableBox
                  onPress={() => {
                    navigation.navigate('SelectCountryModal', {
                      SelectCountry: SelectCountry,
                    });
                  }}>
                  <Box marginHorizontal="m" pointerEvents="none">
                    <Box marginVertical="s">
                      <Text variant="tertiary514900Medium">Nationality</Text>
                    </Box>
                    <Input
                      value={nationality}
                      error={nationalityError}
                      onChange={e => setNationality(e)}
                      rightArrow
                    />
                  </Box>
                </TouchableBox>
                <Box marginHorizontal="m">
                  <Box marginVertical="s">
                    <Text variant="tertiary514900Medium">
                      Malaysia ID / Passport number
                    </Text>
                  </Box>
                  <Input
                    //place="Enter your phone number"
                    value={passportId}
                    error={passportIdError}
                    onChange={e => setPassportId(e)}
                  />
                </Box>
                <Box marginHorizontal="m">
                  <Box marginVertical="s">
                    <Text variant="tertiary514900Medium">Document number</Text>
                  </Box>
                  <Input
                    //place="Enter your phone number"
                    value={documentNumber}
                    error={documentError}
                    onChange={e => setDocumentNumber(e)}
                  />
                </Box>
                <TouchableBox onPress={() => setShowDob(!showDob)}>
                  <Box marginHorizontal="m" pointerEvents="none">
                    <Box marginVertical="s">
                      <Text variant="tertiary514900Medium">Day of birth</Text>
                    </Box>
                    <Input
                      value={chosenDate.toLocaleDateString()}
                      error={dobError}
                    />
                  </Box>
                </TouchableBox>
                {showDob && (
                  <Box
                    borderRadius={15}
                    marginHorizontal="l"
                    backgroundColor="white"
                    flexDirection={'row'}
                    justifyContent="space-around">
                    <DatePicker
                      modal={ios}
                      mode="date"
                      maximumDate={newDate}
                      open={showDob}
                      date={chosenDate}
                      onDateChange={handleDatePicker}
                      onConfirm={date => {
                        setShowDob(!showDob);
                        setChosenDate(new Date(date));
                      }}
                      onCancel={() => {
                        setShowDob(!showDob);
                      }}
                    />
                  </Box>
                )}
                <Box marginHorizontal="m" pointerEvents="none">
                  <Box marginVertical="s">
                    <Text variant="tertiary514900Medium">Phone number</Text>
                  </Box>
                  <Input
                    value={userData.phone}
                    error={phoneError}
                    onChange={e => setPhone(e)}
                    contact
                    numberPad
                    maxLength={11}
                    // SetSignupCountryCode={SetSignupCountryCode}
                  />
                </Box>
              </Box>
              <Box mt="m">
                <RadioButton
                  text={
                    'I hereby declare that my is age above 16 and below 65 years '
                  }
                  selected={ageConsent}
                  onPress={() => {
                    setAgeConsent(prev => !prev);
                  }}
                  textStyle={{
                    fontFamily: fonts?.regular,
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 22,
                    color: palette?.blackshade,
                    marginLeft: 10,
                  }}
                />
              </Box>
              <Box mt="m">
                <RadioButton
                  text={
                    'I hereby declare that the above given info is true and correct to the best of my knowledge. '
                  }
                  selected={givenInfo}
                  onPress={() => {
                    setGivenInfo(prev => !prev);
                  }}
                  textStyle={{
                    fontFamily: fonts?.regular,
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 22,
                    color: palette?.blackshade,
                    marginLeft: 10,
                  }}
                />
              </Box>
            </Animated.View>
          ) : null}

          <Animated.View entering={BounceInDown} exiting={BounceOutUp}>
            <Box
              width={wp(100) - 30}
              // position={'absolute'}
              marginBottom="xl"
              marginTop="l"
              flex={1}
              justifyContent="flex-end"
              alignSelf="flex-end">
              <Button
                onPress={onSubmit}
                label={'Next'}
                buttonStyle={{
                  height: wp(10),
                }}
              />
            </Box>
          </Animated.View>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  tickStyle: {
    height: wp(5),
    width: wp(5),
  },
});

export default Insurance;
