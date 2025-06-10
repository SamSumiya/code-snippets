import { retry } from "../../async/retry";


describe('retry', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it ('should call retry and get a resolved value', async() => {
        // Arrange
        const fn = async () => {
            return Promise.resolve('🍀 Success') 
        }

        // Action 
        const promise = retry(fn, 1, 500)
        jest.advanceTimersByTime(500)
        
        // Assert
        await Promise.resolve(); // flush microtasks
        await expect(promise).resolves.toBe('🍀 Success')

    })
})