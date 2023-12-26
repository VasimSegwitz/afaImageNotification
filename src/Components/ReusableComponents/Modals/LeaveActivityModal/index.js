import React, {useEffect, useState} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {Box, palette, TouchableBox, Text, fonts} from '../../../Theme/Index';
import {styles} from './styles';
import Button from '../../Button';
import {Down, Ionicon} from '../../Icons';
import {wp} from '../../../Helpers/responsive-ratio';
import {Images} from '../../../../Constant/Image';
import {Input} from '../../Input';
import RadioButton from '../../RadioButton';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Addbutton} from '../../../Booking/ActivityDetail/pricing';

const LeaveActivityModal = ({
  visible = false,
  onClose,
  onPress,
  onItemPress,

  title,

  buttonLabel,
  detail,
  left = false,
  buttonColor = palette?.primary,
  number = 12345678,
  people,
  onRefund,
  genderOption,
  different_pricing = [],
  numData = [],
  years = {yer},
}) => {
  const gender = useSelector(state => state?.auth?.user?.user?.data?.gender);

  const [count, setCount] = useState(1);

  const [isKid, setisKid] = useState(
    numData?.find(data => data.gender == 1 && data?.age == 12)?.count,
  );
  const [isKidFem, setisKidFem] = useState(
    numData?.find(data => data.gender == 2 && data?.age == 12)?.count,
  );
  const [isYouth, setisYouth] = useState(
    numData?.find(data => data.gender == 1 && data?.age == 18)?.count,
  );
  const [isYouthFem, setisYouthFem] = useState(
    numData?.find(data => data.gender == 2 && data?.age == 18)?.count,
  );
  const [isAdult, setisAdult] = useState(
    numData?.find(data => data.gender == 1 && data?.age == 19)?.count,
  );
  const [isAdultFem, setisAdultFem] = useState(
    numData?.find(data => data.gender == 2 && data?.age == 19)?.count,
  );
  const [isSenior, setisSenior] = useState(
    numData?.find(data => data.gender == 1 && data?.age == 39)?.count,
  );
  const [isSeniorFem, setisSeniorFem] = useState(
    numData?.find(data => data.gender == 2 && data?.age == 39)?.count,
  );

  const [kid, setKid] = useState(isKid || 0);
  const [adult, setAdult] = useState(isAdult || 0);
  const [senior, setSenior] = useState(isSenior || 0);
  const [youth, setYouth] = useState(isYouth || 0);
  const [kidFem, setKidFem] = useState(isKidFem || 0);
  const [adultFem, setAdultFem] = useState(isAdultFem || 0);
  const [seniorFem, setSeniorFem] = useState(isSeniorFem || 0);
  const [youthFem, setYouthFem] = useState(isYouthFem || 0);
  const [peoples_data, setpeoples_data] = useState();

  const KidPrice = different_pricing.find(
    data => data?.age == 12 && data?.gender == 1 && genderOption != 2,
  );
  const youthPrice = different_pricing.find(
    data => data?.age == 18 && data?.gender == 1 && genderOption != 2,
  );
  const adultPrice = different_pricing.find(
    data =>
      data?.age >= 19 &&
      data?.age <= 38 &&
      data?.gender == 1 &&
      genderOption != 2,
  );
  const seniorPrice = different_pricing.find(
    data => data?.age > 39 && data?.gender == 1 && genderOption != 2,
  );
  const KidFemPrice = different_pricing.find(
    data => data?.age == 12 && data?.gender == 2 && genderOption != 1,
  );
  const youthFemPrice = different_pricing.find(
    data => data?.age == 18 && data?.gender == 2 && genderOption != 1,
  );
  const adultFemPrice = different_pricing.find(
    data =>
      data?.age >= 19 &&
      data?.age <= 38 &&
      data?.gender == 2 &&
      genderOption != 1,
  );
  const seniorFemPrice = different_pricing.find(
    data => data?.age > 39 && data?.gender == 2 && genderOption != 1,
  );

  const handleJoinActivity = () => {
    const bd = [
      {
        ...(kid > 0 && {
          gender: 1,
          age: 12,
          count: kid,
        }),
      },
      {
        ...(kidFem > 0 && {
          gender: 2,
          age: 12,
          count: kidFem,
        }),
      },
      {
        ...(youth > 0 && {
          gender: 1,
          age: 18,
          count: youth,
        }),
      },
      {
        ...(youthFem > 0 && {
          gender: 2,
          age: 18,
          count: youthFem,
        }),
      },
      {
        ...(adult > 0 && {
          gender: 1,
          age: 19,
          count: adult,
        }),
      },
      {
        ...(adultFem > 0 && {
          gender: 2,
          age: 19,
          count: adultFem,
        }),
      },
      {
        ...(senior > 0 && {
          gender: 1,
          age: 40,
          count: senior,
        }),
      },
      {
        ...(seniorFem > 0 && {
          gender: 2,
          age: 40,
          count: seniorFem,
        }),
      },
    ];

    setpeoples_data(bd?.filter(obj => !(obj && Object.keys(obj).length === 0)));

    peoples_data && onPress(peoples_data);

    // setJoin(true);
  };

  useEffect(() => {
    if (years <= 12) {
      gender == 1 &&
        setKid(
          numData.find(data => data.gender == 1 && data?.age == 12) ? isKid : 0,
        );
      gender == 2 &&
        setKidFem(
          numData.find(data => data.gender == 2 && data?.age == 12)
            ? isKidFem
            : 0,
        );
    } else if (years > 12 && years <= 18) {
      gender == 1 &&
        setYouth(
          numData.find(data => data.gender == 1 && data?.age == 18)
            ? isYouth
            : 0,
        );
      gender == 2 &&
        setYouthFem(
          numData.find(data => data.gender == 2 && data?.age == 18)
            ? isYouthFem
            : 0,
        );
    } else if (years > 18 && years <= 39) {
      gender == 1 &&
        setAdult(
          numData.find(
            data => data.gender == 1 && data?.age >= 19 && data?.age <= 38,
          )
            ? isAdult
            : 0,
        );
      gender == 2 &&
        setAdultFem(
          numData.find(
            data => data.gender == 2 && data?.age >= 19 && data?.age <= 38,
          )
            ? isAdultFem
            : 0,
        );
    } else if (years >= 39) {
      gender == 1 &&
        setSenior(
          numData.find(data => data.gender == 1 && data?.age >= 39)
            ? isSenior
            : 0,
        );
      gender == 2 &&
        setSeniorFem(
          numData.find(data => data.gender == 2 && data?.age >= 39)
            ? isSeniorFem
            : 0,
        );
    }
  }, []);

  const onClickItem = item => {
    const d = reason?.map(i => {
      if (item == i)
        return {
          ...i,
          flag: true,
        };
      else
        return {
          ...i,
          flag: false,
        };
    });

    setReason(d);

    onItemPress(item);
  };

  const Data = [
    {name: 'Timing is no longer doable', flag: false, value: 1},
    {name: 'Something urgent came up', flag: false, value: 2},
    {name: 'Wrongly joined Activity', flag: false, value: 3},
  ];

  const [reason, setReason] = useState(Data);

  const refes = () => {
    if (numData?.length < 1) onPress(count);
    else {
      handleJoinActivity();
    }
  };

  return (
    <Modal
      transparent
      isVisible={visible}
      propagateSwipe={true}
      // swipeDirection="down"
      onSwipeComplete={() => onClose()}
      onBackdropPress={() => onClose()}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <Pressable style={styles.overlay} onPress={() => onClose()} />
      <Box style={styles.modalStyle}>
        <ScrollView>
          <Box style={styles.whiteCard}>
            <Box style={styles.buttonsWrap}>
              {/* {Ionicon('close', 20, palette?.white)} */}

              <Text style={styles.blessingImg}>{title}</Text>
              <TouchableBox style={styles.closeIcon} onPress={() => onClose()}>
                {Ionicon('close', 20, palette?.black)}
                {/* <Ionicons name="close" size={30} color={palette.black} /> */}
              </TouchableBox>
            </Box>
            <ScrollView>
              <Box style={styles.textWrap} paddingVertical="l">
                <Text
                  variant="blackshade12900"
                  // style={styles.midText}
                  textTransform="uppercase"
                  textAlign={left ? 'left' : 'center'}>
                  {detail}
                </Text>
              </Box>
              <Box style={styles.textWrap}>
                <Text
                  variant="blackshade16400"
                  // style={styles.midText}

                  textAlign={left ? 'left' : 'center'}>
                  If you have to leave, please let us know below why:
                </Text>
              </Box>

              <Box style={styles.textWrap} marginVertical="l">
                {reason?.map(item => {
                  return (
                    <Box mb="s">
                      <RadioButton
                        text={item?.name}
                        selected={item?.flag}
                        onPress={() => onClickItem(item)}
                        textStyle={{
                          fontSize: 16,
                          fontWeight: '400',
                          fontFamiliy: fonts?.regular,
                          lineHeight: 22,
                          color: palette?.blackshade,
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
              {people > 0 && different_pricing?.length < 1 ? (
                <>
                  <Box style={styles.textWrap} paddingVertical="l">
                    <Text
                      variant="blackshade12900"
                      // style={styles.midText}
                      textTransform="uppercase"
                      textAlign={left ? 'left' : 'center'}>
                      People Leaving
                    </Text>
                  </Box>
                  <Box style={styles.textWrap}>
                    <Text
                      variant="blackshade16400"
                      // style={styles.midText}

                      textAlign={left ? 'left' : 'center'}>
                      You booked this Activity for {people} people. How many of
                      you will be leaving?
                    </Text>
                  </Box>
                  <Box
                    mt="l"
                    mb="l"
                    ml="m"
                    justifyContent="space-between"
                    flexDirection="row"
                    alignItems="center">
                    <Box flexDirection="column">
                      <Text variant="blackshade16800Regular">
                        Members Leaving
                      </Text>
                      <Text variant="blackshade116500Regular">(incl. you)</Text>
                    </Box>
                    <Box flexDirection="row">
                      <TouchableBox
                        onPress={() => count > 1 && setCount(count - 1)}>
                        <FastImage
                          resizeMode={FastImage?.resizeMode?.contain}
                          source={Images.Minus}
                          style={{height: 34, width: 34}}
                        />
                      </TouchableBox>
                      <Box backgroundColor="primary3" borderRadius={5}>
                        <Text variant="blackshade18800Regular" m="s">
                          {count < 10 ? '0' + count : count}
                        </Text>
                      </Box>
                      <TouchableBox
                        onPress={() =>
                          setCount(people > count ? count + 1 : count)
                        }>
                        <FastImage
                          resizeMode={FastImage?.resizeMode?.contain}
                          source={Images.Plus}
                          style={{height: 34, width: 34}}
                        />
                      </TouchableBox>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Box style={styles.textWrap} paddingVertical="s">
                    <Text
                      variant="blackshade12900"
                      // style={styles.midText}
                      textTransform="uppercase"
                      textAlign={left ? 'left' : 'center'}>
                      People Leaving
                    </Text>
                  </Box>
                  <Box mt="l" mb="xl" ml="m">
                    <Box flexDirection="column">
                      <Text variant="blackshade16800Regular">
                        Members Leaving
                      </Text>
                      <Text variant="blackshade116500Regular">(incl. you)</Text>
                    </Box>
                    {isKid && KidPrice?.price && (
                      <Addbutton
                        counter={kid < 10 ? '0' + kid : kid}
                        label="Kid-M (<12yr)"
                        price={KidPrice?.price}
                        onMinus={() => kid > 0 && setKid(kid - 1)}
                        onPlus={() => setKid(kid + (isKid == kid ? 0 : 1))}
                      />
                    )}
                    {isKidFem && KidFemPrice?.price && (
                      <Addbutton
                        counter={kidFem < 10 ? '0' + kidFem : kidFem}
                        label="Kid-F (<12yr)"
                        price={KidFemPrice?.price}
                        onMinus={() => kidFem > 0 && setKidFem(kidFem - 1)}
                        onPlus={() =>
                          setKidFem(kidFem + (isKidFem == kidFem ? 0 : 1))
                        }
                      />
                    )}
                    {isYouth && youthPrice?.price && (
                      <Addbutton
                        counter={youth < 10 ? '0' + youth : youth}
                        label="Youth-M (13-18yr)"
                        price={youthPrice?.price}
                        onMinus={() => youth > 0 && setYouth(youth - 1)}
                        onPlus={() =>
                          setYouth(youth + (isYouth == youth ? 0 : 1))
                        }
                      />
                    )}
                    {isYouthFem && youthFemPrice?.price && (
                      <Addbutton
                        counter={youthFem < 10 ? '0' + youthFem : youthFem}
                        label="Youth-F (13-18yr)"
                        price={youthFemPrice?.price}
                        onMinus={() =>
                          youthFem > 0 && setYouthFem(youthFem - 1)
                        }
                        onPlus={() =>
                          setYouthFem(
                            youthFem + (isYouthFem == youthFem ? 0 : 1),
                          )
                        }
                      />
                    )}
                    {isAdult && adultPrice?.price && (
                      <Addbutton
                        counter={adult < 10 ? '0' + adult : adult}
                        label="Adult-M (19-40)"
                        price={adultPrice?.price}
                        onMinus={() => adult > 0 && setAdult(adult - 1)}
                        onPlus={() =>
                          setAdult(adult + (isAdult == adult ? 0 : 1))
                        }
                      />
                    )}
                    {isAdultFem && adultFemPrice?.price && (
                      <Addbutton
                        counter={adultFem < 10 ? '0' + adultFem : adultFem}
                        label="Adult-F (19-40)"
                        price={adultFemPrice?.price}
                        onMinus={() =>
                          adultFem > 0 && setAdultFem(adultFem - 1)
                        }
                        onPlus={() =>
                          setAdultFem(
                            adultFem + (isAdultFem == adultFem ? 0 : 1),
                          )
                        }
                      />
                    )}
                    {isSenior && seniorPrice?.price && (
                      <Addbutton
                        counter={senior < 10 ? '0' + senior : senior}
                        label="Senior-M (>40yr)"
                        price={seniorPrice?.price}
                        onMinus={() => senior > 0 && setSenior(senior - 1)}
                        onPlus={() =>
                          setSenior(senior + (isSenior == senior ? 0 : 1))
                        }
                      />
                    )}
                    {isSeniorFem && seniorFemPrice?.price && (
                      <Addbutton
                        counter={seniorFem < 10 ? '0' + seniorFem : seniorFem}
                        label="Senior-F (>40yr)"
                        price={seniorFemPrice?.price}
                        onMinus={() =>
                          seniorFem > 0 && setSeniorFem(seniorFem - 1)
                        }
                        onPlus={() =>
                          setSeniorFem(
                            seniorFem + (isSeniorFem == seniorFem ? 0 : 1),
                          )
                        }
                      />
                    )}
                  </Box>
                </>
              )}
              <Box style={styles.textWrap} paddingBottom="l">
                <Text
                  variant="blackshade12900"
                  // style={styles.midText}
                  textTransform="uppercase"
                  textAlign={left ? 'left' : 'center'}>
                  Money refund
                </Text>
              </Box>
              <Box style={styles.textWrap}>
                <Text
                  variant="blackshade16400"
                  // style={styles.midText}

                  textAlign={left ? 'left' : 'center'}>
                  Leaving before the Activity starts will result in a 100%
                  refund via AFA Pay
                </Text>
              </Box>
              <Box style={styles?.textWrap} mt="l">
                <TouchableBox onPress={() => onRefund()}>
                  <Box flexDirection="row">
                    <FastImage
                      source={Images?.Info}
                      style={{
                        height: 18,
                        width: 18,
                      }}
                      resizeMode="contain"
                    />
                    <Text variant="blackshade12400" ml="m">
                      Read more about our Refund Policy
                    </Text>
                  </Box>
                </TouchableBox>
              </Box>
            </ScrollView>
            <Box
              height={1}
              width={wp(90)}
              backgroundColor="tertiary2"
              marginVertical="t"
              alignSelf="center"
            />
            {/* <Box style={styles.textWrap} paddingVertical="xxl">
            <Text style={styles.number}>+60 {number}</Text>
          </Box> */}

            <Button
              label={buttonLabel}
              onPress={() => refes()}
              buttonColor={buttonColor}
            />
            <TouchableBox onPress={onClose}>
              <Box style={styles.textEditWrap}>
                <Text style={styles.Editnumber}>Cancel</Text>
              </Box>
            </TouchableBox>
          </Box>
        </ScrollView>
      </Box>
    </Modal>
  );
};

export default LeaveActivityModal;
