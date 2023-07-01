import dayjs from 'utils/dayjs';

// 农历速查表
const lunarMap = [
  0x04bd8,
  0x04ae0,
  0x0a570,
  0x054d5,
  0x0d260,
  0x0d950,
  0x16554,
  0x056a0,
  0x09ad0,
  0x055d2, // 1900-1909
  0x04ae0,
  0x0a5b6,
  0x0a4d0,
  0x0d250,
  0x1d255,
  0x0b540,
  0x0d6a0,
  0x0ada2,
  0x095b0,
  0x14977, // 1910-1919
  0x04970,
  0x0a4b0,
  0x0b4b5,
  0x06a50,
  0x06d40,
  0x1ab54,
  0x02b60,
  0x09570,
  0x052f2,
  0x04970, // 1920-1929
  0x06566,
  0x0d4a0,
  0x0ea50,
  0x06e95,
  0x05ad0,
  0x02b60,
  0x186e3,
  0x092e0,
  0x1c8d7,
  0x0c950, // 1930-1939
  0x0d4a0,
  0x1d8a6,
  0x0b550,
  0x056a0,
  0x1a5b4,
  0x025d0,
  0x092d0,
  0x0d2b2,
  0x0a950,
  0x0b557, // 1940-1949
  0x06ca0,
  0x0b550,
  0x15355,
  0x04da0,
  0x0a5b0,
  0x14573,
  0x052b0,
  0x0a9a8,
  0x0e950,
  0x06aa0, // 1950-1959
  0x0aea6,
  0x0ab50,
  0x04b60,
  0x0aae4,
  0x0a570,
  0x05260,
  0x0f263,
  0x0d950,
  0x05b57,
  0x056a0, // 1960-1969
  0x096d0,
  0x04dd5,
  0x04ad0,
  0x0a4d0,
  0x0d4d4,
  0x0d250,
  0x0d558,
  0x0b540,
  0x0b6a0,
  0x195a6, // 1970-1979
  0x095b0,
  0x049b0,
  0x0a974,
  0x0a4b0,
  0x0b27a,
  0x06a50,
  0x06d40,
  0x0af46,
  0x0ab60,
  0x09570, // 1980-1989
  0x04af5,
  0x04970,
  0x064b0,
  0x074a3,
  0x0ea50,
  0x06b58,
  0x05ac0,
  0x0ab60,
  0x096d5,
  0x092e0, // 1990-1999
  0x0c960,
  0x0d954,
  0x0d4a0,
  0x0da50,
  0x07552,
  0x056a0,
  0x0abb7,
  0x025d0,
  0x092d0,
  0x0cab5, // 2000-2009
  0x0a950,
  0x0b4a0,
  0x0baa4,
  0x0ad50,
  0x055d9,
  0x04ba0,
  0x0a5b0,
  0x15176,
  0x052b0,
  0x0a930, // 2010-2019
  0x07954,
  0x06aa0,
  0x0ad50,
  0x05b52,
  0x04b60,
  0x0a6e6,
  0x0a4e0,
  0x0d260,
  0x0ea65,
  0x0d530, // 2020-2029
  0x05aa0,
  0x076a3,
  0x096d0,
  0x04afb,
  0x04ad0,
  0x0a4d0,
  0x1d0b6,
  0x0d250,
  0x0d520,
  0x0dd45, // 2030-2039
  0x0b5a0,
  0x056d0,
  0x055b2,
  0x049b0,
  0x0a577,
  0x0a4b0,
  0x0aa50,
  0x1b255,
  0x06d20,
  0x0ada0, // 2040-2049
  0x14b63,
  0x09370,
  0x049f8,
  0x04970,
  0x064b0,
  0x168a6,
  0x0ea50,
  0x06b20,
  0x1a6c4,
  0x0aae0, // 2050-2059
  0x092e0,
  0x0d2e3,
  0x0c960,
  0x0d557,
  0x0d4a0,
  0x0da50,
  0x05d55,
  0x056a0,
  0x0a6d0,
  0x055d4, // 2060-2069
  0x052d0,
  0x0a9b8,
  0x0a950,
  0x0b4a0,
  0x0b6a6,
  0x0ad50,
  0x055a0,
  0x0aba4,
  0x0a5b0,
  0x052b0, // 2070-2079
  0x0b273,
  0x06930,
  0x07337,
  0x06aa0,
  0x0ad50,
  0x14b55,
  0x04b60,
  0x0a570,
  0x054e4,
  0x0d160, // 2080-2089
  0x0e968,
  0x0d520,
  0x0daa0,
  0x16aa6,
  0x056d0,
  0x04ae0,
  0x0a9d4,
  0x0a4d0,
  0x0d150,
  0x0f252, // 2090-2099
  0x0d520,
];

// 天干
const Stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const Branchs = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
];

// 生肖
const Zodiac = [
  '鼠',
  '牛',
  '虎',
  '兔',
  '龙',
  '蛇',
  '马',
  '羊',
  '猴',
  '鸡',
  '狗',
  '猪',
];

// 农历月
const LunarMonths = [
  '正',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '冬',
  '腊',
];

// 汉字数字
const Nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const Moon = ['初', '十', '廿', '卅'];

// 返回农历年天数
function lunarYearDays(y: number) {
  let sum = 348;

  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += lunarMap[y - 1900] & i ? 1 : 0;
  }

  return sum + leapDays(y);
}

// 返回农历年闰月(0~12), 若没有闰月, 则返回 0
function leapMonth(y: number) {
  return lunarMap[y - 1900] & 0xf;
}

// 返回农历年闰月的天数, 若该年没有闰月则返回 0
function leapDays(y: number) {
  return leapMonth(y) ? (lunarMap[y - 1900] & 0x10000 ? 30 : 29) : 0;
}

// 返回农历非闰月天数
function monthDays(y: number, m: number) {
  if (m > 12 || m < 1) throw `${m} 不是有效月份`;

  return lunarMap[y - 1900] & (0x10000 >> m) ? 30 : 29;
}

// 传入相对甲子的偏移量 offset 返回干支
function toGanZhi(offset: number) {
  return Stems[offset % 10] + Branchs[offset % 12];
}

// 二十四节气速查表
const TermsMap = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072,
  240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210,
  440795, 462224, 483532, 504758,
];

// 节气中文名称
const Terms = [
  '小寒',
  '大寒',
  '立春',
  '雨水',
  '惊蛰',
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
];

// 获取某年第 n 个节气的公历日期
// n: 1 ~24, 1 为小寒, 3 为立春, 与 Terms 顺序一致
function getTerm(y: number, n: number) {
  if (y < 1900 || y > 2100) throw `${y} 不是有效年份`;

  if (n < 1 || n > 24) throw `${n} 不是有效节气索引(1~24)`;

  return new Date(
    31556925974.7 * (y - 1900) +
      TermsMap[n - 1] * 60000 +
      Date.UTC(1900, 0, 6, 2, 5)
  );
}

// 传入农历年份返回汉语
// 2020 --> 二零二零年
function toChinaYear(y: number) {
  var y1 = Math.floor(y / 1000);
  var y2 = Math.floor((y % 1000) / 100);
  var y3 = Math.floor((y % 100) / 10);
  var y4 = y % 10;

  return `${Nums[y1]}${Nums[y2]}${Nums[y3]}${Nums[y4]}年`;
}

// 传入农历数字返回月份
// 2 --> 二月
function toChinaMonth(m: number) {
  if (m > 12 || m < 1) throw `${m} 不是有效月份`;

  return `${LunarMonths[m - 1]}月`;
}

// 传入农历日期数字返回汉字表示法
// 30 --> 三十
function toChinaDay(d: number) {
  switch (d) {
    case 10:
      return '初十';
    case 20:
      return '二十';
    case 30:
      return '三十';
    default:
      return `${Moon[Math.floor(d / 10)]}${Nums[d % 10]}`;
  }
}

// 计算某一年的生肖
function getZodiac(y: number, m: number, d: number) {
  // 以立春为界
  const spring = getTerm(y, 3);

  if (dayjs([y, m, d]).isBefore(dayjs(spring), 'day')) {
    // 在立春之前, 是上一年的生肖
    return Zodiac[((y - 4) % 12) - 1];
  } else {
    return Zodiac[(y - 4) % 12];
  }
}

// 判断日期是否越界
function isValidDate(y: number, m: number, d: number) {
  return dayjs([y, m, d]).isBetween(
    dayjs([1900, 0, 1]),
    dayjs([2100, 11, 31]),
    'day',
    '[]'
  );
}

// 阳历转引阴历
export function solar2lunar(y: number, m: number, d: number): Lunar {
  if (!isValidDate(y, m, d)) throw '无效年份';

  const date = dayjs([y, m - 1, d]); // 修正过的时间

  let offset = dayjs.utc(date).diff(dayjs.utc([1900, 0, 31]), 'day') + 1;

  let year = 1900, // 农历年
    temp = 0;

  for (; year < 2101 && offset > 0; year++) {
    temp = lunarYearDays(year);
    offset -= temp;
  }

  if (offset < 0) {
    offset += temp;
    year--;
  }

  const leap = leapMonth(year); // 第 year 年哪一月是闰月

  let isLeap = false;

  // 效验闰月
  let month = 1; // 农历月
  for (; month < 13 && offset > 0; month++) {
    // 闰月
    if (leap > 0 && month === leap + 1 && !isLeap) {
      --month;
      isLeap = true;
      temp = leapDays(year); // 计算农历闰月天数
    } else {
      temp = monthDays(year, month); // 计算农历普通月天数
    }

    // 解除闰月
    if (isLeap && month === leap + 1) {
      isLeap = false;
    }

    offset -= temp;
  }

  if (offset === 0 && leap > 0 && month === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --month;
    }
  }

  if (offset < 0) {
    offset += temp;
    --month;
  }

  // 农历日
  const day = offset + 1;

  const spring = getTerm(y, 3); // 立春时间

  // 以立春为界获取干支年
  const gzY = date.isBefore(dayjs(spring), 'day')
    ? toGanZhi(y - 5)
    : toGanZhi(y - 4);

  // 月柱, 1900 年 1 月小寒以前为丙子月(60进制12)
  const f = getTerm(y, m * 2 - 1).getDate();
  const s = getTerm(y, m * 2).getDate();

  // 依据 12 节气修正干支月
  const gzM =
    date.date() >= f
      ? toGanZhi((y - 1900) * 12 + m + 12)
      : toGanZhi((y - 1900) * 12 + m + 11);

  let isTerm = false;
  let term = '';

  if (f === date.date()) {
    isTerm = true;
    term = Terms[m * 2 - 2];
  }

  if (s === date.date()) {
    isTerm = true;
    term = Terms[m * 2 - 1];
  }

  // 日柱, 当月一日与 1900-01-01 相差天数
  const diff =
    dayjs
      .utc([date.year(), date.month(), 1])
      .diff(dayjs.utc([1900, 0, 1]), 'day') + 10;

  const gzD = toGanZhi(diff + date.date() - 1);

  return {
    lYear: year,
    lMonth: month,
    lDay: day,
    zodiac: getZodiac(date.year(), date.month(), date.date()),
    yearCn: toChinaYear(year),
    monthCn: (isLeap && leap === month ? '闰' : '') + toChinaMonth(month),
    dayCn: toChinaDay(day),
    gzYear: gzY,
    gzMonth: gzM,
    gzDay: gzD,
    isLeap: isLeap,
    isTerm: isTerm,
    term: term,
  };
}
