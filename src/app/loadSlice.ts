import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface loadState {
  isLoading: boolean,
}

const initialState: loadState = {
  isLoading: false,
}

const loadSlice = createSlice({
  name: 'load',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = loadSlice.actions

export const selectIsLoading = (state: RootState) => state.load.isLoading

export default loadSlice.reducer;