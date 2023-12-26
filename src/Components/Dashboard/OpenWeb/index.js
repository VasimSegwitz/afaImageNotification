import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {Header} from '../../ReusableComponents';
import {Box, Text} from '../../Theme/Index';
import {styles} from './styles';
import WebView from 'react-native-webview';
import {ios} from '../../../utils';

// import FileViewer from 'react-native-file-viewer';

const OpenWeb = ({navigation, route}) => {
  // useEffect(async () => {
  //   // await FileViewer.open(source);
  // }, [source]);

  const {url} = route?.params;

  return (
    <Box style={styles.container}>
      <Header
        title={'Back'}
        left
        navigation={navigation}
        containerStyle={{paddingVertical: 20}}
      />
      <WebView
        source={{
          uri: url,
        }}
        userAgent={undefined}
        onLoadComplete={(numberOfPages, filePath) => {}}
        // onPageChanged={(page,numberOfPages) => {
        // }}
        // onError={(error) => {

        // }}
        // onPressLink={(uri) => {
        // }}
        style={styles.pdf}
      />
    </Box>
  );
};

export default OpenWeb;
