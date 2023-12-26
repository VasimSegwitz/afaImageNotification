import { StyleSheet } from 'react-native';
import { wp } from '../../Helpers/responsive-ratio';

const styles = StyleSheet.create({
  filter: {
    marginRight: wp(5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmationModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: wp(50),
    marginHorizontal: wp(4),
    borderRadius: 10
  }
});

export default styles;
