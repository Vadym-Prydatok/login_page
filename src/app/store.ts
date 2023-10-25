import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import paginationReducer from './pageSlice';
import loadReducer from './loadSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    pagination: paginationReducer,
    load: loadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;