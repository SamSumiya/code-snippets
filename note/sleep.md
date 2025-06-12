

``` 
jest.useFakeTimers(); 
```

setTimeout() does not actually wain in real time
you have to manually advance the clock using: 

```
jest.advanceTimersByTime(ms);
``` 

Until that, any timers you've scheduled are just sitting in memory --- they wont execute.


```
it("❌ hangs forever", async () => {
  await sleep(1000);               // ⚠️ this creates a promise that waits for setTimeout to fire...
  jest.advanceTimersByTime(1000);  // 🕑 ...but this comes too late, the code is stuck at the await
});
```

1. jest.useFakeTimers() freezes time
2. sleep(1000) → schedules a setTimeout
3. await blocks the test until the timer fires
4. BUT: setTimeout never fires because time is frozen
5. jest.advanceTimersByTime() is never reached
6. Test hangs → Jest throws "timeout" error



# Async 

## 1. ```setTimeout``` Basics 
- ```setTimeout(fn, ms)``` schedules ```fn``` to be executed after at least ms. 
- It retuns a timer ID immediately -- which can be canceled using ````clearTimeout(id)```

## 2. JS is Single-Threaded
- Even if multiple timers are scheduled to fire at the same time, only one callback runs at a time.
- The event loop executes them sequentially, in the order they're ready

## 3. How ```Promise.race()``` Works
- Listens to multiple Promises
- Settles with the first one to resolve or reject - others are ignored afterward
- It does not run Promises in parallel - it just observers which one settles first
- When you schedule two timers together — one for 100ms and one for 200ms — they start at the same time. A will fire at 100ms, B at 200ms. The total elapsed time to run both is 200ms, not 300ms. B does not wait for A to finish.

## 4. Timers in ```Promise.race``` 
- You can simulate timeout guards by racing a slow promise ( Sleep ) vs a fast one (reject after X ms) 
- 

## 🧼5. Manual Sleep with Timeout (without Promise.race)
- You can build the same effect using two setTimeout calls:
    1. One to resolve after sleepMS
    2. One to reject after timeoutMS

- Use a shared settled flag to ensure only one wins

