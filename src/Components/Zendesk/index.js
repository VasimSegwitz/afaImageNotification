import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {Button, Modal, View} from 'react-native';
import {Header} from '../ReusableComponents';

class ZendeskChat extends Component {
  state = {
    showChat: false,
  };

  chatHTML() {
    const {title, user, zendesk_chat_key} = this.props;

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Chat | ${title}</title>
      <!-- Start of Zendesk Widget script -->
      <script id="ze-snippet"
        src="https://static.zdassets.com/ekr/snippet.js?key=${zendesk_chat_key}"> </script>
      <!-- End of Zendesk Widget script -->
      <style type="text/css">html { background: #fff; }</style>
    </head>
    <body>
     Hi, Click below the icon to start the conversation
    
    <script type="text/javascript">
    
    document.addEventListener( 'DOMContentLoaded', function( event ) {
      
      zE('webWidget', 'prefill', {
        name: { value: "${user.name}", readOnly: true },
        email: { value: "${user.email}", readOnly: true },
        phone: { value: "${user.phone}", readOnly: true }
      });
      // zE('webWidget', 'identify', { name: "${user.name}", email: "${user.email}" });
      zE('webWidget', 'open');
      zE('webWidget:on', 'close', () => window.ReactNativeWebView.postMessage("close"));
    });
    </script>
   
    
    </body>
    
    </html>
`;
  }

  renderChat() {
    const userAgent = 'AFA';

    return (
      <Modal {...this.props} visible={true}>
        <Header left title="Contact Us" />
        <WebView
          useWebKit
          style={{flex: 1, margin: 10}}
          hideKeyboardAccessoryView
          source={{
            html: this.chatHTML(),
            baseUrl: 'https://static.zdassets.com',
          }}
          showsVerticalScrollIndicator={false}
          applicationNameForUserAgent={userAgent}
          onMessage={({nativeEvent}) => {
            nativeEvent.data === 'close' && this.setState({showChat: false});
          }}
          originWhitelist={['*']}
        />
      </Modal>
    );
  }
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Button
          title="Chat with us"
          color="black"
          onPress={() => this.setState({showChat: true})}
        />
        {this.renderChat()}
      </View>
    );
  }
}

ZendeskChat.defaultProps = {
  title: 'Test',
  user: {
    name: 'React UI Kit',
    email: 'contact@react-ui-kit.com',
    phone: '12345678',
  },
  zendesk_chat_key: '6610f933-0123-4503-936c-f985618b7168',
};

export default ZendeskChat;
