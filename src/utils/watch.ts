import { useEffect, useRef } from 'react';

type Callback<T> = (prev?: T) => void;
type Config = Partial<{ immediate: boolean }>;

export function useWatch<T>(dep: T, callback: Callback<T>, config?: Config) {
  const { immediate = false } = config ?? {};

  const prev = useRef<T>();
  const inited = useRef(false);
  const stop = useRef(false);

  useEffect(() => {
    const execute = () => callback(prev.current);

    if (!stop.current) {
      if (!inited.current /* uninitialized */) {
        inited.current = true;
        if (immediate) execute();
      } else {
        execute();
      }

      prev.current = dep;
    }
  }, [dep]);

  return () => {
    stop.current = true;
  };
}
