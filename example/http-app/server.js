import CPKoa from "cp-koa";
import Router from "@koa/router";
import { CPromise, CanceledError, E_REASON_CANCELED } from "c-promise2";
import assert from "assert";
import {antifreeze, isNeeded} from "../../lib/antifreeze2.js";

const fibAsync = CPromise.promisify(function* (n) {
  this.innerWeight(0);
  let a = 1n, b = 1n, sum, i = n - 2;
  while (i-- > 0) {
    sum = a + b;
    a = b;
    b = sum;
    if (isNeeded()) {
      yield antifreeze();
      this.progress(1 - (i /(n-2)));
    }
  }
  return b;
});

const app = new CPKoa();

const router = new Router();

app.use(function* (ctx, next) {
  const ts = Date.now();
  try {
    yield next();
    const passed = Date.now() - ts;
    console.warn(`Request [${ctx.req.url}] completed in [${passed}ms]`);
    ctx.set('X-Response-Time',`${passed}ms`);
  } catch (err) {
    if(CPromise.isCanceledError(err)){
      console.warn(`Request [${ctx.req.url}] canceled in [${Date.now() - ts}ms]`);
    }
    throw err;
  }
});

router.get('/', async(ctx)=>{
  ctx.body = `
  <html><body>
    <a href="/time">Current time</a><br/>
    <a href="/fibonacci/10000">fibonacci 10k</a><br/>
    <a href="/fibonacci/100000">fibonacci 100k</a><br/>
    <a href="/fibonacci/1000000">fibonacci 1M</a><br/>
    <a href="/fibonacci/2000000">fibonacci 2M</a><br/>
  </body></html>`
})

router.get("/time", async function (ctx, next) {
    const now = new Date();
    ctx.body= `Time is: ${now.toLocaleString()} (${+now})`
});

router.get("/fibonacci/:n", async function (ctx, next) {
  await ctx.run(function* () {
    let {n = 1000} = ctx.request.params;
    console.log('start calculation...');
    n *= 1;

    assert.ok(n >= 1 && n <= 10000000, `n must be in range [1..10M]`);
    const promise = fibAsync(n);

    ctx.body = `Fibonacci result for n= ${n}: ${yield promise}`;
  })
});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .on("progress", (ctx, score) => {
    console.log(`Request [${ctx.req.url}] progress [${ctx.ip}]: ${(score * 100).toFixed(1)}%`);
  })
  .listen(3000);
