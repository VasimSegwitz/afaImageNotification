import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Header from '../../../ReusableComponents/Header';
import moment from 'moment';
import {Box, palette, Text, TypographyStyles} from '../../../Theme/Index';
import {LiveAvailability} from '../../../Services/Booking';
import {useMutation} from 'react-query';
import {displayErrorToast} from '../../../../utils';

const CELL_WIDTH = 50;
const CELL_HEIGHT = 56;

const white = '#fff';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  header: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: 'transparent',
    marginLeft: 80,
  },
  identity: {
    position: 'absolute',
    width: 50,
    zIndex: 10,
    marginRight: 10,
  },
  body: {marginLeft: 100},
  cell: {
    margin: 5,
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#FDC9B0',
    borderWidth: 1,
    borderRadius: 16,
    elevation: 7,
  },
  bookedCell: {
    backgroundColor: 'skyblue',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorWhite: {color: 'white'},
  indicatorContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // marginTop: 5,
    marginVertical: 15,
  },
  individualIndiicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  colorBlock: {
    backgroundColor: 'white',
    height: 15,
    width: 15,
    borderRadius: 15,

    marginRight: 5,
    borderWidth: 1,
    borderColor: palette?.primary,
  },
  colorBlock2: {
    backgroundColor: palette?.primary,
    height: 15,
    width: 15,
    borderRadius: 15,

    marginRight: 5,
    borderWidth: 1,
    borderColor: palette?.primary,
  },
});

// class BookingScheduleView extends React.Component {

const BookingScheduleView = props => {
  const {navigation, route} = props;
  const {vanue, selectDate, facility_id} = route?.params;
  const [list, setList] = useState([]);
  const [after, setAfter] = useState([]);

  let headerScrollView = useRef();
  const scrollPosition = new Animated.Value(0);
  const scrollEvent = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollPosition}}}],
    {useNativeDriver: false},
  );

  const numberOfColumns = () => {
    const {slotsArray} = props;

    return 15;
    // return list && Object.keys(list[0]).length;
  };

  const scrollLoad = () => {};

  const handleScrollEndReached = () => {
    // if (!loading) {
    // }
  };

  /**
   * @function getAvilable
   * @description this function will call the getAvailableCourts api
   */

  const LiveAvailable = useMutation('LiveAvailability', LiveAvailability, {
    onSuccess: result => {
      if (result?.success == 1) {
        setList(result?.data);
        const d = result?.data;

        const arrayOfObj = Object.entries(result?.data).map(e => {
          var tod = moment();

          var current = moment(selectDate).format('YYYY-MM-DD');
          // var tod = moment(current + ' ' + '08:00');

          var DateofVanue = moment(current + ' ' + e[0]?.split('-')[0]);

          if (DateofVanue.hour() < 5) {
            DateofVanue.add(1, 'days'); // handle spanning days
          }

          var passed = moment(DateofVanue).isAfter(tod);

          if (passed)
            return {
              name: e[0],
              value: Object.entries(e[1]).map((j, index) => {
                return {
                  court: j[0],
                  booked: j[1],
                };
              }),
            };
        });
        // const oj = Object.entries(arrayOfObj[0]['10:00-10:30']).map(e => ({
        //   [e[0]]: e[1],
        // }));

        setAfter(arrayOfObj?.filter(i => i != undefined));
      } else {
        setAfter([]);

        const key = Object.keys(result?.data?.data)[0];
        displayErrorToast(result?.data?.data[key] || 'No dat avaialble');
        // displayErrorToast(result?.data?.message || 'No dat avaialble');
      }
    },
  });

  useEffect(() => {
    const body = {
      sports_facility_id: facility_id,
      date: moment(selectDate).format('DD-MM-YYYY'),
    };

    LiveAvailable.mutate(body);
  }, []);

  const getCellColor = item => {
    if (item.type === 'user') {
      if (item.ipay_payment_received == 1 || item.is_payment_complete == 1) {
        return palette?.primary;
      } else if (item.split_payment > 0 && item.split_payment_status == 1) {
        return palette?.white;
      } else {
        return palette?.greyText;
      }
    } else {
      if (item.is_payment_complete == 1 || item.link_payment_status == 1) {
        return 'green';
      } else if (item.split_payment > 0 && item.split_payment_status == 1) {
        return 'blue';
      } else {
        return palette?.greyText;
      }
    }
  };

  const formatCol = (value, color, width) => {
    first = value?.includes(' ')
      ? value?.split(' ')[0]
      : value?.includes('-')
      ? value?.split(' ')[0]
      : 'court';
    second = value?.includes(' ')
      ? value?.split(' ')[1]
      : value?.includes('-')
      ? value?.split(' ')[1]
      : value;
    return (
      <View
        key={value}
        style={[
          styles.cell,

          {
            // padding: 5,
            backgroundColor: white,
            width: width || CELL_WIDTH,
            elevation: 0,
            borderColor: 'white',
            alignItems: 'flex-start',
          },
        ]}>
        <Text
          variant={'blackshade112400'}
          style={{textAlign: 'left', color: palette?.blackshade}}
          numberOfLines={2}>
          {first}
        </Text>
        <Text
          variant={'blackshade24500'}
          style={{textAlign: 'left', color: palette?.blackshade}}
          numberOfLines={2}>
          {second}
        </Text>
      </View>
    );
  };

  const formatTime = (value, color, width) => {
    return (
      <View
        key={value}
        style={[
          styles.cell,

          // TypographyStyles.cardShadow,
          {
            shadowColor: '#FDC9B0',
            padding: 2,
            backgroundColor: 'white',
            width: 80,
            // hiight: 100,
            elevation: 80,
            borderLeftColor: 'white',
            borderRightColor: 'white',
            borderTopColor: 'white',
            borderRadius: 1,
          },
        ]}>
        <Text
          variant={'blackshade14400'}
          style={{textAlign: 'left', color: palette?.blackshade}}
          numberOfLines={2}>
          {value}
        </Text>
      </View>
    );
  };

  const formatBookingCell = (key, item, index) => {
    const {onSlotSelected} = props;
    // const it = {
    //   type: 'user',
    //   ipay_payment_received: 1,
    //   is_payment_complete: 0,
    //   split_payment: 1,
    //   split_payment_status: 1,
    // };
    return (
      <View
        key={key}
        style={[
          styles.cell,
          {backgroundColor: !item?.booked ? palette?.primary : palette?.white},
          {width: CELL_WIDTH},
        ]}></View>
    );
  };

  // Appointments
  const formatColumn = section => {
    // Item should be array of bookings for specific Court or table
    let {item, index} = section;
    let cells = [];

    for (let i = 0; i < after?.length; i++) {
      cells.push(formatBookingCell(`$${i}`, after[i].value[index], i));
    }

    return (
      <View style={[styles.column, {marginLeft: index === 0 ? 0 : 0}]}>
        {cells}
      </View>
    );
  };

  const formatHeader = () => {
    let cols = [];
    var len = 15;
    if (list && list.length) {
      const arrayOfObj = Object.entries(list).map(e => ({[e[0]]: e[1]}));
      // const courst = Object.entries(arrayOfObj[0]).map(e => ({[e[0]]: e[1]}));
      var key = Object.keys(arrayOfObj[0]);
      len = Object.keys(arrayOfObj[0][key]).length;
    }
    const columns = len;
    const {slotsArray} = props;
    len = after[0]?.value?.length;

    for (let i = 0; i < len; i++) {
      cols.push(
        formatCol(
          after[0]?.value[i]?.court == i
            ? 'court ' + (i + 1)
            : after[0]?.value[i]?.court,
          'white',
          CELL_WIDTH,
        ),
      );
    }

    return (
      <View
        style={{
          ...styles.header,
          marginLeft: 100,
          backgroundColor: palette?.white,
        }}>
        {/* {this.formatCell('TIME', cellBGColor.time)} */}
        <ScrollView
          ref={headerScrollView}
          horizontal={true}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}>
          {cols}
        </ScrollView>
      </View>
    );
  };
  // Time columns
  const formatIdentityColumn = () => {
    let cells = [];
    const d = Object.keys(list);

    for (let i = 0; i < d?.length; i++) {
      var tod = moment();
      var current = moment(selectDate).format('YYYY-MM-DD');
      var now = new Date();
      // if (DateofVanue?.isAfter(tod))
      // var tod = moment(current + ' ' + '08:00');

      var DateofVanue = moment(current + ' ' + d[i]?.split('-')[0]);

      if (DateofVanue.hour() < 5) {
        DateofVanue.add(1, 'days'); // handle spanning days
      }

      var passed = DateofVanue?.isAfter(tod);
      if (passed)
        cells.push(
          formatTime(
            `${moment(d[i].split('-')[0], 'HH:mm').format('LT')} \n${moment(
              d[i].split('-')[1],
              'HH:mm',
            ).format('LT')}`,
          ),
        );
    }

    return <View style={styles.identity}>{cells}</View>;
  };

  const formatBody = () => {
    let data = [];
    const columns = numberOfColumns();
    const d = Object.keys(list);
    for (let i = 0; i < d.length; i++) {
      data.push({key: `content-${i}`});
    }

    return (
      <View>
        {formatIdentityColumn()}
        {after?.length > 0 ? (
          <FlatList
            style={styles.body}
            horizontal={true}
            data={after[0]?.value}
            renderItem={formatColumn}
            stickyHeaderIndices={[0]}
            onScroll={scrollEvent}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            // extraData={state}
          />
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'white', fontSize: 16}}>
              Loading Schedule..
            </Text>
          </View>
        )}
      </View>
    );
  };

  const formatRowForSheet = section => {
    let {item} = section;
    return item.render;
  };

  useEffect(() => {
    // cosnoel

    listener = scrollPosition.addListener(position => {
      headerScrollView.current?.scrollTo({x: position.value, animated: false});
    });
  }, [scrollPosition]);

  let body = formatBody();

  let data = [{key: 'body', render: body}];

  return (
    <Box flex={1} backgroundColor="white">
      <Header
        title="Booking Schedule"
        left
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.indicatorContainer}>
          <View style={styles.individualIndiicator}>
            <View style={styles.colorBlock} />
            <Text variant={'blackshade14400'}>available slots</Text>
          </View>
          <View style={styles.individualIndiicator}>
            <View style={styles.colorBlock2} />
            <Text variant={'blackshade14400'}>booked slots</Text>
          </View>
        </View>
        {formatHeader()}
        {after?.length > 0 ? (
          <FlatList
            data={data}
            renderItem={formatRowForSheet}
            style={{backgroundColor: palette?.white}}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            // onEndReached={handleScrollEndReached}
            onEndReachedThreshold={0.005}
          />
        ) : (
          <Box flex={1} alignItems="center" justifyContent={'center'}>
            <Text>No Data To Show </Text>
          </Box>
        )}
      </View>
    </Box>
  );
};

export default BookingScheduleView;
// import React, {useEffect} from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   View,
// } from 'react-native';
// import Header from '../../../ReusableComponents/Header';
// import moment from 'moment';
// import {Box, palette, Text, TypographyStyles} from '../../../Theme/Index';

// const CELL_WIDTH = 50;
// const CELL_HEIGHT = 56;

// const white = '#fff';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: white,
//   },
//   header: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderColor: 'transparent',
//     marginLeft: 80,
//   },
//   identity: {
//     position: 'absolute',
//     width: 50,
//     zIndex: 10,
//     marginRight: 10,
//   },
//   body: {marginLeft: 100},
//   cell: {
//     margin: 7,
//     width: CELL_WIDTH,
//     height: CELL_HEIGHT,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     borderColor: '#FDC9B0',
//     borderWidth: 1,
//     borderRadius: 16,
//     elevation: 3,
//   },
//   bookedCell: {
//     backgroundColor: 'skyblue',
//   },
//   column: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   colorWhite: {color: 'white'},
//   indicatorContainer: {
//     flexDirection: 'row',
//     // justifyContent: 'space-around',
//     // marginTop: 5,
//     marginVertical: 15,
//   },
//   individualIndiicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 20,
//   },
//   colorBlock: {
//     backgroundColor: 'white',
//     height: 15,
//     width: 15,
//     borderRadius: 15,

//     marginRight: 5,
//     borderWidth: 1,
//     borderColor: palette?.primary,
//   },
//   colorBlock2: {
//     backgroundColor: palette?.primary,
//     height: 15,
//     width: 15,
//     borderRadius: 15,

//     marginRight: 5,
//     borderWidth: 1,
//     borderColor: palette?.primary,
//   },
// });

// // class BookingScheduleView extends React.Component {

// const BookingScheduleView = props => {
//   const {navigation} = props;

//   let headerScrollView = null;
//   const scrollPosition = new Animated.Value(0);
//   const scrollEvent = Animated.event(
//     [{nativeEvent: {contentOffset: {x: scrollPosition}}}],
//     {useNativeDriver: false},
//   );

//   const numberOfColumns = () => {
//     const {slotsArray} = props;
//     return 10;
//   };

//   const scrollLoad = () => {};

//   const handleScrollEndReached = () => {
//     // if (!loading) {
//     // }
//   };

//   const getCellColor = item => {
//     if (item.type === 'user') {
//       if (item.ipay_payment_received == 1 || item.is_payment_complete == 1) {
//         return palette?.primary;
//       } else if (item.split_payment > 0 && item.split_payment_status == 1) {
//         return palette?.white;
//       } else {
//         return palette?.greyText;
//       }
//     } else {
//       if (item.is_payment_complete == 1 || item.link_payment_status == 1) {
//         return 'green';
//       } else if (item.split_payment > 0 && item.split_payment_status == 1) {
//         return 'blue';
//       } else {
//         return palette?.greyText;
//       }
//     }
//   };

//   const formatCol = (value, color, width) => {
//     return (
//       <View
//         key={value}
//         style={[
//           styles.cell,

//           {
//             // padding: 5,
//             backgroundColor: white,
//             width: width || CELL_WIDTH,
//             // elevation: 80,
//             borderColor: 'white',
//             alignItems: 'flex-start',
//             padding: 5,
//           },
//         ]}>
//         <Text
//           variant={'blackshade112400'}
//           style={{textAlign: 'left', color: palette?.blackshade}}
//           numberOfLines={2}>
//           {value.split('-')[0]}
//         </Text>
//         <Text
//           variant={'blackshade24500'}
//           style={{textAlign: 'left', color: palette?.blackshade}}
//           numberOfLines={2}>
//           {value.split('-')[1]}
//         </Text>
//       </View>
//     );
//   };

//   const formatTime = (value, color, width) => {
//     return (
//       <View
//         key={value}
//         style={[
//           styles.cell,

//           // TypographyStyles.cardShadow,
//           {
//             shadowColor: '#FDC9B0',
//             padding: 2,
//             backgroundColor: 'white',
//             width: 80,
//             // hiight: 100,
//             elevation: 80,
//             borderLeftColor: 'white',
//             borderRightColor: 'white',
//             borderTopColor: 'white',
//             borderRadius: 1,
//           },
//         ]}>
//         <Text
//           variant={'blackshade14400'}
//           style={{textAlign: 'left', color: palette?.blackshade}}
//           numberOfLines={2}>
//           {value}
//         </Text>
//       </View>
//     );
//   };

//   const formatBookingCell = (key, item, index) => {
//     const {onSlotSelected} = props;
//     // const it = {
//     //   type: 'user',
//     //   ipay_payment_received: 1,
//     //   is_payment_complete: 0,
//     //   split_payment: 1,
//     //   split_payment_status: 1,
//     // };
//     return (
//       <View
//         key={key}
//         style={[
//           styles.cell,
//           item?.booked && {backgroundColor: getCellColor(item)},
//           {width: CELL_WIDTH},
//         ]}></View>
//     );
//   };

//   // Appointments
//   const formatColumn = section => {
//     // Item should be array of bookings for specific Court or table
//     let {item, index} = section;
//     let cells = [];

//     for (let i = 0; i < 10; i++) {
//       cells.push(formatBookingCell(`$${i}`, item.slots[i], i));
//     }

//     return (
//       <View style={[styles.column, {marginLeft: index === 0 ? 0 : 0}]}>
//         {cells}
//       </View>
//     );
//   };

//   const formatHeader = () => {
//     let cols = [];
//     const columns = numberOfColumns();
//     const {slotsArray} = props;
//     for (let i = 0; i < columns; i++) {
//       cols.push(formatCol(`court-${i + 1}`, 'white', CELL_WIDTH));
//     }

//     return (
//       <View style={{...styles.header, marginLeft: 100}}>
//         {/* {this.formatCell('TIME', cellBGColor.time)} */}
//         <ScrollView
//           ref={ref => (headerScrollView = ref)}
//           horizontal={true}
//           scrollEnabled={false}
//           showsHorizontalScrollIndicator={false}
//           scrollEventThrottle={16}>
//           {cols}
//         </ScrollView>
//       </View>
//     );
//   };
//   // Time columns
//   const formatIdentityColumn = () => {
//     let cells = [];

//     for (let i = 0; i < 10; i++) {
//       cells.push(
//         formatTime(
//           `${moment().add(i, 'h').format('HH:00')}\n${moment()
//             .add(i + 1, 'h')
//             .format('HH:00')}`,
//         ),
//       );
//     }

//     return <View style={styles.identity}>{cells}</View>;
//   };

//   const formatBody = () => {
//     let data = [];
//     const columns = numberOfColumns();
//     for (let i = 0; i < 10; i++) {
//       data.push({key: `content-${i}`});
//     }

//     return (
//       <View>
//         {formatIdentityColumn()}
//         {true ? (
//           <FlatList
//             style={styles.body}
//             horizontal={true}
//             data={[
//               {
//                 slots: [
//                   ...Array(3).map(x => ({
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   })),
//                   ...Array(3).map(x => ({
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 0,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   })),
//                   {
//                     booked: false,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                   {
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   ...Array(3).map(x => ({
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   })),
//                   ...Array(3).map(x => ({
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 0,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   })),
//                   {
//                     booked: false,
//                     type: 'user',
//                     ipay_payment_received: 0,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                   {
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 0,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   ...Array(3).map(x => ({
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 0,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   })),
//                   ...Array(3).map(x => ({
//                     booked: false,
//                     type: 'user',
//                     ipay_payment_received: 0,
//                     is_payment_complete: 0,
//                     split_payment: 0,
//                     split_payment_status: 1,
//                   })),
//                   {
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 0,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   {
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 0,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   {
//                     booked: false,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   {
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   {
//                     booked: false,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   {
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   {
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//               {
//                 slots: [
//                   {
//                     booked: true,
//                     type: 'user',
//                     ipay_payment_received: 1,
//                     is_payment_complete: 0,
//                     split_payment: 1,
//                     split_payment_status: 1,
//                   },
//                 ],
//               },
//             ]}
//             renderItem={formatColumn}
//             stickyHeaderIndices={[0]}
//             onScroll={scrollEvent}
//             scrollEventThrottle={16}
//             // extraData={state}
//           />
//         ) : (
//           <View
//             style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//             <Text style={{color: 'white', fontSize: 16}}>
//               Loading Schedule..
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   const formatRowForSheet = section => {
//     let {item} = section;
//     return item.render;
//   };

//   useEffect(() => {
//     listener = scrollPosition.addListener(position => {
//       headerScrollView.scrollTo({x: position.value, animated: false});
//     });
//   }, []);

//   let body = formatBody();

//   let data = [{key: 'body', render: body}];

//   return (
//     <Box flex={1} backgroundColor="white">
//       <Header
//         title="Booking Schedule"
//         left
//         onPressLeft={() => navigation.goBack()}
//       />
//       <View style={styles.container}>
//         <View style={styles.indicatorContainer}>
//           <View style={styles.individualIndiicator}>
//             <View style={styles.colorBlock} />
//             <Text variant={'blackshade14400'}>available slots</Text>
//           </View>
//           <View style={styles.individualIndiicator}>
//             <View style={styles.colorBlock2} />
//             <Text variant={'blackshade14400'}>booked slots</Text>
//           </View>
//         </View>
//         {formatHeader()}
//         <FlatList
//           data={data}
//           renderItem={formatRowForSheet}
//           style={{backgroundColor: palette?.white}}
//           contentContainerStyle={{
//             paddingBottom: 20,
//           }}
//           // onEndReached={handleScrollEndReached}
//           onEndReachedThreshold={0.005}
//         />
//       </View>
//     </Box>
//   );
// };

// export default BookingScheduleView;
