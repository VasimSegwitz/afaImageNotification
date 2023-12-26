import React, {useEffect, useState} from 'react';
import {FlatList, Image, RefreshControl, Keyboard} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Header, LoadingOverlay} from '../../../ReusableComponents';
import {Ionicon} from '../../../ReusableComponents/Icons';
import {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import {useQuery} from 'react-query';
import {getAllCemments, postComment} from '../../../Services/Booking';
import {displayErrorToast} from '../../../../utils';
import authStore from '../../../../Zustand/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-gesture-handler';
import {useMutation} from 'react-query';
import moment from 'moment';
import CommentsItem from './CommentsItem';

export default props => {
  const {navigation} = props;
  const inset = useSafeAreaInsets();
  const {vanue} = authStore(state => state?.vanue);
  const setVanue = authStore(state => state?.setVanue);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    navigation.setParams({refresh: refresh});
  }, []);

  const refresh = () => {
    setPage(1);
    setTimeout(() => {
      getComments?.refetch();
    }, 500);
  };

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getComments = useQuery(
    ['getAllCemments', {id: vanue?.id, page: page}],
    getAllCemments,
    {
      onSuccess: data => {
        setLoading(false);
        setComments(page === 1 ? data?.data : [...comments, ...data?.data]);
        setTotalComments(data?.total_items);
      },
      onError: error => {
        setLoading(false);
        displayErrorToast(error?.data?.message);
      },
    },
  );

  /**
   * @function mutate
   * @description login mutation of the login api
   */

  const {isLoading, mutate} = useMutation('comment', postComment, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        setLoading(false);
        displayErrorToast(data?.data?.message || 'Something went wrong');
      }
      if (data?.success == 1) {
        setLoading(true);
        setComments([]);
        setPage(1);
        setTimeout(() => {
          getComments?.refetch();
        }, 500);
        setComment('');
      }
    },
    onError: error => {
      setLoading(false);
    },
  });

  const send = () => {
    if (comment.trim() === '') {
      displayErrorToast('Please enter comment');
    } else {
      let newObj = {};
      newObj.id = vanue?.id;
      newObj.body = {
        message: comment,
      };
      Keyboard?.dismiss();
      setLoading(true);
      mutate(newObj);
    }
  };

  const handleLoadMore = () => {
    if (parseInt(totalComments) !== parseInt(comments.length)) {
      setPage(page + 1);
    }
  };

  return (
    <Box flex={1} pt="l">
      <FlatList
        data={comments}
        renderItem={({item}) => {
          return <CommentsItem item={item} />;
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              if (page === 1) {
                getComments?.refetch();
              } else {
                setLoading(true);
                setComments([]);
                setPage(1);
                setTimeout(() => {
                  getComments?.refetch();
                }, 500);
              }
            }}
          />
        }
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.9}
        onEndReached={handleLoadMore}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={() => {
          return (
            <Box flex={1} justifyContent="center" alignItems="center">
              {!loading ? <Text>No Comments</Text> : null}
            </Box>
          );
        }}
      />

      <Box
        paddingVertical={'m'}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        minHeight={62}
        style={[{marginBottom: inset?.bottom}, TypographyStyles?.cardShadow]}
        backgroundColor="white">
        <TextInput
          placeholderTextColor={palette?.placeholder}
          onChangeText={text => {
            setComment(text);
          }}
          multiline={true}
          value={comment}
          placeholder="Write anything to comment...."
          style={{
            color: palette?.blackshade,
            paddingLeft: 10,
            width: size.width / 1.3,
            marginHorizontal: 20,
            minHeight: 36,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: palette.placeholder,
          }}
        />
        <TouchableBox
          onPress={send}
          alignItems="center"
          justifyContent="center"
          mr="l">
          <Image source={Images?.Send} style={{height: 34, width: 34}} />
        </TouchableBox>
      </Box>

      {loading ? <LoadingOverlay /> : null}
    </Box>
  );
};
