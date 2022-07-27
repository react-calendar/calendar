import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import { initMonths, getDayWeekIdxInMonth, initMonth } from 'src/utils/handler';
import CalendarDay from './calendarDay';

import 'swiper/css';
import 'src/styles/layout.scss';
import 'src/styles/transition.scss';

interface PanelProps {
  fold: boolean;
  date: DateFullType;
  startWeek: number;
  curTab: number;
  showLunar: boolean;
  onDateChange: (value: DateFullType) => void;
  onCurIndexChange: (value: number) => void;
}

function CalendarPanel(props: PanelProps) {
  const {
    fold,
    date,
    curTab,
    startWeek,
    showLunar,
    onDateChange: odc,
    onCurIndexChange: ocic,
  } = props;

  const [months, setMonths] = useState<MonthType[]>(
    initMonths(date, curTab, startWeek)
  );

  // 左滑事件
  function prev(e: DateFullType) {
    const ms = [...months];
    const i = (curTab + 1) % 3; // 上上月索引
    const ci = (curTab + 2) % 3; // 上月索引
    ms[i] = initMonth(e.year, e.month - 1, e.day, startWeek);
    ms[ci].trans =
      getDayWeekIdxInMonth(
        { year: e.year, month: e.month, day: e.day },
        ms[ci].idays
      ) * 44; // 更新上月偏移量

    setMonths(ms);
    odc(e);
  }

  // 右滑事件
  function next(e: DateFullType) {
    const ms = [...months];
    const i = (curTab + 2) % 3; // 下下月索引
    const ci = (curTab + 1) % 3; // 下月索引
    ms[i] = initMonth(e.year, e.month + 1, e.day, startWeek);
    ms[ci].trans =
      getDayWeekIdxInMonth(
        { year: e.year, month: e.month, day: e.day },
        ms[ci].idays
      ) * 44; // 更新下月偏移量

    setMonths(ms);
    odc(e);
  }

  // 切换时事件
  function onSlide(e: any) {
    if (e.swipeDirection /* 仅手(非点击)滑动时需要 */) {
      const { day } = date;

      const ms = [...months];
      const m = ms[e.realIndex]; // 滑动结束后被激活的月份
      const d = day <= m.count ? day : m.count;

      const idx = m.idays.findIndex((el) => {
        return el.state === 'cur' && el.day === d;
      });

      const d_ = m.idays[idx];

      if (e.swipeDirection === 'prev') {
        prev(d_);
      } else if (e.swipeDirection === 'next') {
        next(d_);
      }
    }

    ocic(e.realIndex); // 通知父组件修改 curTab
  }

  // 点击改变本月日期时执行
  function onDateChange(e: DateFullType) {
    odc(e);

    if (fold) {
    } else {
      const m = [...months];
      // 当前点击的是本月, 则仅修改偏移量
      for (let i = 0; i < m.length; i++) {
        const { day } = e;
        const d = day <= m[i].count ? day : m[i].count; // 防止超出上/下月范围
        m[i].trans =
          getDayWeekIdxInMonth(
            { year: m[i].year, month: m[i].month, day: d },
            m[i].idays
          ) * 44;
      }

      setMonths(m);
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
                fold={fold}
                showLunar={showLunar}
                onDateChange={onDateChange}
                next={next}
                prev={prev}
                select={
                  i.year === date.year &&
                  i.month === date.month &&
                  i.day === date.day
                }
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
