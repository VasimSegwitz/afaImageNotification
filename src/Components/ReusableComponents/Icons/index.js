import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {wp} from '../../Helpers/responsive-ratio';
import theme from '../../Theme/Index';
import {CallNow} from '../CallTel';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {styles} from './styles';

export const Call = (
  phone,
  name = 'call',
  size = wp(5),
  color = theme.colors.blackshade,
) => {
  return <MaterialIcons name={name} size={size} color={color} />;
};

export const feather = (name, size = wp(5), color) => {
  return <Feather name={name} size={size} color={color} />;
};

export const Down = (name, size = wp(5), color) => {
  return <FontAwesome name={name} size={size} color={color} />;
};

export const Ionicon = (name, size = wp(5), color) => {
  return <Ionicons name={name} size={size} color={color} />;
};

export const EntypoIcon = (name, size = wp(5), color) => {
  return <Entypo name={name} size={size} color={color} />;
};

export const Back = (name, size = wp(5), color) => {
  return (
    <Fontisto name={name} size={size} color={color} style={styles.backIcon} />
  );
};

export const FontistoIcon = (name, size = wp(5), color) => {
  return (
    <Fontisto name={name} size={size} color={color} style={styles.backIcon} />
  );
};

export const SimpleLineIcon = (name, size = wp(5), color) => {
  return (
    <SimpleLineIcons
      name={name}
      size={size}
      color={color}
      style={styles.backIcon}
    />
  );
};

export const BackSpace = (name, size = wp(5), color) => {
  return (
    <AntDesign
      name={'arrowleft'}
      size={wp(6)}
      color={color}
      // style={styles.backIcon}
    />
  );
};

export const EvilIcon = (name, size = wp(5), color) => {
  return <EvilIcons name={name} size={size} color={color} />;
};

export const AntDesignIcon = (name, size = wp(5), color) => {
  return <AntDesign name={name} size={size} color={color} />;
};
