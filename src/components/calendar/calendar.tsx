import PropTypes from 'prop-types';
import { useState } from 'react';
import { initMarkers, resortWeeks, initDay } from 'src/utils/handler';

import Checkbox from 'src/components/checkbox';
import CalendayPanel from 'src/components/calendar/panel';

import 'src/styles/index.scss';
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
}

function Calendar(props: CalendarProps) {
  const { initDate, markers: mk, startWeek, showLunar, width } = props;

  const markers = initMarkers(mk); // 初始化标记缓存

  const weeks = resortWeeks(startWeek);

  const [selectDate, setSelectDate] = useState(
    initDay(initDate, 'cur', markers)
  );

  const [curTab, setCurTab] = useState(1);

  const [fold, setFold] = useState(props.fold);
  function handleChange(e: boolean) {
    // true: 周视图, false: 月视图
    setFold(e);
  }

  function onDateChange(e: DateFullType) {
    setSelectDate(e); // 修改已选择的日期

    if (fold) {
      // 当前处于折叠状态
    } else {
      // 当前处于月视图
      if (e.state === 'prev' || e.state === 'next') {
        // 当前点击的是上个月或者下个月
      } else {
      }
    }
  }

  function onCurIndexChange(e: number) {
    setCurTab(e); // 修改当前 swiper 索引
  }

  return (
    <div className="calendar__container" style={{ width: `${width}px` }}>
      <div className="calendar__header row justify-between items-center">
        {/* 日期 */}
        <div className="calendar__content row">
          <div className="calendar-content__datetime">{`${selectDate.month}月${selectDate.day}日`}</div>
          <div className="column justify-center">
            <div>{`${selectDate.year}年`}</div>
            {/* 农历 */}
            {showLunar && (
              <div className="calendar-content__year_desc">
                {`${selectDate.lunar!.gzYear}${selectDate.lunar!.zodiac}年`}
              </div>
            )}
          </div>
        </div>
        {/* 月/周切换按钮 */}
        <Checkbox checked={props.fold} onChange={handleChange}></Checkbox>
      </div>
      {/* 星期 */}
      <div className="calendar__weeks grid">
        {weeks.map((item: string) => (
          <div key={item}>{item}</div>
        ))}
      </div>
      {/* 日期面板 */}
      <div className="calendar__panel">
        <CalendayPanel
          markers={markers}
          showLunar={true}
          curTab={curTab}
          date={selectDate}
          onCurIndexChange={onCurIndexChange}
          onDateChange={onDateChange}
          startWeek={startWeek}
          fold={fold}></CalendayPanel>
      </div>
    </div>
  );
}

Calendar.propTypes = {
  fold: PropTypes.bool,
  markers: PropTypes.array,
  darkMode: PropTypes.bool,
  initDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  startWeek: PropTypes.number,
  showLunar: PropTypes.bool,
  showMarker: PropTypes.bool,
  width: PropTypes.number,
};

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
