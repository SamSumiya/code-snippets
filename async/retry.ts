export async function retry<T>(fn: () => Promise<T>, retries: number, delayMS: number): Promise<T> {

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