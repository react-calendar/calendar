import { useSwiper } from 'swiper/react';
import { useCallback, useMemo } from 'react';

import 'src/styles/layout.scss';
import 'src/styles/day.scss';

interface DayProps {
  showLunar: boolean;
  fold: boolean;
  date: DateFullType;
  select: boolean;
  onDateChange: (value: DateFullType) => void; // 点击回调
  prev: (value: DateFullType) => void; // 点击上月日期回调
  next: (value: DateFullType) => void; // 点击下月日期回调
}

function CalendarDay(props: DayProps) {
  const { date, showLunar, select, fold, onDateChange, prev, next } = props;

  const swiper = useSwiper();

  // 点击日期事件
  const click = useCallback((e: DateFullType) => {
    if (fold) {
      // 当前处于周视图, 不需要滑动
      if (e.state === 'prev') {
        // 点击的是上个月
        prev(e);
      } else if (e.state === 'next') {
        // 点击的是下个月
        next(e);
      } else {
        // 点击的是本月
        onDateChange(e);
      }
    } else {
      // 当前处于月视图
      if (e.state === 'prev') {
        // 点击的是上个月
        swiper.slidePrev();
        prev(e);
      } else if (e.state === 'next') {
        // 点击的是下个月
        swiper.slideNext();
        next(e);
      } else {
        // 点击的是本月
        onDateChange(e);
      }
    }
  }, []);

  const event = useMemo(() => {
    console.log('hello');
    if (date.markers?.schedule) {
      return (
        <div
          className="event"
          style={{ background: date.markers.schedule[0].bgColor }}></div>
      );
    }

    return null;
  }, [date]);

  const corner = useMemo(() => {
    if (date.markers?.corner) {
      return (
        <div
          className="corner"
          style={{
            color: date.markers.corner[0].color,
            background: date.markers.corner[0].bgColor,
          }}>
          {date.markers.corner[0].mark}
        </div>
      );
    }

    return null;
  }, [date]);

  const desc = useMemo(() => {
    if (showLunar) {
      if (date.markers?.holiday) {
        // 有节假日的显示节假日
        return (
          <div
            className="dayCn"
            style={{ color: date.markers.holiday[0].color }}>
            {date.markers!.holiday[0].mark}
          </div>
        );
      } else if (date.lunar!.isTerm) {
        // 有二十四节气的显示二十四节气
        return <div className="dayCn term">{date.lunar!.term}</div>;
      } else {
        // 什么都没有的显示农历
        return <div className="dayCn">{date.lunar!.dayCn}</div>;
      }
    }

    return null;
  }, [showLunar, date]);

  return (
    <div
      className={`column items-center justify-center day__container
        ${fold && 'fold'} ${date.state} ${date.today && 'today'} ${
        select && 'select'
      }`}
      onClick={() => click(date)}>
      {/* 日期 */}
      <div className="day__content">
        <div>{date.day}</div>
        {corner}
      </div>
      {/* 农历 */}
      {desc}
      {/* 事件标记 */}
      {event}
    </div>
  );
}

export default CalendarDay;
