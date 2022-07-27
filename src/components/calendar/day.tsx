import { useSwiper } from 'swiper/react';

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
  function click(e: DateFullType) {
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
  }

  return (
    <div
      className={`column items-center justify-center day__container
        ${fold && 'fold'} ${date.state} ${date.today && 'today'} ${
        select && 'select'
      }`}
      onClick={() => click(date)}>
      {/* 日期 */}
      <div>{date.day}</div>
      {/* 农历 */}
      {showLunar && (
        <div className={`dayCn ${date.lunar!.isTerm && 'term'}`}>
          {date.lunar!.isTerm ? date.lunar!.term : date.lunar!.dayCn}
        </div>
      )}
    </div>
  );
}

export default CalendarDay;
