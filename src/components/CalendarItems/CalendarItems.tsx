import { weekDays } from '../../types/constants';
import moment from 'moment';
import { CalendarMonth } from '../CalendarMonth';
import './CalendarItems.scss';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { styled } from '@stitches/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setMonth, setYear } from '../../features/monthAndYear/monthAndYear';

const CalendarInfo = styled('div', {
  paddingInline: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '15px',
});

const Month = styled('div', {
  display: 'flex',
  columnGap: '15px',
});

const MonthAndYear = styled('div', {
  fontWeight: '700',
  fontSize: '18px',
});

const IconsIoIosUp = styled(IoIosArrowUp, IoIosArrowDown, {
  width: '20px',
  height: '20px',
  lineHeight: '20px',
  textAlign: 'center',
  fontWeight: '700',
  cursor: 'pointer',
  backgroundColor: '#ddd',
});

const IconsIoIosDown = styled(IoIosArrowDown, {
  width: '20px',
  height: '20px',
  lineHeight: '20px',
  textAlign: 'center',
  fontWeight: '700',
  cursor: 'pointer',
  backgroundColor: '#ddd',
});

const CalendarContainer = styled('div', {
  width: '100%',
  height: '100vh',
});

const CalendarSheets = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ddd',
});

const CalendarWeekdays = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingBottom: '10px',
  width: '706px',
  margin: 'auto',
});

const CalendarWeekday = styled('span', {
  width: '100%',
  textAlign: 'center',
});

export const CalendarItems = () => {
  const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM'));
  const [currentYear, setCurrentYear] = useState(moment().format('YYYY'));

  // const date = new Date();

  const smth = moment(`${currentMonth} ${currentYear}`).toDate();
  const ddd = new Date(smth);
  console.log(ddd);

  const firstDayOfMonth = new Date(ddd.getFullYear(), ddd.getMonth(), 1);
  const lastDayOfMonth = new Date(ddd.getFullYear(), ddd.getMonth() + 1, 0);

  // const countDaysInMonth: number =
  //   Number(moment(lastDayOfMonth).format('D')) - Number(moment(firstDayOfMonth).format('D')) + 1;

  const countDaysInMonth = lastDayOfMonth.getDate();

  console.log('count', countDaysInMonth);

  const day = moment(firstDayOfMonth).format('ddd');

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      // const prevDate = moment(prevMonth, 'MMMM').subtract(1, 'months');

      // if (prevDate.month() === 11) {
      //   setCurrentYear((prevYear) => moment(prevYear, 'YYYY').subtract(1, 'years').format('YYYY'));
      // }

      const prevDate = moment(`${currentYear}-${prevMonth}`, 'YYYY-MMMM').subtract(1, 'month');

      setCurrentYear(prevDate.format('YYYY'));

      return prevDate.format('MMMM');
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const prevDate = moment(`${currentYear} - ${prevMonth}`, 'YYYY-MMMM').add(1, 'month');

      setCurrentYear(prevDate.format('YYYY'));

      return prevDate.format('MMMM');
    });
  };

  const events = useAppSelector((state) => state.events.events);
  const dispatch = useAppDispatch();
  console.log(events);
  // end to do with events in selected day -> also doing map

  dispatch(setYear(currentYear));
  dispatch(setMonth(currentMonth));

  
  return (
    <>
      {/* <div className="calendar__info"> */}
      <CalendarInfo>
        <Month>
          {/* <div className="month"> */}
          <div onClick={handlePreviousMonth}>
            <IconsIoIosUp>
              <IoIosArrowUp />
            </IconsIoIosUp>
          </div>

          <div onClick={handleNextMonth}>
            <IconsIoIosDown>
              <IoIosArrowDown />
            </IconsIoIosDown>
          </div>
        </Month>

        <MonthAndYear>
          <span>{currentMonth} </span>
          <span>{currentYear} </span>
        </MonthAndYear>
      </CalendarInfo>
      {/* </div> */}
      {/* <h3>Month and year</h3> */}

      <CalendarContainer>
        <CalendarWeekdays>
          {weekDays.map((day) => {
            return (
              <>
                <CalendarWeekday key={day}>{day}</CalendarWeekday>
              </>
            );
          })}
        </CalendarWeekdays>

        <CalendarSheets>
          <CalendarMonth day={day} dayInMonth={countDaysInMonth} />

          {/* {events[day].map((event: Event) => {
            return <div>{event.title}</div>;
          })} */}
        </CalendarSheets>
      </CalendarContainer>
    </>
  );
};
