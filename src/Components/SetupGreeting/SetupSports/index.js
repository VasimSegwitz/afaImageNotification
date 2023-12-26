/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import Button from '../../ReusableComponents/Button';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';

export default props => {
  const {navigation, route, onPress, onSubmit} = props;

  const {sport} = useSelector(state => state.auth.user);

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
            <Box alignItems={'center'} justifyContent="center" mt="xl">
              <FastImage
                source={Images.Setupsport}
                resizeMode="contain"
                style={{height: wp(8), width: wp(8), marginBottom: 10}}
              />
              <Text variant={'blackshade24500'}>What sports do you play?</Text>
              <Text variant={'blackshade14400'} textAlign="center" mt="s">
                Select 2-3 preferred sports to get suggestions about activities
                and groups.
              </Text>
            </Box>

            <ScrollView
              top={wp(5)}
              style={{
                flex: 1,
                flexGrow: 1,
              }}
              //   backgroundColor="primary"
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 10,
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              {sport?.length > 0 &&
                sport.map(item => {
                  return (
                    <TouchableBox
                      onPress={() => {
                        const d = sport.map(it => {
                          if (item === it) {
                            return {
                              ...it,
                              flag: !it?.flag,
                            };
                          } else {
                            return {
                              ...it,
                              // flag: false,
                            };
                          }
                        });
                        // setSport(d);
                      }}>
                      <Box
                        paddingVertical="m"
                        height={wp(22)}
                        width={wp(28)}
                        // m="sm"
                        justifyContent={'space-around'}
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

                        <Text variant="blackshade14400">{item?.name}</Text>
                      </Box>
                    </TouchableBox>
                  );
                })}
              <Box width={wp(90)} top={wp(1)} alignSelf="center">
                <Button
                  RenderComponent={() => (
                    <Box
                      p="s"
                      flexDirection={'row'}
                      style={
                        ([TypographyStyles.cardShadow],
                        {
                          width: '100%',
                          height: wp(10),

                          alignItems: 'center',
                          justifyContent: 'center',
                          // backgroundColor: 'white',
                          //   borderWidth: 1,
                          // borderColor: '#C1C1C1',
                          borderRadius: 5,
                        })
                      }>
                      <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={Images.SetupsportLeft}
                        style={{
                          height: wp(5),
                          width: wp(5),
                          marginRight: wp(2),
                        }}
                      />
                      <Text textTransform="uppercase">
                        {sport?.length > 0
                          ? 'Select more Sport'
                          : 'Select a Sport'}
                      </Text>
                    </Box>
                  )}
                  // onPress={}
                  onPress={() => onPress()}
                  buttonColor={'#FFEEE6'}
                />
              </Box>
            </ScrollView>

            {sport?.length > 0 && (
              <Box
                width={wp(100) - 30}
                position={'absolute'}
                bottom={wp(1)}
                alignSelf="center">
                <Button
                  onPress={() => onSubmit()}
                  label={'Continue'}
                  buttonStyle={{
                    height: wp(10),
                    marginBottom: 10,
                  }}
                />
              </Box>
            )}
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};
