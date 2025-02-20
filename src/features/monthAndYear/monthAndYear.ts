import { createSlice } from '@reduxjs/toolkit';

type MonthAndYear = {
  month: number;
  year: number;
};

const initialState: MonthAndYear = {
  month: 0,
  year: 0,
};

export const MonthAndYearSlice = createSlice({
  name: 'monthandyear',
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setMonth: (state, action) => {
      state.month = action.payload;
    },
  },
});

export const {setYear, setMonth} = MonthAndYearSlice.actions;

export const monthAndYearReducer = MonthAndYearSlice.reducer;
