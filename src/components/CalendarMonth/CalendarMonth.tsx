import { createStitches } from '@stitches/react';
import React, { useState } from 'react';
import { EventModal } from '../EventModal';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CalendarEvent } from '../../types/CalendarEvent';
import { setEvents, updateEvent } from '../../features/events/events';

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

  const daysInMonth = Array.from({ length: dayInMonth }, (_, i) => i + 1);

  const handleTaskClick = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    task: CalendarEvent,
  ) => {
    ev.stopPropagation();

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

  const dispatch = useAppDispatch();

  const handleDragStart = (ev: React.DragEvent, taskId: string) => {
    ev.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (ev: React.DragEvent, day: number, ) => {
    ev.preventDefault();

    const taskId = ev.dataTransfer.getData('taskId');
    const task = events.find((task) => task.id === taskId);

    if (task) {
      if (task.day === day) {
        const taskInd = events.filter((t) => t.day === day).findIndex((t) => t.id === taskId);

        if (taskInd !== -1) {
          const newTaskOrder = handleReorderTasksOnOneCell(events, taskInd, day);

          dispatch(setEvents(newTaskOrder));
        }
      } else {
        const updatedTask = { ...task, day: day };
        dispatch(updateEvent(updatedTask));
      }
    } 
  };

  const handleReorderTasksOnOneCell = (
    tasks: CalendarEvent[],
    taskIndex: number,
    day: number,
  ) => {
    const dayTasks = tasks.filter((task) => (task.day === day));

    const [taskToMove] = dayTasks.splice(taskIndex, 1);

    const newPosition = tasks.length
    console.log(newPosition);

    dayTasks.splice(newPosition, 0, taskToMove);

    const updatedEvents = tasks.map((task) =>
      task.day === day ? dayTasks.find((t) => t.id === task.id) : task,
    );

    return updatedEvents;
  };


  const handleDragOver = (ev: React.DragEvent) => {
    ev.preventDefault();
  };

  /* const handleSortEnd = (dayTasks: CalendarEvent[]) => {
    // Update the events state with the new order of tasks for the specific day
    const updatedEvents = events.map((event) => {
      const updatedTask = dayTasks.find((task) => task.id === event.id);
      return updatedTask ? updatedTask : event;
    });
    dispatch(setEvents(updatedEvents));
  }; */

  return (
    <>
      {showEvent && (
        <EventModal
          setShowEvent={setShowEvent}
          selectedDay={selectedDay}
          selectedTask={selectedTask}
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
              onDrop={(ev) => handleDrop(ev, day)}
              onDragOver={handleDragOver}
            >
              <SpecificDay>
                {day}
                {tasksOnDay.length > 0 && `   ${tasksOnDay.length} card`}
              </SpecificDay>

              <Events>
                {/* <ReactSortable
                  list={tasksOnDay}
                  setList={handleSortEnd}
                >  */}
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
                      draggable
                      onDragStart={(ev) => handleDragStart(ev, task.id)}
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
