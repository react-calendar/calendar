import { getAstro } from './astro';
import { solar2lunar } from './lunar';

// 农历
export function lunarHandle(date: DateFullType) {
  const { year, month, day } = date;

  date['lunar'] = solar2lunar(year, month, day);

  return date;
}

// 星座
export function astroHandle(date: DateFullType) {
  const { month, day } = date;

  date['astro'] = getAstro(month, day);

  return date;
}

// 日期标记
export function markerHandle(date: DateFullType, cache: MarkerCache) {
  // 从缓存中获取 marker
  const { year, month, day } = date;

  const key = `${year}_${month}_${day}`;
  const marker = cache.hasOwnProperty(key) ? { ...cache[key] } : null;

  return marker;
}
