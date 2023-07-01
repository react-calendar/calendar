// 星座
const Constellations = [
  '魔羯座',
  '水瓶座',
  '双鱼座',
  '白羊座',
  '金牛座',
  '双子座',
  '巨蟹座',
  '狮子座',
  '处女座',
  '天秤座',
  '天蝎座',
  '射手座',
  '魔羯座',
];

const ConstellationsMap = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];

// 获取星座
export function getAstro(m: number, d: number) {
  const idx = m - (d < ConstellationsMap[m - 1] ? 1 : 0);

  return Constellations[idx];
}
