import {isArray} from 'lodash';
import {Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {palette} from '../Components/Theme/Index';
import {Images} from '../Constant/Image';

export const imagesUrl = '//url'; // new production

export const displayErrorToast = message =>
  Snackbar.show({
    text: isArray(message) ? message[0] : message,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: palette.red,
    textColor: palette.white,
  });

export const displaySuccessToast = (message, bg) =>
  Snackbar.show({
    text: isArray(message) ? message[0] : message,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: bg ? bg : palette.greyishBrown,
    textColor: palette.white,
  });

export const generateArrayOfYears = () => {
  var max = new Date().getFullYear();
  var min = max - 70;
  var years = [];

  for (var i = max - 12; i > min; i--) {
    years.push({label: i, value: i});
  }
  return years;
};

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export const generateArrayOfDays = () => {
  const d = daysInMonth(new Date().getFullYear(), new Date().getMonth());

  var day = [];
  for (var i = 31; i >= 1; i--) {
    day.push({label: `${i}`, value: i});
  }

  return day?.reverse();
};

export const CodePushKey = {
  codePushAndroidKey: 'n5EcwX6FEloowH9wIZNFcZ2cPCtixx-9r3Bxl',
  codePushIOSKey: '836oyerTKmD9kXvjuFmbl1PzqJfgRuTWFaf4Q',
};

export const getSports = month => {
  var day = [];

  const labels = [
    'Badmindton',
    'Basketball',
    'Football',
    'Volleyball',
    'Handball',
    'Dodgeball',
  ];
  for (var i = 5; i >= 0; i--) {
    day.push({label: `${labels[i]}`, value: Images?.SportIcon, flag: false});
  }

  return day?.reverse();
};

export const getAmountFromPercent = (percent, expectedCost) => {
  if (!percent) return 0;
  const percentageAmount = (expectedCost * percent) / 100;
  return parseFloat(percentageAmount).toFixed(2);
};

export const generateArrayOfMonths = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  var theMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  var max = 12;
  var min = 0;
  var day = [];

  for (var i = min; i < max; i++) {
    day.push({label: `${theMonths[i]}`, value: i + 1});
  }

  return day;
};

export const ios = Platform.OS === 'ios';
