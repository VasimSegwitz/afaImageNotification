import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Button} from '../../ReusableComponents';
import {Ionicon} from '../../ReusableComponents/Icons';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import styles from './style';
import {useMutation, useQuery} from 'react-query';
import {going} from '../../Services/ProfileApi';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityConstants} from '../../../Redux';
import {useNavigation} from '@react-navigation/native';
import authStore from '../../../Zustand/store';
import {getSingleActivity, requestActivity} from '../../Services/Booking';
import {methodPay} from '../../Helpers/Enums';

export const Addbutton = props => {
  const {price, onMinus, counter, onPlus, label} = props;

  return (
    <Box
      mt="l"
      justifyContent="space-between"
      flexDirection="row"
      alignItems="center"
      style={{marginBottom: wp(-4)}}
      flex={1}>
      <Box flexDirection="row" alignItems="center" flex={0.7} flexWrap="wrap">
        <Text variant="blackshade15400">{label}</Text>
        <Text variant="blackshade116500Regular" ml="s" mr={'xxl'}>
          RM{price}/pax
        </Text>
      </Box>
      <Box flexDirection="row" flex={0.3}>
        <TouchableBox onPress={onMinus}>
          <FastImage
            resizeMode={FastImage?.resizeMode?.contain}
            source={Images.Minus}
            style={{height: 34, width: 34}}
          />
        </TouchableBox>
        <Box backgroundColor="primary3" borderRadius={5}>
          <Text variant="blackshade18800Regular" m="s">
            {counter}
          </Text>
        </Box>
        <TouchableBox onPress={onPlus}>
          <FastImage
            resizeMode={FastImage?.resizeMode?.contain}
            source={Images.Plus}
            style={{height: 34, width: 34}}
          />
        </TouchableBox>
      </Box>
    </Box>
  );
};

const ShowPrice = props => {
  const {label, counter, price} = props;
  return (
    <Box flexDirection={'row'} justifyContent={'space-between'} flex={1}>
      <Box flex={0.5}>
        <Text variant={'blackshade16400'}>{label}</Text>
      </Box>
      <Box flex={0.2}>
        <Text variant={'blackshade16400'}>{counter} Pax</Text>
      </Box>
      <Box flex={0.3}>
        <Text variant={'blackshade16400'}>
          RM {parseFloat(price).toFixed(2)}
        </Text>
      </Box>
    </Box>
  );
};

const Pricing = props => {
  const navigation = useNavigation();
  const {
    state,
    setState,
    different_pricing,
    fair_price,
    activity_id,
    paymentMethod,
    years,
    genderOption,
    neededPlayer,
  } = props;

  const dispatch = useDispatch();
  const gender = useSelector(state => state?.auth?.user?.user?.data?.gender);
  const walletBalance = useSelector(
    state => state?.auth?.user?.user?.data?.wallet?.balance,
  );
  const in_sufficient = useSelector(
    state => state?.activity?.activity?.insufficient,
  );
  const isFairPrice = fair_price != null && different_pricing.length == 0;

  const is_wallet_activated = useSelector(
    state => state?.auth?.user?.user?.data?.wallet?.activated_at,
  );

  const user = useSelector(state => state?.auth?.user?.user);

  const [count, setCount] = useState(isFairPrice ? 1 : 0);
  const [join, setJoin] = useState(false);
  const [kid, setKid] = useState(0);
  const [adult, setAdult] = useState(0);
  const [senior, setSenior] = useState(0);
  const [youth, setYouth] = useState(0);
  const [kidFem, setKidFem] = useState(0);
  const [adultFem, setAdultFem] = useState(0);
  const [seniorFem, setSeniorFem] = useState(0);
  const [youthFem, setYouthFem] = useState(0);
  const [peoples_data, setpeoples_data] = useState();
  const [activeWallet, setActiveWallet] = useState(false);
  const total =
    kid +
    kidFem +
    youth +
    youthFem +
    adult +
    adultFem +
    senior +
    seniorFem +
    count;

  const setVanue = authStore(state => state?.setVanue);
  const {vanue} = authStore(state => state?.vanue);
  const setlink = authStore(state => state?.setlink);
  const {is_link} = authStore(state => state?.is_link);

  const {id} = useSelector(state => state?.auth?.user?.user?.data);

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getActivity = useQuery(
    ['getSingleActivity', activity_id],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        setVanue({
          vanue: data?.data,
        });
        setlink({
          is_link: false,
        });
        // navigation?.setParams({vanue: data?.data});
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  const {mutate: request} = useMutation('requestActivity', requestActivity, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
      dispatch({
        type: ActivityConstants.TOTALPAYABLE,
        totalPayable: totalAmount,
      });
      setState({
        ...state,
        is_pricing: false,
        is_activity_paid: paymentMethod == 3 ? true : false,
        is_incomplete_profile: false,
      });
    },
    onError: error => {
      getActivity?.refetch();

      displayErrorToast(error?.data?.message);
      dispatch({
        type: ActivityConstants.TOTALPAYABLE,
        totalPayable: totalAmount,
      });
      setState({
        ...state,
        is_pricing: false,
        is_activity_paid: false,
        is_incomplete_profile: false,
      });
    },
  });

  const goingMutation = useMutation('going', going, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
      dispatch({
        type: ActivityConstants.TOTALPAYABLE,
        totalPayable: totalAmount,
      });
      setState({
        ...state,
        is_pricing: false,
        is_activity_paid: paymentMethod == 3 ? true : false,
        is_incomplete_profile: false,
      });
    },
    onError: error => {
      dispatch({
        type: ActivityConstants.TOTALPAYABLE,
        totalPayable: totalAmount,
      });
      setState({
        ...state,
        is_pricing: false,
        is_activity_paid: false,
        is_incomplete_profile: false,
      });
    },
  });

  const handleClose = () => {
    setActiveWallet(false);
    setJoin(true);

    setState({...state, is_pricing: false});
  };

  const handleJoinActivity = () => {
    if (neededPlayer < total) {
      displayErrorToast(
        `Only ${neededPlayer} ${
          neededPlayer > 1 ? 'players are' : 'player is '
        } required`,
      );
      return;
    }

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

    setJoin(true);
  };

  const handleConfirmJoin = () => {
    if (is_wallet_activated == null && paymentMethod != 2) {
      setActiveWallet(true);
      setJoin(false);
    } else if (paymentMethod == 2) {
      vanue?.users?.some(item => item?.user_id == id)
        ? goingMutation.mutate({
            id: activity_id,
            body: {
              ...(isFairPrice
                ? {
                    peoples: total,
                  }
                : {peoples_data}),
            },
          })
        : request({
            id: activity_id,
            body: {
              is_link: is_link,

              ...(isFairPrice
                ? {
                    peoples: total,
                  }
                : {peoples_data}),
            },
          });
    } else if (walletBalance >= totalAmount) {
      vanue?.users?.some(item => item?.user_id == id)
        ? goingMutation.mutate({
            id: activity_id,
            body: {
              ...(isFairPrice
                ? {
                    peoples: total,
                  }
                : {peoples_data}),
            },
          })
        : request({
            id: activity_id,
            body: {
              is_link: is_link,

              ...(isFairPrice
                ? {
                    peoples: total,
                  }
                : {peoples_data}),
            },
          });
    } else {
      setState({...state, is_pricing: false, inSufficient: true});
      dispatch({
        type: ActivityConstants.INSUFFICIENT,
        insufficient: !in_sufficient,
      });
    }
  };

  // const genderDiffPrice = different_pricing.filter(
  //   data => data.gender == gender,
  // );
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
  const totalAmount =
    (KidPrice?.price || 0) * kid +
    (KidFemPrice?.price || 0) * kidFem +
    (youthPrice?.price || 0) * youth +
    (youthFemPrice?.price || 0) * youthFem +
    (adultPrice?.price || 0) * adult +
    (adultFemPrice?.price || 0) * adultFem +
    (seniorPrice?.price || 0) * senior +
    (seniorFemPrice?.price || 0) * seniorFem +
    (fair_price || 0) * count;

  const [isKid, setisKid] = useState(
    different_pricing?.find(
      data => data.gender == 1 && data?.age == 12 && years <= 12,
    )
      ? 1
      : 0,
  );
  const [isKidFem, setisKidFem] = useState(
    different_pricing?.find(
      data => data.gender == 2 && data?.age == 12 && years <= 12,
    )
      ? 1
      : 0,
  );
  const [isYouth, setisYouth] = useState(
    different_pricing?.find(
      data => data.gender == 1 && data?.age == 18 && years > 12 && years <= 18,
    )
      ? 1
      : 0,
  );
  const [isYouthFem, setisYouthFem] = useState(
    different_pricing?.find(
      data => data.gender == 2 && data?.age == 18 && years > 12 && years <= 18,
    )
      ? 1
      : 0,
  );
  const [isAdult, setisAdult] = useState(
    different_pricing?.find(
      data => data.gender == 1 && data?.age == 19 && years > 18 && years <= 38,
    )
      ? 1
      : 0,
  );
  const [isAdultFem, setisAdultFem] = useState(
    different_pricing?.find(
      data => data.gender == 2 && data?.age == 19 && years > 18 && years <= 38,
    )
      ? 1
      : 0,
  );
  const [isSenior, setisSenior] = useState(
    different_pricing?.find(
      data => data.gender == 1 && data?.age == 39 && years >= 39,
    )
      ? 1
      : 0,
  );
  const [isSeniorFem, setisSeniorFem] = useState(
    different_pricing?.find(
      data => data.gender == 2 && data?.age == 39 && years >= 39,
    )
      ? 1
      : 0,
  );

  useEffect(() => {
    if (years <= 12) {
      gender == 1 &&
        setKid(
          different_pricing.find(
            data => data.gender == gender && data?.age == 12,
          )
            ? 1
            : 0,
        );
      gender == 2 &&
        setKidFem(
          different_pricing.find(
            data => data.gender == gender && data?.age == 12,
          )
            ? 1
            : 0,
        );
    } else if (years > 12 && years <= 18) {
      gender == 1 &&
        setYouth(
          different_pricing.find(
            data => data.gender == gender && data?.age == 18,
          )
            ? 1
            : 0,
        );
      gender == 2 &&
        setYouthFem(
          different_pricing.find(
            data => data.gender == gender && data?.age == 18,
          )
            ? 1
            : 0,
        );
    } else if (years > 18 && years <= 38) {
      gender == 1 &&
        setAdult(
          different_pricing.find(
            data => data.gender == gender && data?.age >= 19 && data?.age <= 38,
          )
            ? 1
            : 0,
        );
      gender == 2 &&
        setAdultFem(
          different_pricing.find(
            data => data.gender == gender && data?.age >= 19 && data?.age <= 38,
          )
            ? 1
            : 0,
        );
    } else if (years >= 39) {
      gender == 1 &&
        setSenior(
          different_pricing.find(
            data => data.gender == gender && data?.age >= 39,
          )
            ? 1
            : 0,
        );
      gender == 2 &&
        setSeniorFem(
          different_pricing.find(
            data => data.gender == gender && data?.age >= 39,
          )
            ? 1
            : 0,
        );
    }
  }, []);

  return (
    <Box
      backgroundColor={'white'}
      style={[
        styles.confirmationModal,
        TypographyStyles.cardShadow,
        {
          top:
            isFairPrice && !join
              ? wp(40)
              : join || isFairPrice
              ? wp(30)
              : join && !isFairPrice
              ? wp(20)
              : wp(40),
        },
      ]}
      p={'l'}>
      <TouchableBox
        onPress={handleClose}
        style={{alignItems: 'flex-end', marginTop: -10}}>
        {Ionicon('close', wp(7), palette?.blackshade)}
      </TouchableBox>
      {activeWallet ? (
        <Box>
          <Text variant={'blackshade20500'} mb={'l'}>
            Activate the wallet first
          </Text>
          <Button
            label="Activate Wallet"
            onPress={() => {
              setActiveWallet(false);
              navigation?.navigate('Wallet');
            }}
          />
        </Box>
      ) : !join ? (
        <>
          <Text variant={'blackshade20500'} mb={'l'}>
            {isFairPrice
              ? 'You go alone or with your friends?'
              : 'Choose your pricing & number of people'}
          </Text>
          <Text variant={'blackshade16400'}>
            {isFairPrice
              ? 'You can help to reserve a slot for your friend also. Please choose how many people join the Activity with you.'
              : 'Please choose your pricing and how many people join together with you.'}
          </Text>
          {isFairPrice ? (
            <Box
              mt="l"
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center">
              <Box flexDirection="row" alignItems="center">
                <Text variant="blackshade16800Regular">Players</Text>
                <Text variant="blackshade116500Regular" ml="s">
                  (incl. you)
                </Text>
              </Box>
              <Box flexDirection="row">
                <TouchableBox onPress={() => count > 1 && setCount(count - 1)}>
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
                <TouchableBox onPress={() => setCount(count + 1)}>
                  <FastImage
                    resizeMode={FastImage?.resizeMode?.contain}
                    source={Images.Plus}
                    style={{height: 34, width: 34}}
                  />
                </TouchableBox>
              </Box>
            </Box>
          ) : (
            <>
              {KidPrice?.price && (
                <Addbutton
                  counter={kid < 10 ? '0' + kid : kid}
                  label="Kid-M (<12yr)"
                  price={KidPrice?.price}
                  onMinus={() =>
                    kid > 0 && setKid(kid - (kid == isKid ? 0 : 1))
                  }
                  onPlus={() => setKid(kid + 1)}
                />
              )}
              {KidFemPrice?.price && (
                <Addbutton
                  counter={kidFem < 10 ? '0' + kidFem : kidFem}
                  label="Kid-F (<12yr)"
                  price={KidFemPrice?.price}
                  onMinus={() =>
                    kidFem > 0 &&
                    setKidFem(kidFem - (kidFem == isKidFem ? 0 : 1))
                  }
                  onPlus={() => setKidFem(kidFem + 1)}
                />
              )}
              {youthPrice?.price && (
                <Addbutton
                  counter={youth < 10 ? '0' + youth : youth}
                  label="Youth-M (13-18yr)"
                  price={youthPrice?.price}
                  onMinus={() =>
                    youth > 0 && setYouth(youth - (isYouth == youth ? 0 : 1))
                  }
                  onPlus={() => setYouth(youth + 1)}
                />
              )}
              {youthFemPrice?.price && (
                <Addbutton
                  counter={youthFem < 10 ? '0' + youthFem : youthFem}
                  label="Youth-F (13-18yr)"
                  price={youthFemPrice?.price}
                  onMinus={() =>
                    youthFem > 0 &&
                    setYouthFem(youthFem - (isYouthFem == youthFem ? 0 : 1))
                  }
                  onPlus={() => setYouthFem(youthFem + 1)}
                />
              )}
              {adultPrice?.price && (
                <Addbutton
                  counter={adult < 10 ? '0' + adult : adult}
                  label="Adult-M (19-40)"
                  price={adultPrice?.price}
                  onMinus={() =>
                    adult > 0 && setAdult(adult - (isAdult == adult ? 0 : 1))
                  }
                  onPlus={() => setAdult(adult + 1)}
                />
              )}
              {adultFemPrice?.price && (
                <Addbutton
                  counter={adultFem < 10 ? '0' + adultFem : adultFem}
                  label="Adult-F (19-40)"
                  price={adultFemPrice?.price}
                  onMinus={() =>
                    adultFem > 0 &&
                    setAdultFem(adultFem - (isAdultFem == adultFem ? 0 : 1))
                  }
                  onPlus={() => setAdultFem(adultFem + 1)}
                />
              )}
              {seniorPrice?.price && (
                <Addbutton
                  counter={senior < 10 ? '0' + senior : senior}
                  label="Senior-M (>40yr)"
                  price={seniorPrice?.price}
                  onMinus={() =>
                    senior > 0 &&
                    setSenior(senior - (isSenior == senior ? 0 : 1))
                  }
                  onPlus={() => setSenior(senior + 1)}
                />
              )}
              {seniorFemPrice?.price && (
                <Addbutton
                  counter={seniorFem < 10 ? '0' + seniorFem : seniorFem}
                  label="Senior-F (>40yr)"
                  price={seniorFemPrice?.price}
                  onMinus={() =>
                    seniorFem > 0 &&
                    setSeniorFem(seniorFem - (seniorFem == isSeniorFem ? 0 : 1))
                  }
                  onPlus={() => setSeniorFem(seniorFem + 1)}
                />
              )}
            </>
          )}
          <Box height={45} mt={'l'}>
            <Button label="Join Activity" onPress={handleJoinActivity} />
          </Box>
        </>
      ) : (
        <>
          <Text variant={'blackshade20500'} mb={'l'}>
            Confirm join Activity?
          </Text>
          <Text variant={'blackshade16400'}>
            Our Host has been putting efforts to arrange activities. Please send
            the request if you are quite sure to attend.
          </Text>
          <Text variant={'blackshade12800'} mb={'s'} mt={'l'}>
            PRICE SUMMARY
          </Text>
          {isFairPrice ? (
            <ShowPrice
              label="Plaers"
              counter={total}
              price={fair_price * total}
            />
          ) : (
            <>
              {kid > 0 && KidPrice?.price && (
                <ShowPrice
                  label="Kid (Male)"
                  counter={kid}
                  price={KidPrice?.price * kid}
                />
              )}
              {kidFem > 0 && KidFemPrice?.price && (
                <ShowPrice
                  label="Kid (Female)"
                  counter={kidFem}
                  price={KidFemPrice?.price * kidFem}
                />
              )}
              {youth > 0 && youthPrice?.price && (
                <ShowPrice
                  label="Youth (Male)"
                  counter={youth}
                  price={youthPrice?.price * youth}
                />
              )}
              {youthFem > 0 && youthFemPrice?.price && (
                <ShowPrice
                  label="Youth (Female)"
                  counter={youthFem}
                  price={youthFemPrice?.price * youthFem}
                />
              )}
              {adult > 0 && adultPrice?.price && (
                <ShowPrice
                  label="Adult (Male)"
                  counter={adult}
                  price={adultPrice?.price * adult}
                />
              )}
              {adultFem > 0 && youthFemPrice?.price && (
                <ShowPrice
                  label="Adult (Female)"
                  counter={adultFem}
                  price={youthFemPrice?.price * adultFem}
                />
              )}
              {senior > 0 && seniorPrice?.price && (
                <ShowPrice
                  label="Senior (Male)"
                  counter={senior}
                  price={seniorPrice?.price * senior}
                />
              )}
              {seniorFem > 0 && seniorFemPrice?.price && (
                <ShowPrice
                  label="Senior (Female)"
                  counter={seniorFem}
                  price={seniorFemPrice?.price * seniorFem}
                />
              )}
            </>
          )}

          {/* {isFairPrice ? (
            <Box
              flexDirection={'row'}
              justifyContent={'space-between'}
              flex={1}>
              <Box flex={0.5}>
                <Text variant={'blackshade16400'}>Players</Text>
              </Box>
              <Box flex={0.2}>
                <Text variant={'blackshade16400'}>{total} Pax</Text>
              </Box>
              <Box flex={0.3}>
                <Text variant={'blackshade16400'}>
                  RM {fair_price * total}.00
                </Text>
              </Box>
            </Box>
          ) : (
            <>
              {kid > 0 && KidPrice?.price ? (
                <Box
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  flex={1}>
                  <Box flex={0.5}>
                    <Text variant={'blackshade16400'}>Kid</Text>
                  </Box>
                  <Box flex={0.2}>
                    <Text variant={'blackshade16400'}>{kid} Pax</Text>
                  </Box>
                  <Box flex={0.3}>
                    <Text variant={'blackshade16400'}>
                      RM {KidPrice?.price * kid}.00
                    </Text>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
              {youth > 0 && youthPrice?.price ? (
                <Box
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  flex={1}>
                  <Box flex={0.5}>
                    <Text variant={'blackshade16400'}>Youth</Text>
                  </Box>
                  <Box flex={0.2}>
                    <Text variant={'blackshade16400'}>{youth} Pax</Text>
                  </Box>
                  <Box flex={0.3}>
                    <Text variant={'blackshade16400'}>
                      RM {youthPrice?.price * youth}.00
                    </Text>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
              {adult > 0 && adultPrice?.price ? (
                <Box
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  flex={1}>
                  <Box flex={0.5}>
                    <Text variant={'blackshade16400'}>Adult</Text>
                  </Box>
                  <Box flex={0.2}>
                    <Text variant={'blackshade16400'}>{adult} Pax</Text>
                  </Box>
                  <Box flex={0.3}>
                    <Text variant={'blackshade16400'}>
                      RM {adultPrice?.price * adult}.00
                    </Text>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
              {senior > 0 && seniorPrice?.price ? (
                <Box
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  flex={1}>
                  <Box flex={0.5}>
                    <Text variant={'blackshade16400'}>Senior</Text>
                  </Box>
                  <Box flex={0.2}>
                    <Text variant={'blackshade16400'}>{senior} Pax</Text>
                  </Box>
                  <Box flex={0.3}>
                    <Text variant={'blackshade16400'}>
                      RM {seniorPrice?.price * senior}.00
                    </Text>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
            </>
          )} */}
          <Box
            flexDirection={'row'}
            justifyContent={'space-between'}
            mt={'s'}
            mb={'m'}
            flex={1}>
            <Box flex={0.5}>
              <Text variant={'blackshade112900'}>TOTAL</Text>
            </Box>
            <Box flex={0.2}>
              <Text variant={'blackshade16400'}>{total} Pax</Text>
            </Box>
            <Box flex={0.3}>
              <Text variant={'blackshade16400'}>
                RM {totalAmount?.toFixed(2)}
                {/* {
                (KidPrice?.price || 0) * kid +
                  (youthPrice?.price || 0) * youth +
                  (adultPrice?.price || 0) * adult +
                  (seniorPrice?.price || 0) * senior +
                  (fair_price || 0) * count}
                .00 */}
              </Text>
            </Box>
          </Box>
          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text variant={'blackshade16400'}>Payment method</Text>
            <Text variant={'blackshade16400'}>
              by {methodPay(paymentMethod)?.name}
            </Text>
          </Box>
          <Box
            height={1}
            borderWidth={0.5}
            marginVertical={'l'}
            style={{borderColor: palette?.tertiary1}}></Box>
          <Box mb={'l'}>
            <Text variant="blackshade14500">
              By joining Activity, I’m agreeing with the Refund Policy
            </Text>
          </Box>
          <Box height={45}>
            <Button label="Confirm Join Activity" onPress={handleConfirmJoin} />
          </Box>
        </>
      )}
      <TouchableBox mt={'m'} style={{marginBottom: -10}} onPress={handleClose}>
        <Text textAlign={'center'} variant="placeholder14400">
          Cancel
        </Text>
      </TouchableBox>
    </Box>
  );
};

export default Pricing;
