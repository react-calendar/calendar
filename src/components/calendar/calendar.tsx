import { useCallback, useMemo, useState } from 'react';
import { initMarkers, initDay } from 'src/utils/handler';

import Header from 'components/calendar/header';
import Panel from 'components/calendar/panel';
import Week from 'components/calendar/week';
import { GlobalContext } from 'components/store';

import 'src/styles/layout.scss';

interface CalendarProps {
  fold: boolean; // 是否展开
  markers: Marker[]; // 事件标记
  darkMode: boolean; // 是否开启暗黑模式
  initDate: number | string | Date; // 初始时间
  startWeek: number; // 一周起始, 0 | 1 | 2 | 3 | 4 | 5 | 6
  showLunar: boolean; // 是否显示农历
  showMarker: boolean; // 是否显示标记
  width: number; // 日历宽度
  onDateChange?: (date: DateFullType) => void; // 日期变更回调
  onViewChange?: (view: string) => void; // 视图变更回调
}

function Calendar(props: CalendarProps) {
  const {
    initDate,
    markers,
    startWeek,
    showLunar,
    width,
    onViewChange,
    onDateChange,
  } = props;

  const [refresh, setRefresh] = useState(false);

  const markers_ = useMemo(() => initMarkers(markers), [markers]); // 日期标记缓存

  const [selectDate, setSelectDate] = useState(
    initDay(initDate, 'cur', markers_)
  );

  const [curTab, setCurTab] = useState(1);

  // true: 周视图, false: 月视图
  const [fold, setFold] = useState(props.fold);
  const viewChange = useCallback(
    (e: boolean) => {
      setFold(e);

      if (typeof onViewChange === 'function') {
        onViewChange(fold ? 'week' : 'month');
      }
    },
    [fold]
  );

  const dateChange = useCallback((e: DateFullType) => {
    setSelectDate(e); // 修改已选择的日期

    if (typeof onDateChange === 'function') {
      onDateChange(e);
    }
  }, []);

  const curTabChange = useCallback((e: number) => {
    setCurTab(e); // 修改当前 swiper 索引
  }, []);

  const onSelect = useCallback(
    (e: DateType) => {
      const { year, month, day } = e;
      dateChange(initDay(new Date(year, month - 1, day), 'cur', markers_));
      setRefresh(true);
    },
    [markers_]
  );

  return (
    <GlobalContext.Provider
      value={{
        fold,
        selectDate,
        curTab,
        showLunar,
        startWeek,
        viewChange,
        onSelect,
      }}>
      <div
        style={{
          width: `${width}px`,
          minWidth: '300px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          padding: '4px',
        }}>
        <Header></Header>
        <Week></Week>
        <Panel
          refresh={refresh}
          markers={markers_}
          onCurTabChange={curTabChange}
          onDateChange={dateChange}></Panel>
      </div>
    </GlobalContext.Provider>
  );
}

Calendar.defaultProps = {
  fold: false,
  markers: [],
  darkMode: false,
  initDate: new Date(),
  startWeek: 0, // 周日为一周开始
  showLunar: true,
  showMarker: true,
  width: 320,
};

export default Calendar;
