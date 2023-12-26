import {applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './RootReducer';

let store;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

store = configureStore(
  {reducer: persistedReducer},
  compose(applyMiddleware(thunk)),
);

const persistor = persistStore(store);

export {store, persistor};
