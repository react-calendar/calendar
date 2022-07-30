import { Swiper, SwiperSlide } from 'swiper/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { initMonths, getDayWeekIdxInMonth, initMonth } from 'src/utils/handler';
import CalendarDay from './day';

import 'swiper/css';
import 'src/styles/layout.scss';
import 'src/styles/transition.scss';
import { GlobalContext } from '../store';

interface PanelProps {
  markers: MarkerCache;
  onDateChange: (value: DateFullType) => void;
  onCurTabChange: (value: number) => void;
}

export default function Panel(props: PanelProps) {
  const { markers, onDateChange: odc, onCurTabChange: octc } = props;

  const { selectDate, curTab, startWeek, fold } = useContext(GlobalContext);

  const [months, setMonths] = useState<MonthType[]>(
    initMonths(selectDate, curTab, markers, startWeek)
  );

  // 刷新周视图
  const refreshWeekMonth = useCallback(() => {
    const { day, year, month } = selectDate;
    const ms = new Array(months.length);

    // 本周
    ms[curTab] = months[curTab];

    // 上周
    const pi = (curTab + 2) % 3;
    ms[pi] = initMonth(year, month, day - 7, markers, startWeek, false);

    // 下周
    const ni = (curTab + 1) % 3;
    ms[ni] = initMonth(year, month, day + 7, markers, startWeek, false);

    setMonths(ms);
  }, [selectDate]);

  // 刷新月视图
  const refreshMonth = useCallback(() => {
    const { day, year, month } = selectDate;
    const ms = new Array(months.length);

    // 当月
    ms[curTab] = months[curTab];

    // 上月
    const pi = (curTab + 2) % 3;
    ms[pi] = initMonth(year, month - 1, day, markers, startWeek);

    // 下月
    const ni = (curTab + 1) % 3;
    ms[ni] = initMonth(year, month + 1, day, markers, startWeek);

    setMonths(ms);
  }, [selectDate]);

  // fold 变化时需要刷新视图
  useEffect(() => {
    if (fold) {
      refreshWeekMonth();
    } else {
      refreshMonth();
    }
  }, [fold]);

  // 左滑事件
  function prev(e: DateFullType) {
    const ms = [...months];
    const i = (curTab + 1) % 3; // 上上月(周)索引
    const ci = (curTab + 2) % 3; // 上月(周)索引

    if (fold) {
      if (e.state !== 'cur') {
        ms[curTab] = ms[ci]; // 上周给本周
        ms[curTab].trans =
          getDayWeekIdxInMonth(
            { year: e.year, month: e.month, day: e.day },
            ms[curTab].idays
          ) * 44;
        ms[ci] = initMonth(
          e.year,
          e.month,
          e.day - 7,
          markers,
          startWeek,
          false
        ); // 计算上周的
      } else {
        ms[i] = initMonth(
          e.year,
          e.month,
          e.day - 7,
          markers,
          startWeek,
          false
        ); // 计算上上周的
      }
    } else {
      ms[i] = initMonth(e.year, e.month - 1, e.day, markers, startWeek);
      ms[ci].trans =
        getDayWeekIdxInMonth(
          { year: e.year, month: e.month, day: e.day },
          ms[ci].idays
        ) * 44; // 更新上月偏移量
    }

    setMonths(ms);
    odc(e);
  }

  // 右滑事件
  function next(e: DateFullType) {
    const ms = [...months];

    const i = (curTab + 2) % 3; // 下下月(周)索引
    const ci = (curTab + 1) % 3; // 下月(周)索引

    if (fold) {
      if (e.state !== 'cur') {
        // 这一步主要是判断点击还是滑动
        // 如果是点击的, 则 curTab 不会变, 那么就需要用下周的替换当前 ms[curTab], 并计算下周的
        // 如果是滑动的, 则 curTab 会改变, 计算下下周即可
        ms[curTab] = ms[ci]; // 下周给本周
        ms[curTab].trans =
          getDayWeekIdxInMonth(
            { year: e.year, month: e.month, day: e.day },
            ms[curTab].idays
          ) * 44; // 更新新日期偏移量
        ms[ci] = initMonth(
          e.year,
          e.month,
          e.day + 7,
          markers,
          startWeek,
          false
        ); // 计算下周的
      } else {
        ms[i] = initMonth(
          e.year,
          e.month,
          e.day + 7,
          markers,
          startWeek,
          false
        ); // 计算下下周的
      }
    } else {
      ms[i] = initMonth(e.year, e.month + 1, e.day, markers, startWeek);
      ms[ci].trans =
        getDayWeekIdxInMonth(
          { year: e.year, month: e.month, day: e.day },
          ms[ci].idays
        ) * 44; // 更新下月偏移量
    }

    setMonths(ms);
    odc(e);
  }

  // 切换时事件
  function onSlide(e: any) {
    if (e.swipeDirection /* 仅手(非点击)滑动时需要 */) {
      let d_: DateFullType;
      const { day, year, month } = selectDate;
      const m = months[e.realIndex];

      if (fold) {
        const dir = e.swipeDirection === 'prev' ? -1 : 1;
        const d = new Date(year, month, day + dir * 7);

        const idx = m.idays.findIndex((el) => {
          return el.state === 'cur' && el.day === d.getDate();
        });

        d_ = m.idays[idx];
      } else {
        // 获取滑动结束后被激活的日期

        const d = day <= m.count ? day : m.count;

        const idx = m.idays.findIndex((el) => {
          return el.state === 'cur' && el.day === d;
        });

        d_ = m.idays[idx];
      }

      // 根据日期进行滑动成功后操作
      if (e.swipeDirection === 'prev') {
        prev(d_);
      } else if (e.swipeDirection === 'next') {
        next(d_);
      }
    }

    octc(e.realIndex); // 通知父组件修改 curTab
  }

  // 点击改变本月日期时执行
  function onDateChange(e: DateFullType) {
    odc(e);

    if (!fold) {
      // 折叠状态下点击日期偏移量不会改变
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
      {months.map((item: MonthType, idx: number) => (
        <SwiperSlide key={`${item.key}_${idx}`}>
          <div
            className="grid transition"
            style={{ transform: `translateY(-${fold ? item.trans : 0}px)` }}>
            {item.idays.map((i) => (
              <CalendarDay
                onDateChange={onDateChange}
                next={next}
                prev={prev}
                key={i.key}
                date={i}></CalendarDay>
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
