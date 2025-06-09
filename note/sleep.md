

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