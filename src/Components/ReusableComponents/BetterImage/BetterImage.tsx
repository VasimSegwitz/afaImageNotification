import React, {Component} from 'react';

import FastImage from 'react-native-fast-image';

import Shimmer from '../Shimmer/Shimmer';
import {Box} from '../../Theme/Index';

class LazyImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  render() {
    const {source, style, resizeMode, ...rest} = this.props;
    const {isLoaded} = this.state;

    return (
      <Box>
        <Shimmer
          visible={isLoaded}
          height={style.height}
          width={style.width}
          borderRadius={style?.borderRadius || 0}
          style={!isLoaded ? style : {}}>
          <FastImage
            source={source}
            style={style}
            resizeMode={resizeMode}
            onLoadStart={() => this.setState({isLoaded: false})}
            onLoadEnd={() => this.setState({isLoaded: true})}
            {...rest}
          />
        </Shimmer>
      </Box>
    );
  }
}

export default LazyImage;
