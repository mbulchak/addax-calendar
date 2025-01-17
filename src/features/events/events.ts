import { createSlice } from '@reduxjs/toolkit';
import { CalendarEvent } from '../../types/CalendarEvent';
import type { PayloadAction } from '@reduxjs/toolkit';

type EventModal = {
  events: CalendarEvent[];
};

const initialState: EventModal = {
  events: [],
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    addEvent: (state, { payload }: PayloadAction<CalendarEvent>) => {
      state.events.push(payload);
    },
    removeEvent: (state, { payload }: PayloadAction<CalendarEvent>) => {
      state.events = state.events.filter((event: CalendarEvent) => event.id !== payload.id);
    },
    updateEvent: (state, { payload }: PayloadAction<CalendarEvent>) => {
      const eventIndex = state.events.findIndex((event) => event.id === payload.id);

      if (eventIndex !== -1) {
        state.events[eventIndex] = payload;
      }
    },
  },
});

export const { setEvents, addEvent, removeEvent, updateEvent } = eventSlice.actions;

export const eventReducer = eventSlice.reducer;
