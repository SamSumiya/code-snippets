
async function processItem(item: string): Promise<string> {
    console.log(`item: ${item}`)
    return item
} 

async function sleepInThrottle(sleepMs: number= 500) {
    return new Promise((resolve) => setTimeout(resolve, sleepMs))
}

async function throttledLoop(items: string[], sleepMS = 500) {

    for ( const item of items) {
        await processItem(item)
        await sleep(sleepMS)
    }
}

(async () => {
  await throttledLoop(['A', 'B'] );
  console.log("✅ All done");
})();
