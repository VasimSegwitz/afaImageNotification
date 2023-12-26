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

const Addbutton = props => {
  const {price, onMinus, counter, onPlus, label} = props;

  return (
    <Box
      mt="l"
      justifyContent="space-between"
      flexDirection="row"
      alignItems="center"
      style={{marginBottom: wp(-4)}}
      flex={1}>
      <Box flexDirection="row" alignItems="center" flex={0.7}>
        <Text variant="blackshade16800Regular">{label}</Text>
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
  const [activeWallet, setActiveWallet] = useState(false);
  const total = kid + youth + adult + senior + count;

  const setVanue = authStore(state => state?.setVanue);
  const {vanue} = authStore(state => state?.vanue);

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
      // displayErrorToast(error?.data?.message);
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
    // if (
    //   different_pricing?.length > 0 &&
    //   kid == 0 &&
    //   youth == 0 &&
    //   adult == 0 &&
    //   senior == 0
    // ) {
    //   displayErrorToast('Enter how many person going');
    //   return;
    // }

    // if (fair_price && count == 0) {
    //   displayErrorToast('Enter how many person going');
    //   return;
    // }

    setJoin(true);
  };
  const handleConfirmJoin = () => {
    if (is_wallet_activated == null) {
      setActiveWallet(true);
      setJoin(false);
    } else if (walletBalance >= totalAmount) {
      vanue?.users?.some(item => item?.user_id == id)
        ? goingMutation.mutate({
            id: activity_id,
            body: {
              peoples: total,
            },
          })
        : request({
            id: activity_id,
            body: {
              peoples: total,
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
    data => data?.age == 12 && data?.gender == 1,
  );
  const youthPrice = different_pricing.find(
    data => data?.age == 18 && data?.gender == 1,
  );
  const adultPrice = different_pricing.find(
    data => data?.age == 19 && data?.gender == 1,
  );
  const seniorPrice = different_pricing.find(
    data => data?.age > 19 && data?.gender == 1,
  );
  const KidFemPrice = different_pricing.find(
    data => data?.age == 12 && data?.gender == 2,
  );
  const youthFemPrice = different_pricing.find(
    data => data?.age == 18 && data?.gender == 2,
  );
  const adulFemPrice = different_pricing.find(
    data => data?.age == 19 && data?.gender == 2,
  );
  const seniorFemPrice = different_pricing.find(
    data => data?.age > 19 && data?.gender == 2,
  );
  const totalAmount =
    (KidPrice?.price || 0) * kid +
    (KidFemPrice?.price || 0) * kidFem +
    (youthPrice?.price || 0) * youth +
    (youthFemPrice?.price || 0) * youthFem +
    (adultPrice?.price || 0) * adult +
    (adulFemPrice?.price || 0) * adultFem +
    (seniorPrice?.price || 0) * senior +
    (seniorFemPrice?.price || 0) * seniorFem +
    (fair_price || 0) * count;

  useEffect(() => {
    if (years <= 12) {
      setKid(
        different_pricing.find(data => data.gender == 1 && data?.age == 12)
          ? 1
          : 0,
      );
      setKidFem(
        different_pricing.find(data => data.gender == 2 && data?.age == 12)
          ? 1
          : 0,
      );
    } else if (years > 12 && years <= 18) {
      setYouth(
        different_pricing.find(data => data.gender == 1 && data?.age == 18)
          ? 1
          : 0,
      );
      setYouthFem(
        different_pricing.find(data => data.gender == 2 && data?.age == 18)
          ? 1
          : 0,
      );
    } else if (years > 18 && years <= 39) {
      setAdult(
        different_pricing.find(data => data.gender == 1 && data?.age == 19)
          ? 1
          : 0,
      );
      setAdultFem(
        different_pricing.find(data => data.gender == 2 && data?.age == 19)
          ? 1
          : 0,
      );
    } else if (years > 39) {
      setSenior(
        different_pricing.find(data => data.gender == 1 && data?.age > 19)
          ? 1
          : 0,
      );
      setSeniorFem(
        different_pricing.find(data => data.gender == 2 && data?.age > 19)
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
            onPress={() => navigation?.navigate('Wallet')}
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
                  label="Kid (<12yr)"
                  price={KidPrice?.price}
                  onMinus={() => kid > 0 && setKid(kid - (years <= 12 ? 0 : 1))}
                  onPlus={() => setKid(kid + 1)}
                />
              )}
              {KidFemPrice?.price && (
                <Addbutton
                  counter={kidFem < 10 ? '0' + kidFem : kidFem}
                  label="Kid (<12yr)"
                  price={KidFemPrice?.price}
                  onMinus={() =>
                    kidFem > 0 && setKidFem(kidFem - (years <= 12 ? 0 : 1))
                  }
                  onPlus={() => setKidFem(kidFem + 1)}
                />
              )}

              {/* {KidPrice?.price ? (
                <Box
                  mt="l"
                  justifyContent="space-between"
                  flexDirection="row"
                  alignItems="center"
                  style={{marginBottom: wp(-4)}}
                  flex={1}>
                  <Box flexDirection="row" alignItems="center" flex={0.7}>
                    <Text variant="blackshade16800Regular">
                      {'Kid (<12yr)'}
                    </Text>
                    <Text variant="blackshade116500Regular" ml="s" mr={'xxl'}>
                      RM{KidPrice?.price}/pax
                    </Text>
                  </Box>
                  <Box flexDirection="row" flex={0.3}>
                    <TouchableBox
                      onPress={() =>
                        kid > 0 && setKid(kid - (years <= 12 ? 0 : 1))
                      }>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.Minus}
                        style={{height: 34, width: 34}}
                      />
                    </TouchableBox>
                    <Box backgroundColor="primary3" borderRadius={5}>
                      <Text variant="blackshade18800Regular" m="s">
                        {kid < 10 ? '0' + kid : kid}
                      </Text>
                    </Box>
                    <TouchableBox onPress={() => setKid(kid + 1)}>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.Plus}
                        style={{height: 34, width: 34}}
                      />
                    </TouchableBox>
                  </Box>
                </Box>
              ) : (
                <></>
              )} */}
              {youthPrice?.price ? (
                <Box
                  mt="l"
                  justifyContent="space-between"
                  flexDirection="row"
                  alignItems="center"
                  style={{marginBottom: wp(-4)}}
                  flex={1}>
                  <Box flexDirection="row" alignItems="center" flex={0.7}>
                    <Text variant="blackshade16800Regular">
                      {'Youth (13-18yr)'}
                    </Text>
                    <Text variant="blackshade116500Regular" ml="s" mr={'xxl'}>
                      RM{youthPrice?.price}/pax
                    </Text>
                  </Box>
                  <Box flexDirection="row" flex={0.3}>
                    <TouchableBox
                      onPress={() =>
                        youth > 0 &&
                        setYouth(youth - (years > 12 && years <= 18 ? 0 : 1))
                      }>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.Minus}
                        style={{height: 34, width: 34}}
                      />
                    </TouchableBox>
                    <Box backgroundColor="primary3" borderRadius={5}>
                      <Text variant="blackshade18800Regular" m="s">
                        {youth < 10 ? '0' + youth : youth}
                      </Text>
                    </Box>
                    <TouchableBox onPress={() => setYouth(youth + 1)}>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.Plus}
                        style={{height: 34, width: 34}}
                      />
                    </TouchableBox>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
              {adultPrice?.price ? (
                <Box
                  mt="l"
                  justifyContent="space-between"
                  flexDirection="row"
                  alignItems="center"
                  style={{marginBottom: wp(-4)}}
                  flex={1}>
                  <Box flexDirection="row" alignItems="center" flex={0.7}>
                    <Text variant="blackshade16800Regular">
                      {'Adult (19-40)'}
                    </Text>
                    <Text
                      variant="blackshade116500Regular"
                      ml="s"
                      style={{marginRight: wp(24)}}>
                      RM{adultPrice?.price}/pax
                    </Text>
                  </Box>
                  <Box flexDirection="row" flex={0.3}>
                    <TouchableBox
                      onPress={() =>
                        adult > 0 &&
                        setAdult(adult - (years > 18 && years <= 39 ? 0 : 1))
                      }>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.Minus}
                        style={{height: 34, width: 34}}
                      />
                    </TouchableBox>
                    <Box backgroundColor="primary3" borderRadius={5}>
                      <Text variant="blackshade18800Regular" m="s">
                        {adult < 10 ? '0' + adult : adult}
                      </Text>
                    </Box>
                    <TouchableBox onPress={() => setAdult(adult + 1)}>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.Plus}
                        style={{height: 34, width: 34}}
                      />
                    </TouchableBox>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
              {seniorPrice?.price ? (
                <Box
                  mt="l"
                  justifyContent="space-between"
                  flexDirection="row"
                  alignItems="center"
                  flex={1}>
                  <Box flexDirection="row" alignItems="center" flex={0.7}>
                    <Text variant="blackshade16800Regular">
                      {'Senior (>40yr)'}
                    </Text>
                    <Text
                      variant="blackshade116500Regular"
                      ml="s"
                      style={{marginRight: wp(4.5)}}>
                      RM{seniorPrice?.price}/pax
                    </Text>
                  </Box>
                  <Box flexDirection="row" flex={0.3}>
                    <TouchableBox
                      onPress={() =>
                        senior > 0 && setSenior(senior - (years > 39 ? 0 : 1))
                      }>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.Minus}
                        style={{height: 34, width: 34}}
                      />
                    </TouchableBox>
                    <Box backgroundColor="primary3" borderRadius={5}>
                      <Text variant="blackshade18800Regular" m="s">
                        {senior < 10 ? '0' + senior : senior}
                      </Text>
                    </Box>
                    <TouchableBox onPress={() => setSenior(senior + 1)}>
                      <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.Plus}
                        style={{height: 34, width: 34}}
                      />
                    </TouchableBox>
                  </Box>
                </Box>
              ) : (
                <></>
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
          )}
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
                RM{' '}
                {(KidPrice?.price || 0) * kid +
                  (youthPrice?.price || 0) * youth +
                  (adultPrice?.price || 0) * adult +
                  (seniorPrice?.price || 0) * senior +
                  (fair_price || 0) * count}
                .00
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
