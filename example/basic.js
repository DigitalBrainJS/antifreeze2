import {antifreeze, isNeeded} from "../lib/antifreeze2.js";

const fibAsync = async(n) => {
  let a = 1n, b = 1n, sum, i = n - 2;
  while (i-- > 0) {
    sum = a + b;
    a = b;
    b = sum;
    if (isNeeded()) {
      await antifreeze();
    }
  }
  return b;
};


(async (n) => {
  let ts = Date.now();
  const start = ts;
  let ticks = 0;

  const timer = setInterval(() => {
    const now = Date.now();
    console.log(`Timer tick [${now - ts}ms]`);
    ts = now;
    ticks++;
  }, 100);

  const result = await fibAsync(n);

  console.warn(`\nTimer ticks: ${ticks}\n[${Date.now() - start}ms] Fibonacci(${n}) = ${result}`)

  clearTimeout(timer);
})(1000000);
