import { sleep } from "./sleep";

export async function sleepWithTimeoutRace(sleepMS: number, timeoutMS: number) {
    return Promise.race([
        sleep(sleepMS),
        new Promise((_,reject) => setTimeout(() => {
            reject(new Error('failed before sleep')) 
        }, timeoutMS))
    ])
}

sleepWithTimeoutRace(102, 101)
    .then(console.log)
    .catch(console.error)


/* 
If sleep() and the timeout don’t run at exactly the same time, how does Promise.race() know to reject first?

both timers are started immediately and independently - almost within the same JS tick - and JS even loop evexutes whichever finishes first

Even though they’re not truly running in parallel, they are scheduled to fire independently, and the event loop handles the first one that’s ready.



*/