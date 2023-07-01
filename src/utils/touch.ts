import { on, off, isFunction } from '@utils/helpers';

interface SwipeHandlerOptions {
  maxSwipeTime: number;
  minHorizontalSwipeDistance: number;
  maxVerticalSwipeDistance: number;
}

export const addHorizontalSwipeHandler = (
  element: CustomElement,
  handler: Function,
  options: SwipeHandlerOptions
) => {
  if (!element || !element.addEventListener || !isFunction(handler)) {
    return null;
  }

  const { maxSwipeTime, minHorizontalSwipeDistance, maxVerticalSwipeDistance } = options;

  let startX = 0;
  let startY = 0;
  let startTime: number | null = null;
  let isSwiping = false;

  function touchStart(e: TouchEvent) {
    const t = e.changedTouches[0];
    startX = t.screenX;
    startY = t.screenY;
    startTime = new Date().getTime();
    isSwiping = true;
  }

  function touchEnd(e: TouchEvent) {
    if (!isSwiping || !startTime) return;
    isSwiping = false;
    const t = e.changedTouches[0];
    const deltaX = t.screenX - startX;
    const deltaY = t.screenY - startY;
    const deltaTime = new Date().getTime() - startTime;

    if (deltaTime < maxSwipeTime) {
      if (
        Math.abs(deltaX) >= minHorizontalSwipeDistance &&
        Math.abs(deltaY) <= maxVerticalSwipeDistance
      ) {
        const arg = { toLeft: false, toRight: false };

        if (deltaX < 0) {
          arg.toLeft = true;
        } else {
          arg.toRight = true;
        }

        handler(arg);
      }
    }
  }

  on(element, 'touchstart', touchStart, { passive: true });
  on(element, 'touchend', touchEnd, { passive: true });

  return () => {
    off(element, 'touchstart', touchStart);
    off(element, 'touchend', touchEnd);
  };
};
