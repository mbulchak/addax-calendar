import { createStitches } from '@stitches/react';
import React, { useState } from 'react';
import { EventModal } from '../EventModal';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CalendarEvent } from '../../types/CalendarEvent';
import { setDescription, setTime, setTitle } from '../../features/formTaskFields/formTaskFields';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { setEvents } from '../../features/events/events';

const { styled, theme } = createStitches({
  theme: {
    sizes: {
      boxSize: '100px',
      gap: '1px',
      days: 7,
    },

    startDay: {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    },
  },
});

const startDays = Object.entries(theme.startDay);

const Day = styled('div', {
  width: '$boxSize',
  height: '$boxSize',
  backgroundColor: '#eee',
  border: '1px solid black',
  fontFamily: 'Arial, sans-serif',
  fontSize: '18px',
  padding: '5px',

  display: 'flex',
  flexDirection: 'column',

  cursor: 'pointer',

  // '&::before': {
  //   content: 'attr(data-day)',
  // },

  /*  '&:nth-child(n+28):nth-child(-n+31)': {
    display: 'none',
    }, */

  variants: {
    startDay: Object.fromEntries(
      startDays.map(([name, value]) => [
        name,
        {
          '&:first-child': {
            marginLeft: `calc((${theme.sizes.gap} + ${theme.sizes.boxSize}) * ${value})`,
          },
        },
      ]),
    ),
  },
});

const SpecificDay = styled('span', {
  display: 'flex',
});

const EventTitle = styled('div', {
  backgroundColor: 'White',
  cursor: 'pointer',

  '&.dragging': {
    cursor: 'grabbing',
  },
});

const Events = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const Calendar = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.sizes.gap,
  // width: (+boxSize * +days) + (+gap * 6),
  width: `calc((${theme.sizes.boxSize} * ${theme.sizes.days}) + (${theme.sizes.gap} * 6))`,

  /* [`& ${Day}`]: {
    width: '$boxSize',
    height: '$boxSize',
  }, */
});

type Props = {
  day: string;
  dayInMonth: number;
};

export const CalendarMonth: React.FC<Props> = ({ day, dayInMonth }) => {
  const normalizedDay = day.toLowerCase();
  const [showEvent, setShowEvent] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  //specific event
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);

  console.log('selectedDate', selectedDate);

  const daysInMonth = Array.from({ length: dayInMonth }, (_, i) => i + 1);

  const dispatch = useAppDispatch();

  const handleTaskClick = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    task: CalendarEvent,
  ) => {
    ev.stopPropagation();

    dispatch(setTitle(task.title));
    dispatch(setTime(task.time));
    dispatch(setDescription(task.description));

    setSelectedTask(task);
    setShowEvent(true);
    setSelectedDate(task.day);
  };

  const handleSelectedDay = (day: number) => {
    if (typeof day === 'number') {
      setSelectedDate(day);
      setShowEvent(true);
      setSelectedTask(null);
    }
  };

  const events = useAppSelector((state) => state.events.events);
  const month = useAppSelector((state) => state.monthAndYear.month);
  const year = useAppSelector((state) => state.monthAndYear.year);

  return (
    <>
      {showEvent && (
        <EventModal
          setShowEvent={setShowEvent}
          selectedDay={selectedDate}
          selectedTask={selectedTask}
        />
      )}

      <Calendar>
        
          {daysInMonth.map((day) => {
            const tasksOnDay = events.filter(
              (task: CalendarEvent) =>
                task.day === day && task.month === month && task.year === year,
            );

            return (
              <Day
                onClick={() => {
                  handleSelectedDay(day);
                }}
                key={day}
                startDay={normalizedDay} /* monthLength={dayInMonth} */
              >
                <SpecificDay>
                  {day}
                  {tasksOnDay.length > 0 && `   ${tasksOnDay.length} card`}
                </SpecificDay>

                <Events >
                  {tasksOnDay.map((event: CalendarEvent) => {
                  /*   if (!event.id) {
                      return null;
                    } */

                    let normalizedTitle: string = '';

                    if (event.title.length > 15) {
                      normalizedTitle = event.title.slice(0, 16) + '...';
                    } else {
                      normalizedTitle = event.title;
                    }

                    return (
                      <EventTitle
                        
                        key={event.id}
                        onClick={(ev) => {
                          handleTaskClick(ev, event);
                        }}
                      >
                        {normalizedTitle}
                      </EventTitle>
                    );
                  })}
                </Events>
              </Day>
            );
          })}
      </Calendar>
    </>
  );
};
