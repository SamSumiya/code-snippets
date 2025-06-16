function processItem2(item: string): Promise<string> {
    return new Promise<string>((resolve) => {
        console.log(`Item: ${item}`)
        resolve(item)
    })
}

function sleepThen(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}


function throttledLoopWithThen(items: string[]): Promise<string> {
    let chain: Promise<string> = Promise.resolve('') 

    for (let item of items) {
        chain = chain
            .then(() => processItem2(item))
            .then((result) => {
                return sleepThen(1000).then(() => result)
            }) 
    }

    return chain  
}

throttledLoopWithThen(['A', 'B']).then(() => {
    console.log('✅ All done');
});
