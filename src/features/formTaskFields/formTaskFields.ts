import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FormTaskFields = {
  title: string,
  time: string,
  description: string,
}

const initialState: FormTaskFields = {
  title: '',
  time: '09:00',
  description: '',
}

export const formTaskFieldsSlice = createSlice({
  name: 'formtaskfields',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setTime: (state, {payload}: PayloadAction<string>) => {
      state.time = payload;
    },
    setDescription: (state, {payload}: PayloadAction<string>) => {
      state.description = payload;
    }
  }
});

export const { setTitle, setTime, setDescription} = formTaskFieldsSlice.actions;

export const formTaskFieldsReducer = formTaskFieldsSlice.reducer;