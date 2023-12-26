import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  RefreshControl,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import {getAllCountries} from '../../Services/Booking';
import {displayErrorToast, displaySuccessToast, ios} from '../../../utils';
import {wp} from '../../Helpers/responsive-ratio';

const SelectCountryModal = ({navigation, route}) => {
  const {params} = route;
  const {SelectCountry} = params;
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    //topicRefetch()
  }, []);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    getAllCountries()
      .then(response => {
        if (response.success === 1) {
          const {data} = response;

          //  const { countries } = data
          setCountries(data);
        } else {
          setCountries([]);
        }
      })
      .catch(({error}) => {
        const {message} = error;
        displaySuccessToast(message);
      });
  };

  return (
    <Box flex={1} backgroundColor="transparent">
      <TouchableBox
        flex={0.1}
        onPress={() => {
          navigation.goBack(null);
        }}
      />
      <Box
        flex={1}
        backgroundColor="white"
        borderTopRightRadius={20}
        borderTopLeftRadius={20}>
        <Box
          mt="s"
          width={wp(14)}
          height={4}
          borderRadius={10}
          alignSelf="center"
        />
        <Box marginHorizontal="m" mt="l">
          <Box ml="s" mb="m">
            <Text variant="blackshade16800Semi">Select Country</Text>
          </Box>
          <Box height={1} backgroundColor="tertiary1" marginVertical="s" />
          <FlatList
            style={{marginBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
            data={countries}
            ItemSeparatorComponent={() => {
              return <Box height={1} backgroundColor="tertiary1" />;
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              const {country, code} = item;

              return (
                <TouchableBox
                  flex={1}
                  onPress={() => {
                    navigation.goBack(null);
                    SelectCountry(item);
                  }}
                  flexDirection="row"
                  mt="m"
                  alignItems="center">
                  <Box ml="s" marginVertical="m">
                    <Text variant="blackshade14500">{country}</Text>
                  </Box>
                </TouchableBox>
              );
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  contents: {
    marginVertical: 20,
  },
  grow: {
    backgroundColor: palette.secondary4,
    flexGrow: 1,
  },
});

export default SelectCountryModal;
