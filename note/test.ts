function sleep(delayMS: number): Promise<void> {
    if (delayMS < 0 ) {
        console.warn('Delay time is less than 0 ms, converting it to 0')
        delayMS = Math.max(0, delayMS)
    }

    return new Promise<void>((resolve) => {
        setTimeout(resolve, delayMS)
    })    
}

function sleepWithTimeoutRace(sleepMS: number, timeoutMS: number): Promise<string> {
    let sleepTimeId: NodeJS.Timeout; 
    let timeoutId: NodeJS.Timeout; 

    const sleepPromise = new Promise<string>((resolve) => {
            sleepTimeId = setTimeout(() => {
                clearTimeout(timeoutId)
                resolve('success')
            }, sleepMS)
        }) 
    const rejectPromise = new Promise<string>((_, reject) => {
            timeoutId = setTimeout(() => {
                clearTimeout(sleepTimeId)
                reject(new Error('fail'))
            }, timeoutMS)
        })

    return Promise.race([sleepPromise, rejectPromise])
}


function sleepWithAsyncFnPromise(sleepMS: number, timeoutMS: number) {
    let timeoutId : NodeJS.Timeout
    
    async function rejectFn() {
        timeoutId = setTimeout(() => {
            throw new Error('fail')
        }, timeoutMS)
    }
    /*
    So this is wrong... 
    async function rejectFn() {
        timeoutId = setTimeout(() => {
            throw new Error('fail')
        }, timeoutMS)
    }
    1. rejectFn returns a resolved promise with undefined immediately 
    2. timeId get assigned 
    3. setTimeout schedules callback within timeoutMS 
    4. when the timeoutMS is up, it runs the callback
    5. in the next tick, we throw a new error
    6. since this throw is not connected with the Promsie at all.
        - it throws into the global context, not into the rejected promise
        - it does not result in Promise.result.
        - it's unhandled unless caught with a global error handler 
            - window.onerror
            - process.on('uncaughtException')
    */

    return Promise.race([
        sleep(sleepMS).then(() => clearTimeout(timeoutId)), 
        rejectFn()
    ])
}