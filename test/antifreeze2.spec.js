import assert from 'assert';
import {antifreeze, isNeeded} from '../lib/antifreeze2.js';

async function fibPseudoAsync(n) {
  let a = 1, b = 1, sum, i = n - 2;
  while (i-- > 0) {
    sum = a + b;
    a = b;
    b = sum;
  }
  return b;
}

async function monitorTicks(fn) {
  let max = 0;
  let ticks = 0;
  const start = process.hrtime.bigint();
  let timestamp = 0n;
  const timer = setInterval(() => {
    const now = process.hrtime.bigint();

    const duration = Number(timestamp ? now - timestamp : 0) / 1000000;
    timestamp = now;
    if (duration > max) {
      max = duration;
    }
    ticks++;
  }, 0);
  await fn();
  clearInterval(timer);
  return {
    ticks,
    max,
    duration: Number(process.hrtime.bigint() - start) / 1000000,
  }
}


describe('antifreeze', function () {
  this.timeout(0);

  it(`(HeatUp)`, async function () {
    let n = 10000;
    while (n-- > 0) {
      await fibPseudoAsync(1000);
    }
  });

  describe('eventloop', function () {
    it(`should be frozen if antifreeze is not used`, async function () {
      const result = await monitorTicks(async () => {
        let n = 10000;
        while (n-- > 0) {
          await fibPseudoAsync(10000);
        }
      });
      process.nextTick(console.log, `       Task duration ${result.duration} ms, ticks: ${result.ticks}`);
      assert.equal(result.ticks, 0);
    });
  })

  describe('isDelayed/isNeeded()', function () {
    it(`should return true if event loop tick is delayed`, async function () {
      const result = await monitorTicks(async () => {
        let n = 10000;
        while (n-- > 0) {
          await fibPseudoAsync(10000);
        }
      });
      process.nextTick(console.log, `       Task duration: ${result.duration} ms, ticks: ${result.ticks}`);
      assert.equal(isNeeded(1), true);
    })
  });

  describe('antifreeze()', function () {
    it(`should unfreeze the eventloop if it's delayed`, async function () {
      const result = await monitorTicks(async () => {
        let n = 100000;
        while (n-- > 0) {
          await fibPseudoAsync(10000);
          await antifreeze();
        }
      });
      process.nextTick(console.log, `       Task duration: ${result.duration} ms, ticks: ${result.ticks}`);
      assert.ok(result.ticks > 0, "no event loop ticks");
    });

    it(`should do nothing if the eventloop tick is not delayed enough`, async function () {
      const started = Date.now();
      const result = await monitorTicks(async () => {
        let n = 10;
        while (n-- > 0) {
          await fibPseudoAsync(10000);
          await antifreeze();
        }
      });
      process.nextTick(console.log, `       Task duration: ${result.duration} ms, ticks: ${result.ticks}`);
      assert.ok(result.ticks === 0, `event loop ticks detected [${result.ticks}]`);
      const passed = Date.now() - started;
      assert.ok(passed < 10, `the eventloop tick duration is exceeded [${passed}ms]`)
    });
  });
});
