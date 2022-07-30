interface Lunar {
  lYear: number; // 农历年
  lMonth: number; // 农历月
  lDay: number; // 农历日
  zodiac: string; // 生肖
  yearCn: string; // 农历年中文名称
  monthCn: string; // 农历月中文名称
  dayCn: string; // 农历日中文名称
  // 干支
  gzYear: string;
  gzMonth: string;
  gzDay: string;
  isLeap: boolean; // 是否是闰年
  isTerm: boolean; // 是否是二十四节气
  term: string; // 二十四节气
}

interface WeekType {
  key: string;
  days: DateFullType[];
}

interface MonthType {
  key: string;
  year: number;
  month: number;
  count: number;
  idays: DateFullType[];
  days: WeekType[];
  trans: number; // 平移距离
}

interface Marker {
  year: number;
  month: number;
  day: number;
  type: string; // holiday | corner | schedule
  mark: string;
  color?: string;
  bgColor?: string;
}

interface m {
  mark: string;
  color?: string;
  bgColor?: string;
}

interface MarkerType {
  holiday?: m[];
  corner?: m[];
  schedule?: m[];
}

interface MarkerCache {
  [key: string]: MarkerType;
}

interface DateType {
  year: number;
  month: number;
  day: number;
}

interface DateFullType extends DateType {
  week: number; // 星期
  weekCn: string; // 星期中文
  today?: boolean; // 是否是今天
  key?: string;
  state: string;
  lunar?: Lunar; // 农历
  astro?: string; // 星座
  markers?: MarkerType; // 日期事件标记
  [key: string]: any;
}
