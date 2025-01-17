import { styled } from '@stitches/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addEvent, updateEvent } from '../../features/events/events';
import { CalendarEvent } from '../../types/CalendarEvent';
import { setDescription, setTime, setTitle } from '../../features/formTaskFields/formTaskFields';

/* const EventContainer = styled('div', {
  position: 'absolute',
  backgroundColor: '#9a9a9a',
  width: '250px',
  height: '300px',
}); */

const EventForm = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',

  position: 'absolute',
  backgroundColor: '#9a9a9a',
  padding: '15px',
});

const EventHeader = styled('label', {
  color: 'white',
  fontSize: '18px',
  textAlign: 'center',
});

const EventContainerButtons = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '5px',
});

const EventClose = styled('button', {
  // display:
  position: 'absolute',
  top: 0,
  right: 0,
});

type Props = {
  setShowEvent: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDay: null | number;
  selectedTask: CalendarEvent | null;
};

export const EventModal: React.FC<Props> = ({ setShowEvent, selectedDay, selectedTask }) => {
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [time, setTime] = useState('09:00');

  const dispatch = useAppDispatch();
  const month = useAppSelector((state) => state.monthAndYear.month);
  const year = useAppSelector((state) => state.monthAndYear.year);
  const title = useAppSelector((state) => state.formTaskFields.title);
  const time = useAppSelector((state) => state.formTaskFields.time);
  const description = useAppSelector((state) => state.formTaskFields.description);

  /* 
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent?.description);
      setTime(selectedEvent.time);
    } else {
      setTitle('');
      setDescription('');
      setTime('09:00');
    }
  }, [selectedEvent]);
  */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleUpdateTask = () => {
    handleSubmit;

    if (selectedTask) {
      const eventData: CalendarEvent = {
        ...selectedTask,
        id: selectedTask.id,
        title,
        time,
        description,
      };

      dispatch(updateEvent(eventData));
    }

    dispatch(setTitle(''));
    dispatch(setTime('09:00'));
    dispatch(setDescription(''));

    setShowEvent(false);
  };

  const handleAddTask = () => {
    handleSubmit;

    /* 
    if (selectedDay && title) {
      const eventData: CalendarEvent = {
        id: selectedEvent ? selectedEvent.id : new Date(),
        title,
        time,
        description,
        day: selectedDay,
        year,
        month,
      };

      if (selectedEvent) {
        dispatch(updateEvent(eventData));
      } else {
        dispatch(addEvent(eventData));
      }
    } */

    if (selectedDay && title) {
      const eventData: CalendarEvent = {
        id: new Date().toISOString(),
        title: title,
        time,
        description,
        day: selectedDay,
        year,
        month,
      };

      dispatch(setTitle(''));
      dispatch(setTime('09:00'));
      dispatch(setDescription(''));
      dispatch(addEvent(eventData));
    }

    setShowEvent(false);
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const handleTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTime(event.target.value));
  };

  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setDescription(event.target.value));
  };

  return (
    <EventForm>
      <EventClose onClick={() => setShowEvent(false)}>x</EventClose>

      <EventHeader>{selectedTask ? 'Edit event' : 'Add event'}</EventHeader>

      <label htmlFor="modal__title">Title</label>
      <input id="modal__title" value={title} onChange={handleTitle} />

      <label htmlFor="modal__time-picker">Time</label>
      <input id="modal__time-picker" type="time" value={time} onChange={handleTime} />

      <label htmlFor="modal__description">Description</label>
      <textarea id="modal__description" value={description} onChange={handleDescription}></textarea>

      <EventContainerButtons>
        <button type="submit" onClick={selectedTask ? handleUpdateTask : handleAddTask}>
          {selectedTask ? 'Update' : 'Save'}
        </button>

        <button
          onClick={() => {
            setShowEvent(false);
          }}
        >
          Cancel
        </button>
      </EventContainerButtons>
    </EventForm>
  );
};
