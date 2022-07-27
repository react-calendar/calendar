import dayjs from './dayjs';
import { lunarHandle, astroHandle } from './services';

const Weeks = ['日', '一', '二', '三', '四', '五', '六'];

// 根据周起始重排 Weeks 数组
export function resortWeeks(start: number) {
  return [...Weeks.slice(start), ...Weeks.slice(0, start)];
}

// 获取一周起始的日期
export function weekFirstDay(date: DateType, weekStart = 0): DateType {
  const { year, month, day } = date;

  const _date = dayjs([year, month - 1, day]);

  const week = _date.day(); // 一周中的第几天

  return {
    year: _date.year(),
    month: _date.month() + 1,
    day: _date.date() - (Math.abs(week + 7 - weekStart) % 7),
  };
}

// 初始化 makers
export function initMarkers(makers: Maker[]) {
  const markers: MarkerCache = {};

  for (const marker of makers) {
    const { year, month, day, type, mark, color, bgColor } = marker;

    if (['holiday', 'corner', 'schedule'].includes(type)) {
      const key = `${year}_${month}_${day}`;

      const _marker: MarkerType = markers.hasOwnProperty(key)
        ? { ...markers[key] }
        : {};

      _marker[type as keyof MarkerType] = _marker.hasOwnProperty(type)
        ? _marker[type as keyof MarkerType]
        : [];

      // 类型为 corner 的只取一个字符串
      const _mark = type == 'corner' ? mark.substring(0, 2) : mark;

      _marker[type as keyof MarkerType]!.push({
        mark: _mark,
        color,
        bgColor,
      });

      markers[key] = _marker;
    }
  }

  return markers;
}

// 判断是否是合法时间对象
export function isValidDate(date: Date) {
  return !isNaN(date.getTime());
}

// 获取日期对象
export function initDay(d?: string | number | Date, state = 'cur') {
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

  return res;
}

// 生成某月日历
export function month(year: number, month: number) {
  return Array(dayjs([year, month - 1]).daysInMonth() /* 该月天数 */)
    .fill(null)
    .map((_, idx /* 几号 */) => initDay(new Date(year, month - 1, idx + 1)));
}

// 上个月在这个月的部分
export function monthBefore(date: DateFullType, weekStart = 0) {
  const { year, month, week } = date;

  const len = Math.abs(week + 7 - weekStart) % 7;

  return Array(len)
    .fill(null)
    .map((_, idx) => initDay(new Date(year, month - 1, -idx), 'prev'))
    .reverse();
}

// 下个月在这个月的部分
export function monthAfter(date: DateFullType, weekStart = 0) {
  const { year, month, day, week } = date;

  const len = 6 - (Math.abs(week + 7 - weekStart) % 7);

  return Array(len)
    .fill(null)
    .map((_, idx) => initDay(new Date(year, month - 1, day + idx + 1), 'next'));
}

// 将前中后拼接成一个月的大数组
export function suppleMonth(y: number, m: number, startWeek = 0) {
  const monthDays = month(y, m);

  return {
    count: monthDays.length,
    days: monthBefore(monthDays[0], startWeek)
      .concat(monthDays)
      .concat(monthAfter(monthDays[monthDays.length - 1], startWeek)),
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
  startWeek = 0
): MonthType {
  const date = dayjs([y, m, 1]); // 月初

  // 以 m 月为中心获取完整日历
  const { days, count } = suppleMonth(date.year(), date.month(), startWeek);

  // 当前日期比该月天数大就取天数最大值(主要避免30号-->31号的问题)
  const xday = d <= count ? d : count;

  const year = date.year(),
    month = date.month();

  const _date = {
    year,
    month,
    day: xday,
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
    wf: weekFirstDay(_date, startWeek), // 该周起始日期
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
  startWeek: number,
  num: number = 3
) {
  const { year, month, day } = date;

  return new Array(num).fill(null).map((_, idx) => {
    const _month = month + idx - curTab;

    return initMonth(year, _month, day, startWeek);
  });
}

// // 判断左滑还是右划, mod => swiper 数减一(swiper 从 0 开始)
// export function swiperDirection(prev: number, cur: number, mod = 2) {
//   if (prev < cur) {
//     // 之前的小于现在的
//     if (prev === 0 && cur === mod) return -1; // 左滑

//     return 1; // 右滑
//   } else if (prev > cur) {
//     if (cur === 0 && prev === mod) return 1; // 右滑

//     return -1;
//   }

//   return 0;
// }
