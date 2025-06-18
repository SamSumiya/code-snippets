export async function retryWithPromise<T>(fn: () => Promise<T>, retries: number, delayMS: number): Promise<T> {

    return new Promise(( resolve, reject ) => {
        const attempt = (remainingRetries: number) => {
            fn()
            .then(resolve)
            .catch(err => {
                if ( remainingRetries <= 0 ) {
                    return reject( err )
                }
                setTimeout(() => {
                    attempt(remainingRetries - 1)
                }, delayMS)
            })
        }
        
        attempt(retries)
    })
}