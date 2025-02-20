import { configureStore } from "@reduxjs/toolkit";
import { eventReducer } from "../features/events/events";
import { monthAndYearReducer } from "../features/monthAndYear/monthAndYear";
import { formTaskFieldsReducer } from "../features/formTaskFields/formTaskFields";

export const store = configureStore({
  reducer: {
    events: eventReducer,
    monthAndYear: monthAndYearReducer,
    formTaskFields: formTaskFieldsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
