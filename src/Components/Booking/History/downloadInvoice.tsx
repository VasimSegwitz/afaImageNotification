import React, { useRef } from 'react'
import { Box, os } from '../../Theme/Index'
import WebView from 'react-native-webview'
import { Header } from '../../ReusableComponents';

const DownloadInvoice = (props) => {
    const { url } = props?.route?.params;
    const webView = useRef(null);

    return (
        <Box flex={1} backgroundColor={'white'}>
            <Header title={'Invoice'} left />
            <WebView
                ref={webView}
                source={{ uri: url }}
                style={{ flex: 1 }}
                scalesPageToFit={os.ios}
                useWebKit={os.ios}
            />
        </Box>
    )
}

export default DownloadInvoice