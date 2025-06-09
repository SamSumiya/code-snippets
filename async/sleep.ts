export function sleep(delayMS: number): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('🍀 Success')
        }, delayMS)
    })
}