export async function sleepWithTimeoutManual(sleepMS: number, timeoutMS: number) {
    return new Promise((resolve, reject) => {
        let settled = false 

        const timeoutID = setTimeout(() => {
            if ( settled ) return 
            settled = true 
            clearTimeout(sleepID)
            reject(new Error("⏰ Timeout before sleep resolved"));
        }, timeoutMS) 

        const sleepID = setTimeout(() => {
            if ( settled ) return 
            settled = true 
            clearTimeout(timeoutID)
            resolve("✅ Slept successfully");
        }, sleepMS)
    })
}

sleepWithTimeoutManual(100, 101)
    .then(console.log)
    .catch(console.error)