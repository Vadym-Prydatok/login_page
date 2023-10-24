import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import paginationReducer from './pageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    pagination: paginationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;