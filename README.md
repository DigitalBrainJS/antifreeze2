# antifreeze2
[![Build Status](https://travis-ci.com/DigitalBrainJS/antifreeze2.svg?branch=master)](https://travis-ci.com/DigitalBrainJS/antifreeze2)
[![](https://badgen.net/npm/license/antifreeze2)](https://unpkg.com/antifreeze2/lib/antifreeze2.js)
[![Coverage Status](https://coveralls.io/repos/github/DigitalBrainJS/antifreeze2/badge.svg?branch=master)](https://coveralls.io/github/DigitalBrainJS/antifreeze2?branch=master)
[![](https://badgen.net/github/issues/DigitalBrainJS/antifreeze2)](https://github.com/DigitalBrainJS/antifreeze2/issues)
[![](https://badgen.net/github/stars/DigitalBrainJS/antifreeze2)](https://github.com/DigitalBrainJS/antifreeze2/stargazers)

:star: Antifreeze for eventloop- let it always work :star:

# Why
If you have a heavy synchronous task, you may use workers or just split the task to several async micro tasks/chunks
to keep event loop always running, its pretty easy to do that with async function.
But async function doesn't guarantee that all of its task scheduled by await will be executed really asynchronously
and will not block the IO stage of the EventLoop. This simple package consists some helpers to ensure that the event loop
is running, measuring the duration of the current event tick and allowing it go to the next tick if the maximum tick duration is exceeded.


## Installation

Install for node.js using npm/yarn:

``` bash
$ npm install antifreeze2 --save
```

``` bash
$ yarn add antifreeze2
```

````javascript
const { antifreeze, isNeeded, watchTick }= require('antifreeze2');
````

## Usage examples
#### Example 1 - Fibonacci
For example, we need to calculate Fibonacci for 1,000,000 value.
It's a task with heavy computation since it can take around 10s to complete.
If we write the function as synchronous or just use an ECMA asynchronous function, the event loop will be blocked for that period.
We won't be able to perform other tasks like accepting new connections, I/O events, timers, etc. because we only have one thread.
To avoid this, we must ensure that the event loop tick duration does not exceed the allowed range of 15-20ms in order for the application to remain responsive.

By default max eventloop tick is set to **15ms**. You can change it using `watchTick(maxTick: number)` function.
[See online demo](https://codesandbox.io/s/antifreeze2-basic-example-ulsvq?file=/src/index.js)
```js
import {antifreeze, isNeeded} from "antifreeze2";

// A function with heavy computations
const fibAsync = async(n) => {
  let a = 1n, b = 1n, sum, i = n - 2;
  while (i-- > 0) {
    sum = a + b;
    a = b;
    b = sum;
    if (isNeeded()) {      // if eventloop is delayed
      await antifreeze();  // call this function to unblock it (you have to do this from time to time)
    }
  }
  return b;
};

// Test it - calculate Fibonacci for n= 1,000,000
(async (n) => {
  let ts = Date.now();
  let ticks = 0;

  const timer = setInterval(() => {
    const now = Date.now();
    console.log(`Timer tick [${now - ts}ms]`);
    ts = now;
    ticks++;
  }, 100);

  const result = await fibAsync(n);

  console.warn(`\nTimer ticks: ${ticks}\nFibonacci(${n}) = ${result}`)

  clearTimeout(timer);
})(500000);
```

#### Example 2 - koa server with heavy computation

[See online demo](https://codesandbox.io/s/festive-pine-fwehi?file=/src/index.js)

The application has two endpoints:

[Time request](https://fwehi.sse.codesandbox.io/time) - light query with 20ms latency

[Fibonacci request](https://fwehi.sse.codesandbox.io/fibonacci/1000000) - heavy query that take 10s to complete

Note that while a heavy request is being executed, the server continues to process light requests even though it is only running in one thread.

## API

<a name="module_antifreeze2"></a>

## antifreeze2

* [antifreeze2](#module_antifreeze2)
    * [.watchTick(tick)](#module_antifreeze2.watchTick)
    * [.antifreeze()](#module_antifreeze2.antifreeze) ⇒ <code>Promise.&lt;any&gt;</code> \| <code>null</code>
    * [.isNeeded([maxTick])](#module_antifreeze2.isNeeded) ⇒ <code>boolean</code>

<a name="module_antifreeze2.watchTick"></a>

### antifreeze2.watchTick(tick)
set interval for EventLoop delay checking

**Kind**: static method of [<code>antifreeze2</code>](#module_antifreeze2)  

| Param | Type | Description |
| --- | --- | --- |
| tick | <code>Number</code> | checking interval. Set to 0 to disable the watcher. By default this value is set to 15(ms) |

<a name="module_antifreeze2.antifreeze"></a>

### antifreeze2.antifreeze() ⇒ <code>Promise.&lt;any&gt;</code> \| <code>null</code>
Antifreeze promise injector

**Kind**: static method of [<code>antifreeze2</code>](#module_antifreeze2)  
<a name="module_antifreeze2.isNeeded"></a>

### antifreeze2.isNeeded([maxTick]) ⇒ <code>boolean</code>
returns true if current event loop tick is delayed

**Kind**: static method of [<code>antifreeze2</code>](#module_antifreeze2)  

| Param | Description |
| --- | --- |
| [maxTick] | max tick duration allowed |



## Contribution
Feel free to fork, open issues, enhance or create pull requests.
## License

The MIT License
Copyright (c) 2019 Dmitriy Mozgovoy <robotshara@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
