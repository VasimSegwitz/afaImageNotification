export const BookingAutoLightingTypeEnum = item => {
  switch (item) {
    case 'Auto':
      return {
        name: 'Auto',
        value: 1,
      };
    case 'Semi_Auto':
      return {
        name: 'Semi_Auto',
        value: 2,
      };
    case 'Manual':
      return {
        name: 'Manual',
        value: 3,
      };
    case 'Fully_Auto':
      return {
        name: 'Fully_Auto',
        value: 4,
      };
    default:
      break;
  }
};

export const BookingStatusEnum = item => {
  switch (item) {
    case 'Created':
      return {
        name: 'Created',
        value: 1,
      };
    case 'Upcoming':
      return {
        name: 'Upcoming',
        value: 2,
      };
    case 'Completed':
      return {
        name: 'Completed',
        value: 3,
      };
    case 'Cancelled':
      return {
        name: 'Cancelled',
        value: 4,
      };
    default:
      break;
  }
};

export const StatusEnum = item => {
  switch (item) {
    case 'Booked':
      return {
        name: 'Booked',
        value: 1,
      };
    case 'Not_Booked':
      return {
        name: 'Not_Booked',
        value: 2,
      };

    default:
      break;
  }
};

export const getStatusEnum = item => {
  switch (item) {
    case 1:
      return {
        name: 'Booked',
        value: 1,
      };
    case 2:
      return {
        name: 'Not Booked',
        value: 2,
      };

    default:
      break;
  }
};

export const getSkillEnum = item => {
  switch (item) {
    case 1:
      return {
        name: 'Beginner',
        value: 1,
      };
    case 2:
      return {
        name: 'Intermediate',
        value: 2,
      };
    case 3:
      return {
        name: 'Advanced',
        value: 3,
      };

    default:
      break;
  }
};

export const cancelReasonEnum = item => {
  switch (item) {
    case 1:
      return {
        name: 'Insufficient Players',
        value: 1,
      };
    case 2:
      return {
        name: 'Bad Weather',
        value: 2,
      };
    case 3:
      return {
        name: 'No Venue available to book',
        value: 3,
      };

    default:
      break;
  }
};

export const currencyCode = item => {
  switch (item) {
    case 1:
      return {
        name: 'RM',
        value: 1,
      };
    case 2:
      return {
        name: 'SGD',
        value: 2,
      };
  }
};

export const methodPay = item => {
  switch (item) {
    case 1:
      return {
        name: 'Free',
        value: 1,
      };
    case 2:
      return {
        name: 'Cash',
        value: 2,
      };
    case 3:
      return {
        name: 'Wallet',
        value: 3,
      };
  }
};

const selGender = gender => (gender == 1 ? 'Male' : 'Female');

export const selectAgePrice = (item, gender) => {
  const gen = selGender(gender);

  if (item > 18 && item <= 39)
    return {
      name: `Adult (${gen} - 19-39 years old)`,
      value: 19,
    };
  if (item > 12 && item <= 18)
    return {
      name: `Youth (${gen} - 13-18 years old)`,
      value: 18,
    };
  if (item <= 12)
    return {
      name: `Kids (${gen} - below 12 years old)`,
      value: 12,
    };
  if (item > 39)
    return {
      name: `Veteran (${gen} - above 40 years old)`,
      value: 40,
    };
};
