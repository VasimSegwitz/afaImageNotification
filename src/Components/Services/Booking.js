import {api} from './baseApi';

export const getAvailableCourts = async form => {
  try {
    const {data} = await api.post(
      '/user_api/v1/booking/get_available_courts',
      form,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const LiveAvailability = async form => {
  try {
    const {data} = await api.post(
      '/user_api/v1/booking/live-availability',
      form,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const LockSlot = async form => {
  try {
    const {data} = await api.post('/user_api/v1/booking/lock_slot', form);
    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const createBooking = async form => {
  try {
    const {data} = await api.post('/user_api/v1/booking/create', form);

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

/// Activity APIS

export const createActivity = async form => {
  try {
    const {data} = await api.post('/user_api/v1/activity/create', form);

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const updateActivity = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/update/${form?.id}`,
      form?.body,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const getSearchActivity = async payload => {
  const [_, body] = payload?.queryKey;

  try {
    const {data} = await api.get(`/user_api/v1/activity/search`, {
      params: body,
    });

    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const ReserveSlot = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/reserve_slots/${form.id}`,
      form.body,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const getSingleActivity = async payload => {
  const [_, body] = payload?.queryKey;

  try {
    const {data} = await api.get(`/user_api/v1/activity/${body}`);

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const singleActivity = async id => {
  try {
    const {data} = await api.get(`/user_api/v1/activity/${id}`);

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const getAllCemments = async payload => {
  const [_, body] = payload?.queryKey;
  try {
    const {data} = await api.get(
      `/user_api/v1/activity/comment/${body?.id}?page=${body?.page}&per_page=10`,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const getAllDeals = async payload => {
  const [_, body] = payload?.queryKey;

  try {
    const {data} = await api.get(
      `/user_api/v1/user_deals/gets?page=1&per_page=10&type=${body?.type}`,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const postComment = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/comment/${form.id}`,
      form.body,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const CancelActivity = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/cancel/${form.id}`,
      form.body,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const CancelBookingMutation = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/booking/cancel/${form.id}`,
      form.body,
    );

    return data;
  } catch (error) {
    return Promise.resolve(error?.response);
  }
};

export const requestActivity = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/request/${payload?.id}`,
      payload?.body,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const NotGoingActivity = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/not_going/${payload?.id}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const LeaveActivity = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/not_going/${payload?.id}`,
      payload?.body,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const acceptActivityRequest = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/accept/${payload?.id}/${payload?.userId}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const remindActivity = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/invite_remind/${payload?.id}`,
      payload?.form,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const removeFromActivity = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/remove/${payload?.id}/${payload?.userId}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const attachBooking = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/attach_booking/${payload?.id}/${payload?.booking_id}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const markFullActivity = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/mark_full/${payload.id}`,
      payload?.body,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const uploadActivityCover = async form => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/update_images/${form?.id}`,
      form?.form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const addCoHost = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/add_co_host/${payload?.id}/${payload?.userId}`,
      payload?.body,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const removeCoHost = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/activity/remove_co_host/${payload?.id}/${payload?.userId}`,
      payload?.body,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getUserList = async payload => {
  const [_, body, page] = payload?.queryKey;
  try {
    const {data} = await api.get(`/user_api/v1/activity/search_user/${body}`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

//

export const getBanner = async () => {
  try {
    const {data} = await api.get(`/user_api/v1/banner`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getState = async () => {
  try {
    const {data} = await api.get(`/user_api/v1/sports_complex/get-states`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getCity = async payload => {
  const [_, body] = payload?.queryKey;
  try {
    const {data} = await api.get(
      `/user_api/v1/sports_complex/get-cities/${body}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const autoLighting = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/booking/auto-lighting-scan/${payload?.data}`,
    );
    return data;
  } catch (err) {
    return Promise.reject(error?.response);
  }
};

export const payTheRemaining = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/booking/deposit-wallet-payment/${payload?.booking_id}`,
    );
    return data;
  } catch (err) {
    return Promise.reject(error?.response);
  }
};

export const checkCancel = async payload => {
  try {
    const {data} = await api.post(
      `/user_api/v1/booking/cancel_check/${payload?.booking_id}`,
    );
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getBooking = async payload => {
  const [_, body] = payload?.queryKey;
  try {
    const {data} = await api.get(`/user_api/v1/booking/${body}`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getInsuranceDetails = async () => {
  try {
    const {data} = await api.get(`/user_api/v1/insurance/settings`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const saveInsuranceDetails = async payload => {
  //const [_, body] = payload?.queryKey;

  try {
    const {data} = await api.post(`/user_api/v1/insurance/settings`, {
      ...payload,
    });
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};

export const getAllCountries = async () => {
  try {
    const {data} = await api.get(`/yas/get-countries`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response);
  }
};
