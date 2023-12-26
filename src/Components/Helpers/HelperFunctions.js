import moment from 'moment';

export const facilityPrice = description => {
  let hour = description?.lastIndexOf('hour') + 4;
  let hr = description?.lastIndexOf('hr') + 2;
  let Hour = description?.lastIndexOf('Hour') + 4;

  return Math.max(hour, hr, Hour);
};

const days = item => {
  const dayOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'Public Holiday',
  ];

  return dayOfWeek[item];
};

const pricelist = (price, day, currency) => {
  return price?.map(item => {
    let d = moment(item?.start_time, 'HH:mm');
    return (
      day +
      ' : ' +
      item?.start_time +
      ' - ' +
      d.add(item?.no_of_hours, 'h').format('HH:00') +
      // (item?.min_booking_hour == 1 ? '1 hr' : item?.min_booking_hour + ' hrs') +
      (currency == 1 ? ' (RM' : ' (SGD') +
      item?.default +
      '/' +
      'hr)' +
      '\n'
    );
  });
};

const Pricing = (timings, currency) => {
  return timings?.map(item => {
    const d =
      item?.days.length < 2
        ? days(Math.min(...item?.days))
        : days(Math.min(...item?.days)) +
          ' to ' +
          days(Math.max(...item?.days));
    return pricelist(item?.prices, d, currency);
  });
};

export const PriceListing = (timings, currency) => {
  const pricingLi = Pricing(timings, currency);
  const pricenow = pricingLi.flat();
  return [...new Set(pricenow)];
};

export function dateDifference(startDate, endDate) {
  let temp = moment(endDate).diff(moment(startDate), 'm');
  var hours = temp / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return Math.sign(rhours) == -1 ? '00' : rhours + ':' + rminutes + '';
}

export function goingUser(gouser) {
  return (
    gouser &&
    gouser.reduce(function (acc, obj) {
      // if (obj.num_going == 0 && obj?.num_going !== null)
      return (
        acc +
        (obj?.num_going_data && obj?.num_going_data?.length
          ? obj?.num_going_data?.reduce((i, j) => i + j?.count, 0)
          : obj.num_going == 0
          ? 1
          : obj?.num_going)
      );
    }, 0)
  );
}
