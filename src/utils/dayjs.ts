import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import arraySupport from 'dayjs/plugin/arraySupport';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isBetween from 'dayjs/plugin/isBetween';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isLeapYear);
dayjs.extend(arraySupport);
dayjs.extend(dayOfYear);
dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(utc);

export default dayjs;
