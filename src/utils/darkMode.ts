import { windowExists, windowHasFeature } from '@utils/window';
import { useEffect, useMemo, useState } from 'react';
import { useWatch } from '@utils/watch';

export interface DarkModeClassConfig {
  selector: string;
  darkClass: string;
}

export type DarkModeConfig = boolean | 'system' | Partial<DarkModeClassConfig>;

export function useDarkMode(config: DarkModeConfig) {
  const [isDark, setDark] = useState(false);
  const displayMode = useMemo(() => (isDark ? 'dark' : 'light'), [isDark]);

  let mediaQuery: MediaQueryList | undefined;
  let mutationObserver: MutationObserver | undefined;

  function mqListener(ev: MediaQueryListEvent) {
    setDark(ev.matches);
  }

  function setupSystem() {
    if (windowHasFeature('matchMedia')) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', mqListener);
      setDark(mediaQuery.matches);
    }
  }

  function moListener() {
    const { selector = ':root', darkClass = 'dark' } = config as DarkModeClassConfig;
    const el = document.querySelector(selector);
    setDark((el as HTMLElement).classList.contains(darkClass));
  }

  function setupClass(config: DarkModeClassConfig) {
    const { selector = ':root', darkClass = 'dark' } = config;

    if (windowExists() && selector && darkClass) {
      const el = document.querySelector(selector);

      if (el) {
        mutationObserver = new MutationObserver(moListener);
        mutationObserver.observe(el, {
          attributes: true,
          attributeFilter: ['class'],
        });

        setDark((el as HTMLElement).classList.contains(darkClass));
      }
    }
  }

  function setup() {
    stopObservers();

    const type = typeof config;

    if (type === 'string' && (config as string).toLowerCase() === 'system') {
      setupSystem();
    } else if (type === 'object') {
      setupClass(config as DarkModeClassConfig);
    } else {
      setDark(!!config);
    }
  }

  function stopObservers() {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', mqListener);
      mediaQuery = undefined;
    }

    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = undefined;
    }
  }

  const stopWatch = useWatch(config, () => setup(), {
    immediate: true,
  });

  function cleanup() {
    stopObservers();
    stopWatch();
  }

  useEffect(() => {
    return () => cleanup();
  });

  return {
    isDark,
    displayMode,
    stopWatch,
  };
}
