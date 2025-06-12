import { sleep } from "../async/sleep/sleep";


function runDemo1(ms: number): Promise<{result: string, elapse: number}> {
    const startTime = Date.now()
    return sleep(ms).then( result => {
        return {
        result, 
         elapse: Date.now() - startTime
        }
    })
}

async function runDemo2(ms: number): Promise<{result: string, elapse: number}> {
    const startTime = Date.now() 
    const result = await sleep(ms)
    const endTime = Date.now()

    return {
        result, 
        elapse: endTime - startTime 
    }
}

// Run with .then
// runDemo2(1000).then(console.log)


(async () => {
    const result = await runDemo2(1000)
    console.log(result);
})()