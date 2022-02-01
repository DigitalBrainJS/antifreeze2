/**
 * @module antifreeze2
 */

const supportImmediate = typeof setImmediate === 'function';
const _setImmediate = supportImmediate ? setImmediate : setTimeout;

let defaultMaxTick;

const {now} = Date;

let timestamp = now();

let watcherTimer;

/**
 * set interval for EventLoop delay checking
 * @param {Number} tick - checking interval. Set to 0 to disable the watcher. By default this value is set to 15(ms)
 */

export function watchTick(tick) {
  if (tick > 0) {

    if (tick < 4) {
      throw Error('max tick can not be less than 4');
    }

    const interval = Math.max(tick, 4);

    defaultMaxTick = tick;

    if (!watcherTimer) {
      clearInterval(watcherTimer);
    }

    watcherTimer = setInterval(() => {
      timestamp = now();
    }, interval);

    if (typeof watcherTimer.unref === 'function') {
      watcherTimer.unref();
    }

  } else if (watcherTimer) {
    clearInterval(watcherTimer);
    watcherTimer = null;
  }
};

/**
 * Antifreeze promise injector
 * @returns {Promise<any>|null}
 */

export function antifreeze(value) {
  let ts = now();

  return ts - timestamp > defaultMaxTick ? new Promise(resolve => {
    timestamp = ts;
    _setImmediate(resolve, value);
  }) : null;
}

/**
 * returns true if current event loop tick is delayed
 * @param [maxTick] max tick duration allowed
 * @returns {boolean}
 */

export function isNeeded(maxTick = defaultMaxTick) {
  return now() - timestamp > maxTick;
}

watchTick(15);

