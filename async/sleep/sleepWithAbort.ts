function sleepWithAbort(sleepMS: number, signal?: AbortSignal): Promise<string> {

    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            return reject(new Error('Already aborted'))
        }

        const timeId = setTimeout(() => resolve('✅ Done'), sleepMS)

        signal?.addEventListener('abort', () => {
            clearTimeout(timeId)
            reject(new Error('aborted'))
        }) 
    })
}