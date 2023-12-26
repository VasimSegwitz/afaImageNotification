import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import {persist} from 'zustand/middleware';

const authStore = create(
  persist(
    set => ({
      token: '',
      fcmToken: '',
      readCount: '',
      welcome: false,
      gotmsg: '',
      greeting: false,
      vanue: {},
      is_link: false,
      badge: undefined,
      askLoc: false,

      tooltip: {
        search: false,
        firstSearch: false,
        second: false,
        wallet: false,
      },

      setToken: data =>
        set(state => {
          return {
            token: data,
          };
        }),
      setGotmsg: data =>
        set(state => {
          return {
            gotmsg: data,
          };
        }),
      setAskLoc: data =>
        set(state => {
          return {
            askLoc: data,
          };
        }),
      setBadge: data =>
        set(state => {
          return {
            badge: data,
          };
        }),
      setVanue: data =>
        set(state => {
          return {
            vanue: data,
          };
        }),
      setlink: data =>
        set(state => {
          return {
            is_link: data,
          };
        }),
      setTooltip: data =>
        set(state => {
          return {
            tooltip: data,
          };
        }),
      setWelcome: data =>
        set(state => {
          return {
            welcome: data,
          };
        }),
      setGreeting: data =>
        set(state => {
          return {
            greeting: data,
          };
        }),
      setFcmToken: data =>
        set(state => {
          return {
            fcmToken: data,
          };
        }),
      setReadCount: data =>
        set(state => {
          return {
            readCount: data,
          };
        }),
    }),
    {
      name: 'user', // unique name
      getStorage: () => AsyncStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);
export default authStore;
