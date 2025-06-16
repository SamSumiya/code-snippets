function sleep(delayMS: number): Promise<void> {
    if (delayMS < 0 ) {
        console.warn('Delay time is less than 0 ms, converting it to 0')
        delayMS = Math.max(0, delayMS)
    }

    return new Promise<void>((resolve) => {
        setTimeout(resolve, delayMS)
    })    
}

function cancellableSleep(sleepMS: number, cancelMS: number): { promise: Promise<string>, cancelFn: () => void} {
    let sleepTimeoutID: NodeJS.Timeout
    let cancelTimeID: NodeJS.Timeout
    let rejectFn: (err: Error) => void
    let settled = false 

    const promise = new Promise<string>((resolve, reject) => {
        rejectFn = reject

        sleepTimeoutID = setTimeout(() => {
            if (settled) return
            settled = true 
            clearTimeout(cancelTimeID)
            resolve('Success')
        }, sleepMS)
    })

    const cancelFn = () => {
        cancelTimeID = setTimeout(() => {
            if (settled) return
            settled = true 
            clearTimeout(sleepTimeoutID)
            rejectFn(new Error('fail'))
        }, cancelMS)
    }

    return {
        promise, 
        cancelFn
    }
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



function sleepWithTimeoutManual(sleepMS: number, timeoutMS: number): Promise<string> {
    let sleepTimeoutId: NodeJS.Timeout 
    let rejectTimeoutId: NodeJS.Timeout 

    return new Promise((resolve, reject) => {
        sleepTimeoutId = setTimeout(() => {
            clearTimeout(rejectTimeoutId)
            resolve('Success')
        }, sleepMS)

        rejectTimeoutId = setTimeout(() => {
            clearTimeout(sleepTimeoutId)
            reject(new Error('fail')) 
        }, timeoutMS)
    })
}