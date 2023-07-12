import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import type { DarkModeConfig } from '@utils/darkMode';
import { defaultsDeep, mapValues, get, has } from '@utils/helpers';
import locales, { type Locales } from '@utils/defaults/locales';

import touch from './touch.json';
import masks from './masks.json';

declare const window: any;

interface DatePickerPopoverDefaults {
  visibility?: string;
  placement?: string;
  isInteractive?: boolean;
}

interface DatePickerDefaults {
  updateOnInput?: boolean;
  inputDebounce?: number;
  popover?: DatePickerPopoverDefaults;
}

export interface Defaults {
  color?: string;
  isDark?: DarkModeConfig;
  navVisibility?: string;
  titlePosition?: string;
  transition?: string;
  touch?: object;
  masks?: object;
  locales?: Locales;
  datePicker?: DatePickerDefaults;
}

const defaultConfig = atom<Defaults>({
  key: 'defaultConfig',
  default: {
    color: 'blue',
    isDark: false,
    navVisibility: 'click',
    titlePosition: 'center',
    transition: 'slide-h',
    touch,
    masks,
    locales,
    datePicker: {
      updateOnInput: true,
      inputDebounce: 1000,
      popover: {
        visibility: 'hover-focus',
        placement: 'bottom-start',
        isInteractive: true,
      },
    },
  },
});

export const defaultLocales = selector({
  key: 'defaultLocales',
  get: ({ get }) => {
    const state = get(defaultConfig);

    return mapValues(state.locales, (l) => {
      l.masks = defaultsDeep(l.masks, state.masks);
      return l;
    });
  },
});

export const getDefault = (path: string) => {
  if (window && has(window.__calendar__, path)) {
    return get(window.__calendar__, path);
  }

  const state = useRecoilValue(defaultConfig);

  return get(state, path);
};

export const setupDefaults = (userDefaults?: Defaults) => {
  const [state, setState] = useRecoilState(defaultConfig);

  const res: Defaults = { ...state, ...defaultsDeep(userDefaults, state) };

  setState(res);

  return res;
};
