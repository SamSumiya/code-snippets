import { sleep } from "../../async/sleep"

describe('sleep', () => {

    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('should resolve value after 1 second', async () => {
        const promise = sleep(1000)

        jest.advanceTimersByTime(1000)
        await expect(promise).resolves.toBe('🍀 Success')
    })
})