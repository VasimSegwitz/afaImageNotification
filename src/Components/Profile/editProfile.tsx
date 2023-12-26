import React, {useEffect, useState} from 'react';
import {ScrollView, TextInput, Keyboard} from 'react-native';
import {wp} from '../Helpers/responsive-ratio';
import {Button, Header, LoadingOverlay} from '../ReusableComponents';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../Theme/Index';
import styles from './styles';
import RadioButton from '../ReusableComponents/RadioButton';
import {Ionicon} from '../ReusableComponents/Icons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from 'react-query';
import {
  editProfile,
  uploadProfileImage,
  verifyEmailSendOTP,
} from '../Services/ProfileApi';
import {displayErrorToast, displaySuccessToast, ios} from '../../utils';
import {AuthConstants} from '../../Redux';
import ImageUpload from '../ReusableComponents/ImageUpload';
import moment from 'moment';
import {reSendOtp} from '../Services/AuthService';
import DatePicker from 'react-native-date-picker';

const EditProfile = props => {
  const {route} = props;
  const {is_email_changed} = route?.params;

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const nameRegex = /^[a-zA-Z ]+$/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const {
    first_name,
    last_name,
    date_of_birth,
    email,
    phone,
    phone_prefix,
    user_name,
    image,
    gender,
    label,
    favorite_sports,
  } = useSelector(state => state?.auth?.user?.user?.data);

  const {phone_verified_datetime} = useSelector(
    state => state?.auth?.user?.user?.data?.user_info,
  );

  const {location_lat, location_long} = useSelector(
    state => state?.auth?.user?.userlocation,
  );

  const favorite_sports_ids = favorite_sports?.map(data => data.category_id);

  const gender_list = [
    {id: 1, gender: 'Men'},
    {id: 2, gender: 'Women'},
    {id: 3, gender: 'Other'},
  ];

  const generateDob = () => {
    const dob = moment(chosenDate).format('DD-MM-YYYY');
    const isValidDob = moment(chosenDate, 'DD-MM-YYYY', true).isValid();
    return isValidDob ? dob : null;
  };

  const initialState = {
    selectedGenderId: parseInt(gender),
    name: first_name,
    lastname: last_name || '',
    username: user_name,
    dob: generateDob(),
    bio: label,
    email: email,
    phone_prefix: phone_prefix,
    phone: phone,
    favorite_sports: favorite_sports_ids,
    location_lat: location_lat,
    location_long: location_long,
    is_save: false,
  };
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailEdited, setIsEmailEdited] = useState(email != state.email);
  const [isPhoneEdited, setIsPhoneEdited] = useState(phone != state.phone);
  const [showDob, setShowDob] = useState(false);
  const [chosenDate, setChosenDate] = useState(new Date(date_of_birth));

  useEffect(() => {
    setState({
      ...state,
      selectedGenderId: parseInt(gender),
      name: first_name,
      lastname: last_name,
      username: user_name,
      dob: generateDob(),
      bio: label,
      phone_prefix: phone_prefix,
      phone: phone,
      favorite_sports: favorite_sports_ids,
      location_lat: parseFloat(location_lat),
      location_long: parseFloat(location_long),
      is_save: false,
    });
    setIsEmailEdited(email != state.email || is_email_changed || false);
  }, [isFocused]);

  const onClickItem = id => setState({...state, selectedGenderId: id});
  const handleName = value => setState({...state, name: value});
  const handleLastName = value => setState({...state, lastname: value});
  const handleUsername = value => setState({...state, username: value});
  const handleDob = value => setState({...state, dob: value});
  const handleBio = value => setState({...state, bio: value});

  const togglePickerPhone = () => setIsPhoneEdited(!isPhoneEdited);
  const togglePickerEmail = () => setIsEmailEdited(!isEmailEdited);

  const handleEmail = value => {
    setState({...state, email: value});
  };
  const handlePhone = value => {
    setState({...state, phone: value});
  };

  const updateProfileMutation = useMutation('editProfile', editProfile, {
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
        displaySuccessToast('Profile Updated Successfully');
        if (isPhoneEdited) {
          verifyPhone.mutate();
          navigation.navigate(
            'Verification' as never,
            {
              phone: state.phone,
              type: 'profilePhoneEdit',
              is_email_edited: email != state.email,
            } as never,
          );
        } else if (isEmailEdited) {
          navigation.navigate('VerifyEmail');
        } else {
          navigation.goBack();
        }
      }
      setIsLoading(false);
    },
    onError: error => {
      setIsLoading(false);

      if (error?.data?.success == 0) {
        if (error?.data?.data) {
          const key = Object.keys(error?.data?.data)[0];
          displayErrorToast(error?.data?.data[key]);
        } else return displayErrorToast(error?.data?.message);
      }
    },
  });

  const onImageUpload = e => {
    const data = {
      type: e[0]?.type,
      name: e[0]?.name.split('/').pop(),
      uri: e[0]?.uri,
    };
    const formData = new FormData();
    formData.append('profile_pic', data);
    uploadImage?.mutate(formData);
  };

  const uploadImage = useMutation('uploadProfileImage', uploadProfileImage, {
    onSuccess: data => {
      if (!data?.success) {
        displayErrorToast(data?.errorMessage || 'Something went wrong');
      }
      if (data?.success) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
        displaySuccessToast('Profile Image Uploaded');
      }
    },
  });

  const handleSave = () => {
    if ((state.name && state.name.length < 2) || !state.name?.match(nameRegex))
      return displayErrorToast('Invalid First Name.');
    if (
      (state.lastname && state.lastname.length < 2) ||
      !state.lastname?.match(nameRegex)
    )
      return displayErrorToast('Invalid Last Name.');
    if (state.username.length < 4)
      return displayErrorToast('Invalid Username.');
    if (
      (state.email && state.email.trim().length === 0) ||
      emailRegex.test(state.email) === false
    )
      return displayErrorToast('Invalid Email.');
    if (state.phone.length < 1)
      return displayErrorToast(
        'Your phone number should be between 10 to 11 digits. Please enter a valid number.',
      );
    if (!state.selectedGenderId)
      return displayErrorToast('Kindly Select Gender.');

    if (phone != state.phone && email != state.email) {
      setIsPhoneEdited(phone != state.phone);
      setIsEmailEdited(email != state.email);
      Keyboard.dismiss();
    } else if (phone != state.phone || email != state.email) {
      if (phone != state.phone) {
        setState({...state, is_save: true});
        setIsPhoneEdited(phone != state.phone);
        Keyboard.dismiss();
      } else if (email != state.email) {
        setIsEmailEdited(email != state.email);
        setIsPhoneEdited(phone != state.phone);
        Keyboard.dismiss();
      } else {
        return null;
      }
    } else {
      setIsLoading(true);
      const body = {
        first_name: state.name,
        last_name: state.lastname,
        username: state.username,
        gender: state.selectedGenderId,
        email: state.email,
        phone_prefix: state.phone_prefix,
        phone: state.phone,
        favorite_sports: state.favorite_sports,
        location_lat: state.location_lat,
        location_long: state.location_long,
        label: state.bio,
        date_of_birth: generateDob(),
      };
      updateProfileMutation.mutate(body);
    }
  };

  const verifyPhone = useMutation('verifyPhone', reSendOtp, {
    onSuccess: data => {
      if (data?.success == 0) return displayErrorToast(data?.message);
    },
    onError: error => {
      if (error?.data?.success == 0) {
        if (error?.data?.data) {
          const key = Object.keys(error?.data?.data)[0];
          displayErrorToast(error?.data?.data[key]);
        } else return displayErrorToast(error?.data?.message);
      }
    },
  });

  const handleSendVerificationPhone = async () => {
    const body = {
      first_name: state.name,
      last_name: state.lastname,
      username: state.username,
      gender: state.selectedGenderId,
      email: state.email,
      phone_prefix: state.phone_prefix,
      phone: state.phone,
      favorite_sports: state.favorite_sports,
      location_lat: state.location_lat,
      location_long: state.location_long,
      label: state.bio,
      date_of_birth: generateDob(),
    };
    updateProfileMutation.mutate(body);
  };

  const verifyEmailMutation = useMutation('verifyEmail', verifyEmailSendOTP, {
    onSuccess: data => {
      if (data?.success == 0) return displayErrorToast(data?.message);
    },
    onError: error => {
      if (error?.data?.success == 0) {
        if (error?.data?.data) {
          const key = Object.keys(error?.data?.data)[0];
          displayErrorToast(error?.data?.data[key]);
        } else return displayErrorToast(error?.data?.message);
      }
    },
  });

  const handleSendVerificationEmail = async () => {
    const body = {
      first_name: state.name,
      last_name: state.lastname,
      username: state.username,
      gender: state.selectedGenderId,
      email: state.email,
      phone_prefix: state.phone_prefix,
      phone: state.phone,
      favorite_sports: state.favorite_sports,
      location_lat: state.location_lat,
      location_long: state.location_long,
      label: state.bio,
      date_of_birth: generateDob(),
    };
    updateProfileMutation.mutate(body);
  };

  const handleDatePicker = e => {
    setChosenDate(new Date(e));
  };

  const subtractYears = (date, years) => {
    const dateCopy = new Date(date);
    dateCopy.setFullYear(date.getFullYear() - years);
    return dateCopy;
  };

  const newDate = subtractYears(new Date(), 12);

  return (
    <Box flex={1} backgroundColor="white">
      {isLoading && <LoadingOverlay />}
      <Header title={'Edit Profile'} left />
      <ScrollView>
        <ImageUpload onChange={e => onImageUpload(e)} image={image} />
        <Box style={{marginLeft: wp(4)}}>
          <Text variant={'blackshade16400'} fontWeight={'bold'}>
            Public info
          </Text>
          <Text variant={'blackshade14500'} mt={'l'}>
            First Name
          </Text>
          <TextInput
            placeholder={'Your First here'}
            style={[styles.inputStyle, {paddingLeft: wp(3)}]}
            placeholderTextColor={palette?.placeholder}
            onChangeText={handleName}
            value={state.name}
          />
          <Text variant={'blackshade14500'} mt={'l'}>
            Last Name
          </Text>
          <TextInput
            placeholder={'Your Last here'}
            style={[styles.inputStyle, {paddingLeft: wp(3)}]}
            placeholderTextColor={palette?.placeholder}
            onChangeText={handleLastName}
            value={state.lastname}
          />
          <Text variant={'blackshade14500'} mt={'l'}>
            User name
          </Text>
          <TextInput
            placeholder={'Username'}
            style={[styles.inputStyle, {paddingLeft: wp(3)}]}
            placeholderTextColor={palette?.placeholder}
            onChangeText={handleUsername}
            value={state.username}
          />
          <Text variant={'blackshade14500'} mt={'l'}>
            Day of birth
          </Text>

          {showDob && (
            <Box
              flexDirection={'row'}
              justifyContent="space-around"
              // mt="m"
              // mr="m"
            >
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

          <TouchableBox onPress={() => setShowDob(!showDob)}>
            <Box pointerEvents="none">
              <TextInput
                placeholder={'Select Day of Birth'}
                style={[styles.inputStyle, {paddingLeft: wp(3)}]}
                placeholderTextColor={palette?.placeholder}
                onChangeText={handleDob}
                value={chosenDate.toLocaleDateString()}
                editable={false}
                // onFocus={() => setShowDob(!showDob)}
              />
            </Box>
          </TouchableBox>
          <Text variant={'blackshade14500'} mt={'l'}>
            Gender
          </Text>
          <Box mt={'l'}>
            {gender_list?.map(data => {
              return (
                <Box mb="t">
                  <RadioButton
                    text={data.gender}
                    selected={state.selectedGenderId === data.id}
                    onPress={() => onClickItem(data.id)}
                    radio={true}
                  />
                </Box>
              );
            })}
          </Box>
          <Box mb={'m'}>
            <Text variant={'blackshade14500'}>Bio</Text>
            <TextInput
              placeholder={'Write something about yourself'}
              style={[styles.inputStyle, {height: wp(25), paddingLeft: wp(3)}]}
              placeholderTextColor={palette?.placeholder}
              placeholderStyle={{marginTop: 5}}
              onChangeText={handleBio}
              textAlignVertical="top"
              value={state.bio}
            />
          </Box>
        </Box>
        <Box style={{marginLeft: wp(4)}} mt={'m'}>
          <Text variant={'blackshade16400'} fontWeight={'bold'}>
            Private info
          </Text>
          <Text variant={'blackshade14500'} mt={'l'}>
            Email
          </Text>
          <TextInput
            placeholder={'youremailaddress@gmail.com'}
            style={[styles.inputStyle, {paddingLeft: wp(3)}]}
            placeholderTextColor={palette?.placeholder}
            onChangeText={handleEmail}
            value={state.email}
          />
          <Text variant={'blackshade14500'} mt={'l'}>
            Phone
          </Text>
          <Box
            flexDirection={'row'}
            alignItems={'center'}
            marginBottom={'xl'}
            style={[styles.inputStyle, {width: wp(83), paddingLeft: wp(2)}]}>
            <Text mr={'s'} variant={'blackshade14400'}>
              {phone_prefix}
            </Text>
            <TextInput
              placeholder={'Your phone number'}
              // inputStyle={{marginLeft: 10}}
              placeholderTextColor={palette?.placeholder}
              onChangeText={handlePhone}
              value={state.phone}
              keyboardType={'number-pad'}
              maxLength={11}
            />
          </Box>
          {phone_verified_datetime != null && (
            <Text variant={'placeholder14400'} marginVertical={'s'} mb="l">
              Phone number verified
            </Text>
          )}
        </Box>
      </ScrollView>

      {isPhoneEdited ? (
        <Box
          flex={1}
          backgroundColor={'white'}
          style={[styles.confirmationModal, TypographyStyles.cardShadow]}>
          <Box
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            marginHorizontal={'l'}
            marginVertical={'l'}>
            <Text variant={'blackshade20500'}>
              Confirm your new phone number
            </Text>
            <TouchableBox onPress={togglePickerPhone}>
              {Ionicon('close', wp(7), palette?.blackshade)}
            </TouchableBox>
          </Box>
          <Text marginHorizontal={'l'} variant={'blackshade16400'}>
            Your phone number has been changed. From now on this phone number
            will be used when you log in. An OTP code will be send to this phone
            number
          </Text>
          <Text
            textAlign={'center'}
            marginVertical={'l'}
            variant={'blackshade24500'}>
            {phone_prefix}
            {state.phone}
          </Text>
          <Box height={45} marginHorizontal={'l'} mb="m">
            <Button
              label="Send Verification Code"
              onPress={handleSendVerificationPhone}
            />
          </Box>
          <TouchableBox
            style={{alignItems: 'center', marginBottom: wp(2)}}
            onPress={togglePickerPhone}>
            <Text variant="blackshade14400" marginVertical={'s'}>
              Edit my phone number
            </Text>
          </TouchableBox>
        </Box>
      ) : isEmailEdited ? (
        <Box
          flex={1}
          backgroundColor={'white'}
          style={[
            styles.confirmationModal,
            TypographyStyles.cardShadow,
            {top: wp(40)},
          ]}>
          <Box
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            marginHorizontal={'l'}
            marginVertical={'l'}>
            <Text
              variant={
                'blackshade20500'
              }>{`Confirm your new email \naddress`}</Text>
            <TouchableBox onPress={togglePickerEmail}>
              {Ionicon('close', wp(7), palette?.blackshade)}
            </TouchableBox>
          </Box>
          <Text marginHorizontal={'l'} mb={'l'} variant={'blackshade16400'}>
            Please confirm your new email address.
          </Text>
          <Text textAlign={'center'} mb={'l'} variant={'blackshade20500'}>
            {state.email}
          </Text>
          <Text marginHorizontal={'l'} mb={'l'} variant={'blackshade16400'}>
            Once you've confirmed, we'll send a verification email to complete
            the process.
          </Text>
          <Box height={45} marginHorizontal={'l'} mb="m">
            <Button
              label="Send Verification Email"
              onPress={handleSendVerificationEmail}
            />
          </Box>
          <TouchableBox
            style={{alignItems: 'center', marginBottom: wp(2)}}
            onPress={togglePickerEmail}>
            <Text variant="blackshade14400" marginVertical={'s'}>
              Edit my email
            </Text>
          </TouchableBox>
        </Box>
      ) : (
        <></>
      )}
      <Box height={45} marginHorizontal={'m'} mb="m">
        <Button label="Save" onPress={handleSave} />
      </Box>
    </Box>
  );
};

export default EditProfile;
