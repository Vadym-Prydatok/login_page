import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface PaginationState {
  currentPage: number;
}

const initialState: PaginationState = {
  currentPage: 1,
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    incrementPage: (state) => {
      state.currentPage += 1;
    },
    decrementPage: (state) => {
      state.currentPage -= 1;
    },
  },
});

export const { setCurrentPage, incrementPage, decrementPage } = paginationSlice.actions;

export const selectCurrentPage = (state: RootState) => state.pagination.currentPage;

export default paginationSlice.reducer;