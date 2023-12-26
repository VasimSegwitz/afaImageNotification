import moment from 'moment';

/**
 * @function timeSlotDuration
 * @param facility
 * @description Returns time slot duration time based on facility settings
 */
export const timeSlotDuration = facility => {
  // removed 60 min as 30 min booking check is only for user
  //const thirtyMinWindow = facility['30min_window'];
  const {even_number_hour} = facility;
  // return even_number_hour ? 120 : thirtyMinWindow ? 30 : 60;
  return even_number_hour ? 120 : 30;
};

const courtBasedBookingObject = arrBookings => {
  if (!arrBookings || arrBookings.length === 0) {
    return {};
  }

  const bookings = {};
  arrBookings.forEach(element => {
    const {courts} = element;
    courts.forEach(court_no => {
      let array = bookings[court_no];
      if (!array) {
        array = [];
        bookings[court_no] = array;
      }
      array.push({...element, court_no});
    });
  });
  return bookings;
};

const getBookedSlot = (slot, arrBookings, timingArray) => {
  if (!arrBookings || arrBookings.length === 0) {
    return null;
  }
  // Compare slot.time with booking contains in arrBookings start and end time
  // FIXED: 11:30 to 1:30 am not showing slots
  const openingSlotFacility = timingArray.length > 0 && timingArray[0];
  const openingTime = moment(openingSlotFacility.time, 'HH:mm');
  const bookedSlot = arrBookings.find(booking => {
    let localSlotTime = moment(slot.time, 'HH:mm');
    const {start, end, no_of_hours} = booking;
    let startTime = moment(start, 'HH:mm');
    // let endTime = moment(start, 'HH:mm').add(no_of_hours, 'hours');
    let endTime = moment(end === '00:00' ? '23:59' : end, 'HH:mm');

    //When time crosses 12 midnight we need to add one day in starttime and endtime
    if (startTime.hour() >= 0 && startTime.hour() < openingTime.hour()) {
      startTime.add(1, 'days');
    }
    if (endTime.hour() >= 0 && endTime.hour() < openingTime.hour()) {
      endTime.add(1, 'days');
    }
    // When time crosses 12 midnight we need to add one day in slottime
    if (
      localSlotTime.hour() >= 0 &&
      localSlotTime.hour() < openingTime.hour()
    ) {
      localSlotTime.add(1, 'days'); // handle spanning days endTime
    }
    return localSlotTime.isBetween(startTime, endTime, null, '[)');
  });
  return bookedSlot;
};

const buildFacilityBookingSlots = (facility, arrBookings, timingArray) => {
  const bookings = courtBasedBookingObject(arrBookings);
  const number_of_courts = facility.courts.length;
  const slotsArray = [];
  // Create empty slots array
  for (let index = 0; index < number_of_courts; index++) {
    slotsArray.push({title: facility.courts[index], slots: []});
  }
  timingArray.forEach(slot => {
    for (let index = 0; index < number_of_courts; index++) {
      const objSlots = slotsArray[index];
      const court_no = objSlots.title;
      const courtBookings = bookings[court_no];
      const courtArray = objSlots.slots;
      let bookedSlot = getBookedSlot(slot, courtBookings, timingArray);
      if (bookedSlot) {
        courtArray.push({...bookedSlot, ...slot, booked: true});
      } else {
        courtArray.push({court_no, ...slot, booked: false});
      }
    }
  });
  return slotsArray;
};

/**
 * @function buildFacilityTimingSlots
 * @param facility
 * @param date
 * @description Create time slots for facility and date selected
 */
export const buildFacilityTimingSlots = (arrBookings, date) => {
  //   const {timings} = facility;
  //   let priceArray = [];
  //   timings.forEach(timing => {
  //     const {days, prices} = timing;
  //     if (isDayIncludedForDate(date, days)) {
  //       priceArray = [...priceArray, ...prices];
  //     }
  //   });
  //   const slotDuration = 30; // timeSlotDuration(facility);
  //   let timingArray = [];
  //   priceArray.forEach(price => {
  //     const slots = buildTimeSlots(price, slotDuration);
  //     timingArray = [...timingArray, ...slots];
  //   });
  const slotsArray = buildFacilityBookingSlots(
    // facility,
    arrBookings,
    timingArray,
  );
  return {timingArray, slotsArray};
};

const isDayIncludedForDate = (date, days) => {
  // We need to check for days first here with date. If its allows only then
  // we will proceed further else retrun empty array
  let day = date.getDay();
  if (day == 0) {
    day = 7;
  }
  // We day for current selected date doesn't contains day then we should not
  // continue and simply return empty array
  return days.some(element => element == day);
};

/**
 * @function buildTimeSlots
 * @param timeSlot
 * @param slotDuration
 * @description Take time slot object. Create and return time slot array from it.
 */
const buildTimeSlots = (timeSlot, slotDuration) => {
  const {price} = timeSlot;
  let loopTime = timeSlot.start_time;
  const loopEndtime = timeSlot.end_time;
  let queue = [];
  while (loopTime != loopEndtime) {
    const endtime = moment(loopTime, 'HH:mm')
      .add(slotDuration, 'minutes')
      .format('HH:mm');
    // push time to array
    queue.push({time: loopTime, price, endtime});
    // increment time
    loopTime = endtime;
  }
  return queue;
};

export const formatDate = (date, format) => {
  if (!date || !format) return null;

  return moment(date).format(format);
};
