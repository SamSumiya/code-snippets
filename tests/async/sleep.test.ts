import { sleep } from "../../async/sleep"

describe('sleep', () => {

    beforeEach(() => {
        jest.useFakeTimers()
        jest.spyOn(global, 'setTimeout')
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    it('should resolve value after 1 second', async () => {
        const promise = sleep(1000)

        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000)
        jest.advanceTimersByTime(1000)
        await expect(promise).resolves.toBe('🍀 Success')
    })
})