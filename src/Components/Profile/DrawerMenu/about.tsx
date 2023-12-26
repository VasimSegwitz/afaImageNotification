import React, {useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import {useQuery} from 'react-query';
import {Header} from '../../ReusableComponents';
import {getVariables} from '../../Services/ProfileApi';
import {Box} from '../../Theme/Index';

const AboutUs = props => {
  const {from, variable} = props?.route?.params;
  const [data, setData] = useState(null);

  const getVariablesQuery = useQuery('getVariables', getVariables, {
    onSuccess(data) {
      setData(
        variable == 'about_us'
          ? data?.data?.about_us
          : variable == 'privacy_policy'
          ? data?.data?.privacy_policy
          : variable == 'terms_condition'
          ? data?.data?.terms_condition
          : variable == 'community_guidelines'
          ? data?.data?.wallet_tnc
          : '',
      );
    },
    onError(err) {},
  });

  useEffect(() => {
    getVariablesQuery.refetch();
  }, []);

  return (
    <Box flex={1} backgroundColor={'white'}>
      <Header title={from} left />
      <Box flex={1}>
        {data != null && (
          <WebView
            useWebKit
            style={{flex: 1, margin: 10}}
            hideKeyboardAccessoryView
            source={{
              html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${data}</body></html>`,
            }}
            showsVerticalScrollIndicator={false}
            originWhitelist={['*']}
          />
        )}
      </Box>
    </Box>
  );
};

export default AboutUs;
