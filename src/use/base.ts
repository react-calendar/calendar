import { Context, createContext, useContext, useMemo } from 'react';
import { Theme } from '@utils/theme';
import { getDefault } from '@utils/defaults';
import { type LocaleConfig, default as Locale } from '@utils/locale';
import { Attribute } from '@utils/attribute';
import { isObject } from '@utils/helpers';
import { type DarkModeClassConfig, useDarkMode } from '@utils/darkMode';
import { type DayOfWeek, addDays } from '@utils/date/helpers';

export type BaseContext = ReturnType<typeof createBase>;

export interface PropsDef {
  color: string;
  isDark: boolean | 'system' | DarkModeClassConfig;
  firstDayOfWeek?: DayOfWeek;
  masks?: any;
  locale?: string | Record<string, any> | Locale;
  timezone?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: any;
}

export type BaseProps = Readonly<PropsDef>;

export function createBase(props: BaseProps) {
  const color = useMemo(() => props.color ?? '', [props]);
  const isDark = useMemo(() => props.isDark ?? false, [props]);

  const { displayMode } = useDarkMode(isDark);

  const theme = useMemo(() => new Theme(color), [color]);

  const locale = useMemo(() => {
    // Return the locale prop if it is an instance of the Locale class
    if (props.locale instanceof Locale) return props.locale;

    // Build up a base config from component props
    const config = (
      isObject(props.locale)
        ? props.locale
        : {
            id: props.locale,
            firstDayOfWeek: props.firstDayOfWeek,
            masks: props.masks,
          }
    ) as Partial<LocaleConfig>;

    // Return new locale
    return new Locale(config, props.timezone);
  }, [props]);

  const masks = useMemo(() => locale.masks, [locale]);

  const disabledDates = useMemo(() => {
    const dates: any[] = props.disabledDates ?? [];

    // Add disabled range for min date
    if (props.minDate != null) {
      dates.push({
        start: null,
        end: addDays(locale.toDate(props.minDate), -1),
      });
    }

    // Add disabled range for max date
    if (props.maxDate != null) {
      dates.push({
        start: addDays(locale.toDate(props.maxDate), 1),
        end: null,
      });
    }

    return locale.ranges(dates);
  }, [props]);

  const disabledAttribute = useMemo(() => {
    return new Attribute(
      {
        key: 'disabled',
        dates: disabledDates,
        order: 100,
      },
      theme,
      locale
    );
  }, [disabledDates, theme, locale]);

  const context = {
    color,
    isDark,
    displayMode,
    theme,
    locale,
    masks,
    disabledDates,
    disabledAttribute,
  };

  return context;
}

export function createDefaultProps(): PropsDef {
  return {
    color: getDefault('color'),
    isDark: getDefault('isDark'),
  };
}

let baseContext: Context<BaseContext> = createContext<BaseContext>(
  createBase(createDefaultProps())
);

export function useBase() {
  return useContext<BaseContext>(baseContext);
}

export function useOrCreateBase(props: BaseProps = createDefaultProps()) {
  baseContext = createContext<BaseContext>(createBase(props));
  return useContext<BaseContext>(baseContext);
}
