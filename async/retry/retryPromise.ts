export function retry<T>(fn: () => Promise<T>, retries: number = 3): Promise<T> {
    return fn()
        .then((res) => res) 
        .catch((err) => {
            if ( retries <= 0 ) {
                return Promise.reject(err); 
            }
            return new Promise((resolve) => {
                setTimeout(resolve, 500)
            }).then(() => retry(fn, retries - 1 ))
        })
}


/*
retry(fn, 3)
 └─ fn() fails
     └─ .catch triggered
         └─ wait 500ms
             └─ retry(fn, 2)
                 └─ fn() fails again
                     └─ .catch again
                         └─ wait 500ms
                             └─ retry(fn, 1)
                                 └─ fn() succeeds ✅
*/























/*


export async function retryPromise<T>(fn: () => Promise<T>, retries: number, delayMS: number): Promise<T> {

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

*/