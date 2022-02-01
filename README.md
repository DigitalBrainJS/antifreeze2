# antifreeze2
[![Build Status](https://travis-ci.com/DigitalBrainJS/antifreeze2.svg?branch=master)](https://travis-ci.com/DigitalBrainJS/antifreeze2)
[![](https://badgen.net/npm/license/antifreeze2)](https://unpkg.com/antifreeze2/dist/antifreeze2.umd.js)
[![Coverage Status](https://coveralls.io/repos/github/DigitalBrainJS/antifreeze2/badge.svg?branch=master)](https://coveralls.io/github/DigitalBrainJS/antifreeze2?branch=master)
[![](https://badgen.net/github/issues/DigitalBrainJS/antifreeze2)](https://github.com/DigitalBrainJS/antifreeze2/issues)
[![](https://badgen.net/github/stars/DigitalBrainJS/antifreeze2)](https://github.com/DigitalBrainJS/antifreeze2/stargazers)

:star: Define feature-rich properties using decorators or plain functions. An extended version of Object.defineProperty :star:

# Why
If you have a heavy synchronous task, you may use workers or just split the task to several async micro tasks/chunks
to keep event loop always running, its pretty easy to do that with async function.
But async function doesn't guarantee that all of its task scheduled by await will be executed really asynchronously
and will not block the IO stage of the EventLoop. This simple package consists simple helpers to ensure that the event loop
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
const {antifreeze}= require('antifreeze2');
````

## Usage examples




## API

<a name="module_antifreeze2"></a>

## antifreeze2

* [antifreeze2](#module_antifreeze2)
    * [.watchTick(tick)](#module_antifreeze2.watchTick)
    * [.antifreeze()](#module_antifreeze2.antifreeze) ⇒ <code>Promise.&lt;void&gt;</code> \| <code>null</code>
    * [.isNeeded([maxTick])](#module_antifreeze2.isNeeded) ⇒ <code>boolean</code>

<a name="module_antifreeze2.watchTick"></a>

### antifreeze2.watchTick(tick)
set interval for EventLoop delay checking

**Kind**: static method of [<code>antifreeze2</code>](#module_antifreeze2)  

| Param | Type | Description |
| --- | --- | --- |
| tick | <code>Number</code> | checking interval. Set to 0 to disable the watcher. By default this value is set to 10(ms) |

<a name="module_antifreeze2.antifreeze"></a>

### antifreeze2.antifreeze() ⇒ <code>Promise.&lt;void&gt;</code> \| <code>null</code>
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