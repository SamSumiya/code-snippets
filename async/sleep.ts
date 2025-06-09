export function sleep(delayMS: number): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('🍀 Success')
        }, delayMS)
    })
}


sleep(1000).then(console.log)