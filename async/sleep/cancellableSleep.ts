export function cancellableSleep(ms: number) {
    let timeoutId: NodeJS.Timeout
    let rejectFn: (err: Error) => void
    let isSettled = false 

    const promise = new Promise((resolve, reject) => {
        rejectFn = reject
        timeoutId = setTimeout(() => {
            if (isSettled) return;     
            isSettled = true 
            resolve('🍀 Success')
        }, ms)
    })

    const cancel = () => {
        if ( isSettled ) return 
        if (timeoutId) {
            clearTimeout(timeoutId) 
        }
        isSettled = true; 
        rejectFn(new Error('cancelled by user'))
    }

    return {
        promise,
        cancel
    }
}   

// so promise should return a promise, 
// and then this promise has a timer attach to it, 
// so i will just need to cancelle it before the time is up by using reject
// and i have to call it by using a function. 













/*
good code 

export function cancellableSleep(ms: number, cancelMS: number) {
    let timeId: NodeJS.Timeout 
    let rejectFn: (err: Error) => void 

    const promise = new Promise((resolve, reject) => {
        rejectFn = reject
        timeId = setTimeout(( ) => {
            resolve('🦖 Success')
        },ms)
    })

    const cancel = () => {
        clearTimeout(timeId)
        setTimeout(() => {
            rejectFn(new Error('🙈 cancelled by user'))
        }, cancelMS)
        
    }

    return {
        promise, 
        cancel
    }
}

*******************************

export function cancellableSleep(ms: number) {
    const cancel = (timeId: number, reject: Function) => {
        clearTimeout(timeId)
        reject (new Error('Cancelled by user!'))
    }
    return new Promise((resolve, reject) => {
        let timeId : number

        return {
            timeId : setTimeout(() => {
                resolve('success')
            }, ms),
            cancel: cancel(timeId: number, reject: any)
        }
    })
}
*/