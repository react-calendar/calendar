import './styles/layout.scss';
import './styles/day.scss';

interface DayProps {
  showLunar: boolean;
  date: DateFullType;
  select: boolean;
  onDateChange?: (value: DateFullType) => void; // 点击回调
}

function CalendarDay(props: DayProps) {
  const { date, showLunar, select } = props;

  function click(e: DateFullType) {
    if (typeof props.onDateChange === 'function') {
      props.onDateChange(e);
    }
  }

  return (
    <div
      className={`column items-center justify-center day__container ${
        date.state
      } ${date.today ? 'today' : ''} ${select ? 'select' : ''}`}
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

CalendarDay.defaultProps = {
  showLunar: true,
};

export default CalendarDay;
