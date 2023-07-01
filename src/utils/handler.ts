import dayjs from './dayjs/dayjs';
import { lunarHandle, astroHandle, markerHandle } from './lunar/services';

const Weeks = ['日', '一', '二', '三', '四', '五', '六'];

// 根据周起始重排 Weeks 数组
export function resortWeeks(start: number) {
  return [...Weeks.slice(start), ...Weeks.slice(0, start)];
}

const colorMap = {
  corner: '#61b057',
  holiday: '#42a5f5',
};

// 初始化 markers
function __() {
  const markers: MarkerCache = {};

  return function (m: Marker[]) {
    for (const marker of m) {
      const { year, month, day, type } = marker;
      let { mark, color, bgColor } = marker;

      if (['holiday', 'corner', 'schedule'].includes(type)) {
        const key = `${year}_${month}_${day}`;

        const _marker: MarkerType = markers.hasOwnProperty(key) ? markers[key] : {};

        _marker[type as keyof MarkerType] = _marker.hasOwnProperty(type)
          ? _marker[type as keyof MarkerType]
          : [];

        // 类型为 corner 的只取一个字符串
        mark = type === 'corner' ? mark.substring(0, 2) : mark;

        // 默认颜色
        if (typeof color === 'undefined') {
          switch (type) {
            case 'corner':
              color = '#61b057';
              break;
            case 'holiday':
              color = '#42a5f5';
              break;
            case 'schedule':
              color = '#fb8c00';
          }
        }

        if (typeof bgColor === 'undefined') {
          switch (type) {
            case 'corner':
              bgColor = 'transparent';
              break;
            case 'holiday':
              bgColor = 'transparent';
              break;
            case 'schedule':
              bgColor = '#ffcc80';
          }
        }

        _marker[type as keyof MarkerType]!.push({
          mark,
          color,
          bgColor,
        });

        markers[key] = _marker;
      }
    }

    return markers;
  };
}

export const initMarkers = __();

// 判断是否是合法时间对象
export function isValidDate(date: Date) {
  return !isNaN(date.getTime());
}

// 获取日期对象
export function initDay(d?: string | number | Date, state = 'cur', cache: MarkerCache = {}) {
  const date = dayjs(d).isValid() ? dayjs(d) : dayjs();

  let res: DateFullType = {
    year: date.year(),
    month: date.month() + 1,
    day: date.date(),
    week: date.day(),
    weekCn: `星期${Weeks[date.day()]}`,
    today: date.isToday(),
    state,
    key: `d_${date.year()}_${date.month()}_${date.date()}`,
  };

  res = lunarHandle(res);
  res = astroHandle(res);
  res = markerHandle(res, cache);

  return res;
}

// 生成某月日历
export function month(year: number, month: number, markers: MarkerCache) {
  return Array(dayjs([year, month - 1]).daysInMonth() /* 该月天数 */)
    .fill(null)
    .map((_, idx /* 几号 */) => initDay(new Date(year, month - 1, idx + 1), 'cur', markers));
}

// 上个月在这个月的部分
export function monthBefore(date: DateFullType, markers: MarkerCache, weekStart = 0) {
  const { year, month, week } = date;

  const len = Math.abs(week + 7 - weekStart) % 7;

  return Array(len)
    .fill(null)
    .map((_, idx) => initDay(new Date(year, month - 1, -idx), 'prev', markers))
    .reverse();
}

// 下个月在这个月的部分
export function monthAfter(date: DateFullType, markers: MarkerCache, weekStart = 0) {
  const { year, month, day, week } = date;

  const len = 6 - (Math.abs(week + 7 - weekStart) % 7);

  return Array(len)
    .fill(null)
    .map((_, idx) => initDay(new Date(year, month - 1, day + idx + 1), 'next', markers));
}

// 将前中后拼接成一个月的大数组
export function suppleMonth(y: number, m: number, markers: MarkerCache, startWeek = 0) {
  const monthDays = month(y, m, markers);

  return {
    count: monthDays.length,
    days: monthBefore(monthDays[0], markers, startWeek)
      .concat(monthDays)
      .concat(monthAfter(monthDays[monthDays.length - 1], markers, startWeek)),
  };
}

// 将 days 数组切分成以 7 为单位的二维数组
export function getMonthWeekDays(
  year: number,
  month: number,
  days: DateFullType[] // 长度要求为 7 的整数倍
): WeekType[] {
  return new Array(days.length / 7).fill(null).map((_, idx) => ({
    key: `w_${year}_${month}_${idx + 1}`,
    days: new Array(7).fill(null).map((_, i) => days[idx * 7 + i]),
  }));
}

export function initMonth(
  y: number,
  m: number,
  d: number,
  markers: MarkerCache,
  startWeek = 0,
  needFix = true // 是否需要将日期限制在本月
): MonthType {
  const d_ = dayjs([y, m, d]);

  const date = dayjs([needFix ? y : d_.year(), needFix ? m : d_.month(), 1]); // 月初

  // 以 m 月为中心获取完整日历
  const { days, count } = suppleMonth(date.year(), date.month(), markers, startWeek);

  // 当前日期比该月天数大就取天数最大值(主要避免30号-->31号的问题)
  const xday = d <= count ? d : count;

  const year = date.year(),
    month = date.month();

  const _date = {
    year,
    month,
    day: needFix ? xday : d_.date(),
  };

  const weekdays = getMonthWeekDays(year, month, days);

  return {
    key: `m_${year}_${month}`,
    year,
    month,
    count,
    idays: days,
    days: weekdays,
    trans: getDayWeekIdxInMonth(_date, days) * 44, // 70px 为一个日期项的高度
  };
}

// 日期所在月份第几周
export function getDayWeekIdxInMonth(date: DateType, days: DateFullType[]) {
  const { month: m, day: d } = date;

  const idx = days.findIndex(({ month, day }) => m === month && d === day);

  return Math.floor(idx / 7);
}

// 初始化三个月日历
export function initMonths(
  date: DateType,
  curTab: number,
  markers: MarkerCache,
  startWeek: number,
  num: number = 3
) {
  const { year, month, day } = date;

  return new Array(num).fill(null).map((_, idx) => {
    const _month = month + idx - curTab;

    return initMonth(year, _month, day, markers, startWeek);
  });
}
