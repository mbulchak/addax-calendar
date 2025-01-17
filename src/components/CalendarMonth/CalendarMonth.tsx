import { createStitches } from '@stitches/react';
import React, { useState } from 'react';
import { EventModal } from '../EventModal';
import { useAppSelector } from '../../app/hooks';
import { CalendarEvent } from '../../types/CalendarEvent';

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
  width: `calc((${theme.sizes.boxSize} * ${theme.sizes.days}) + (${theme.sizes.gap} * 6))`,

});

type Props = {
  day: string;
  dayInMonth: number;
};

export const CalendarMonth: React.FC<Props> = ({ day, dayInMonth }) => {
  const normalizedDay = day.toLowerCase();
  const [showEvent, setShowEvent] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  //specific event
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);

  console.log('selectedDate', selectedDay);

  const daysInMonth = Array.from({ length: dayInMonth }, (_, i) => i + 1);

  // const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('09:00');

  const handleTaskClick = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    task: CalendarEvent,
  ) => {
    ev.stopPropagation();
    setTitle(task.title);
    setTime(task.time);
    setDescription(task.description);

    setSelectedTask(task);
    setShowEvent(true);
    setSelectedDay(task.day);
  };

  const handleSelectedDay = (day: number) => {
    if (typeof day === 'number') {
      setSelectedDay(day);
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
          selectedDay={selectedDay}
          selectedTask={selectedTask}
          title={title}
          onTitle={setTitle}
          time={time}
          onTime={setTime}
          description={description}
          onDescription={setDescription}
        />
      )}

      <Calendar>
        {daysInMonth.map((day) => {
          const tasksOnDay = events.filter(
            (task: CalendarEvent) => task.day === day && task.month === month && task.year === year,
          );

          return (
            <Day
              onClick={() => {
                handleSelectedDay(day);
              }}
              key={day}
              startDay={normalizedDay}
            >
              <SpecificDay>
                {day}
                {tasksOnDay.length > 0 && `   ${tasksOnDay.length} card`}
              </SpecificDay>

              <Events>
                {/* <ReactSortable list={events} setList={()=>dispatch(setEvents(events))}> */}
                  {tasksOnDay.map((task: CalendarEvent) => {
                   
                    let normalizedTitle: string = '';

                    if (task.title.length > 15) {
                      normalizedTitle = task.title.slice(0, 16) + '...';
                    } else {
                      normalizedTitle = task.title;
                    }

                    return (
                      <EventTitle
                        key={task.id}
                        onClick={(ev) => {
                          handleTaskClick(ev, task);
                        }}
                      >
                        {normalizedTitle}
                      </EventTitle>
                    );
                  })}
                {/* </ReactSortable> */}
              </Events>
            </Day>
          );
        })}
      </Calendar>
    </>
  );
};
