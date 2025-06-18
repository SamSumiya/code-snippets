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



async function retry2<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  return fn().catch(async (err) => {
    if (retries <= 0) throw new Error('failed…');

    await new Promise((res) => setTimeout(res, 500));

    return retry2(fn, retries - 1);
  });
}


// let count = 0 

// export const flakyFunction = () => {
//     return new Promise((resolve, reject) => {
//         count++
//         console.log("Attempt", count);

//         if ( count < 3 ) {
//             return reject('❌ Fail')
//         }

//         resolve(`🍀 Success at attempt ${count}`)
//     })
// }


// retry(flakyFunction, 5, 1000)
//     .then(console.log)
//     .catch(console.log)