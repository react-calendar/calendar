import { Placement } from '@popperjs/core';
import { DateRange } from '@utils/date/range';
import { arrayHasItems, createGuid } from './helpers';
import { addDays } from '@utils/date/helpers';
import { Theme } from '@utils/theme';
import Locale from '@utils/locale';

export class Attribute {
  key: string | number = '';
  hashcode = '';
  highlight: Profile<Highlight> | null = null;
  content: Profile<Content> | null = null;
  dot: Profile<Dot> | null = null;
  bar: Profile<Bar> | null = null;
  event: EventConfig | null = null;
  popover: PopoverConfig | null = null;
  customData: any = null;
  ranges: DateRange[];
  hasRanges = false;
  order = 0;
  pinPage = false;
  maxRepeatSpan = 0;
  locale: Locale;

  constructor(config: Partial<AttributeConfig>, theme: Theme, locale: Locale) {
    const { dates } = Object.assign(this, { hashcode: '', order: 0, pinPage: false }, config);

    if (!this.key) {
      this.key = createGuid();
    }

    this.locale = locale;
    
    theme.normalizeGlyphs(this);

    this.ranges = locale.ranges(dates ?? []);
    
    this.hasRanges = !!arrayHasItems(this.ranges);
    
    this.maxRepeatSpan = this.ranges
      .filter((r) => r.hasRepeat)
      .map((r) => r.daySpan)
      .reduce((res, curr) => Math.max(res, curr), 0);
  }

  intersectsRange({ start, end }: DateRange) {
    if (start == null || end == null) return false;
    const simpleRanges = this.ranges.filter((r) => !r.hasRepeat);
    
    for (const range of simpleRanges) {
      if (range.intersectsDayRange(start.dayIndex, end.dayIndex)) {
        return true;
      }
    }
    
    const repeatRanges = this.ranges.filter((r) => r.hasRepeat);
    if (!repeatRanges.length) return false;
    let day = start;
    if (this.maxRepeatSpan > 1) {
      day = this.locale.getDateParts(addDays(day.date, -this.maxRepeatSpan));
    }
    while (day.dayIndex <= end.dayIndex) {
      for (const range of repeatRanges) {
        if (range.startsOnDay(day)) return true;
      }
      day = this.locale.getDateParts(addDays(day.date, 1));
    }
    return false;
  }
}
