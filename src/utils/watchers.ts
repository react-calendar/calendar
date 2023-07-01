const watchSkippers: Partial<Record<string, number>> = {};

export const skipWatcher = (watcher: string, durationMs = 10) => {
  watchSkippers[watcher] = Date.now() + durationMs;
};

export const unskipWatcher = (watcher: string) => {
  delete watchSkippers[watcher];
};

export const handleWatcher = (watcher: string, handler: VoidFunction) => {
  if (watcher in watchSkippers) {
    const dateTime = watchSkippers[watcher]!;

    if (Date.now() >= dateTime) {
      delete watchSkippers[watcher];
    }
  }

  handler();
};
