import { retry } from "../../async/retry"

let setTimeoutSpy: jest.SpyInstance

describe('retry', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    it ('should call retry and get a resolved value first time', async() => {
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

    it ('should call retry and reject first time', async () => {
        const fn = async () => {
            throw new Error('error')
        }
        // Action && Assert
        await expect(retry(fn, 0, 500)).rejects.toThrow('error')
    })

    it('should succeed after 2 attempts', async () => {
        // Arrange
        let attempt = 0 
        let fn = jest.fn(() => {
            attempt ++ 
            return attempt < 3 
            ? Promise.reject('fail')
            : Promise.resolve('success')
        })

        // Act
        const promise = retry(fn, 3, 500)

        // attempt 1 2 
        jest.advanceTimersByTime(1000)
        await jest.runAllTimersAsync();  

        // attempt 3
        await expect(promise).resolves.toBe('success')
        expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should fail after max retries exhausted', async () => {
        const fn = jest.fn(() => Promise.reject(new Error('fail ❌'))) 

        const promise = retry(fn, 3, 500 )

        // Suppress unhandled rejection warnings during retries
        promise.catch(() => {}) 

        jest.advanceTimersByTime(3000)
        await jest.runAllTimersAsync(); 

        // assert 
        await expect(promise).rejects.toThrow('fail ❌')
        expect(fn).toHaveBeenCalledTimes(4)
    })

    it('should retry immediately if delay is 0', async () => {
        let callCount = 0
        const fn = () => {
            callCount++
            return callCount < 3
            ? Promise.reject('fail')
            : Promise.resolve('success')
        }

        const promise = retry(fn, 3, 0) 

        jest.advanceTimersByTime(100)
        await jest.runAllTimersAsync()

        await expect(promise).resolves.toBe('success')
        expect(callCount).toBe(3)
    })

    it('should fail immediately if retries is negative', async () => {
        const fn = () => Promise.reject(new Error('fail'))

        await expect( retry(fn, -1, 1000)).rejects.toThrow('fail')
    })

    it('should retry with correct delay', async () => {
        let callCount = 0
        const fn = () => {
            callCount++ 
            return callCount <= 2 
            ? Promise.reject('fail')
            : Promise.resolve('success')
        }

        const promise = retry(fn, 3, 500)
        
        jest.advanceTimersByTime(1000)
        await jest.runAllTimersAsync()

        await expect(promise).resolves.toBe('success')
        expect(setTimeoutSpy).toHaveBeenCalledTimes(2)
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500)
    })
})