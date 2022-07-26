import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import { useState } from 'react';
import { initMonths } from 'src/utils/handler';
import CalendarDay from './calendarDay';

import 'swiper/css';
import './styles/layout.scss';
import './styles/index.scss';

interface PanelProps {
  fold: boolean;
  date: DateFullType;
  startWeek: number;
  curTab: number;
  onDateChange?: (value: DateFullType) => void;
  onCurIndexChange?: (value: number) => void;
}

function CalendarPanel(props: PanelProps) {
  const { fold, date, startWeek, onDateChange, onCurIndexChange, curTab } =
    props;

  const [months, setMonths] = useState<MonthType[]>(
    initMonths(date, curTab, startWeek)
  );

  function refreshMonthPanel() {}

  function refreshWeeksPanel() {}

  if (fold) {
    // 周视图
    refreshWeeksPanel();
  } else {
    // 月视图
    refreshMonthPanel();
  }

  function onSlide(e: SwiperClass) {
    if (typeof onCurIndexChange === 'function') {
      onCurIndexChange(e.realIndex);
    }
  }

  return (
    <Swiper
      loop
      onSlideChange={onSlide}
      initialSlide={curTab}
      style={{
        height: `${fold ? 44 : months[curTab].days.length * 44}px`,
      }}
      className="transition">
      {months.map((item: MonthType) => (
        <SwiperSlide key={item.key}>
          <div
            className="grid transition"
            style={{ transform: `translateY(-${fold ? item.trans : 0}px)` }}>
            {item.idays.map((i) => (
              <CalendarDay
                select={
                  i.year === date.year &&
                  i.month === date.month &&
                  i.day === date.day
                }
                onDateChange={onDateChange}
                key={i.key}
                date={i}></CalendarDay>
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default CalendarPanel;
