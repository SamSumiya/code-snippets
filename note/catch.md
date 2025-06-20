

## .catch() throws an error

```
Promise.reject('original error')
    .catch((err) => {
        console.log('Caught:', err) // logs: Caught: orignal error 
        throw new Error('new error from catch') // throws a new error 
    })
    .then((val) => {
        console.log('this will not run:', val)
    })
    .catch((err) => {
        console.log('Second catch:', err.message) // logs "Second catch: new error from catch"
        return 'finally recovered' 
    }) 
    .then((val) => {
        console.log("Final:", val); // logs "Final: finally recovered"
    })
    
```


## Example 2: .catch() returns a rejected promise
```
Promise.reject('database error')
    .catch((err) => {
        console.log("Handling:", err); // logs "Handling: database error"

        // return a rejected promise instead of throwing

        return Promise.reject('fallback also failed');
    })
    .then((val) => {
        console.log("Won't reach here:", val); // skipped
    })
    .catch((err) => {
        console.log("Fallback failed:", err); // logs "Fallback failed: fallback also failed"
    })
```


### throw new Error(...) vs return Promise.reject(...)

```
// Using throw 
.catch((err) => {
    throw new Error('new error from catch')
})
.catch((err) => {
    console.log(err) // Error object with stack track, message, etc. 
    console.log(err.message) // new error from catch 
})

// Using Promise.reject()
.catch((err) => {
    return Promsise.reject('fallback also failed')
})
.catch((err) => {
    console.log(err) // Just the string 'fallback also failed' 
    console.log(err.message)
})

```

## 2. Error object vs any value
```
// throw creates an Error object (if you throw a string, it gets wrapped)
throw "just a string"; // becomes Error object
throw new Error("proper error"); // Error object with stack trace

// Promise.reject() can reject with ANY value
return Promise.reject("string");
return Promise.reject(42);
return Promise.reject({ code: 404, msg: "Not found" });
return Promise.reject(new Error("error object"));

```

## 3. Stack trace behavior
```
.catch((err) => {
  throw new Error('new error'); // NEW stack trace starts here
})

.catch((err) => {
  return Promise.reject(new Error('rejected error')); // Stack trace from Error creation
})
```

## 4. Practical example

```
Promise.reject("original")
  .catch((err) => {
    // Method 1: throw
    throw new Error(`Failed to handle: ${err}`);
  })
  .catch((err) => {
    console.log(err instanceof Error); // true
    console.log(err.message); // "Failed to handle: original"
  });

Promise.reject("original")
  .catch((err) => {
    // Method 2: Promise.reject
    return Promise.reject(`Failed to handle: ${err}`);
  })
  .catch((err) => {
    console.log(err instanceof Error); // false
    console.log(err); // "Failed to handle: original"
  });
```

### Bottom line: throw is more conventional for errors (creates Error objects), while Promise.reject() gives you more control over what value gets rejected with.




```
Promise.reject('fail')
    .catch(console.log('handled')) // console.log runs NOW, returns undefined 
    .then(() => console.log('done'))

// this is equivalent to: 

console.log('handled') // Logs 'handled' immediately
Promise.reject('fail')
    .catch(undefined)
    .then(() => console.log("done"))
```


```
Promise.reject("fail")
  .catch(console.log("handled"))
  .then(() => console.log("done"));
```

1. Promise.reject('fail') - Creates a rejected promise
2. .catch(???) - JS needs to figure out what to pass to .catch()
3. console.log('handled') - this gets evaluated Now to determin the argument 
    - console.log("handled") executes immediately
    - logs "handled"
    - Returns undefined
4. .catch(undefined) - Now JavaScript can call .catch() with undefined

```
Promise.reject("fail")
  .catch(setTimeout(() => console.log('aa'), 0)
  .then(() => console.log("done"));
```
1. Promise.reject('fail') - Creates a rejected promise
2. .catch(...) - JS needs to evaluate the argument 
3. setTimeout(...) - this executes immediately 
    - schedules the callback to run after 0ms
    - returns a timer ID 
4. .catch(timerId) - now JS calls .catch() with the timer ID

#### what happens
- the timer ID is not a function
- the rejection 'fail' remains unhandled
- .then() gets skipped - still have rejected promise
- you get an "unhandled Promise rejection" error
- meanwhile, setTimeout fires and logs 'aa' after delay



## 1. Asynchronous Execution Model
Promises are asynchronous - they don't resolve/reject immediatly ```.catch()``` needs to store something to execute later when the rejection happens



``` .catch() ``` 
```
promise.then(undefined, onRejected) 
```
### So when a promise is rejected, the rejection handler ( .catch() callback ) is: 
- scheduled as a microtask
- runs after the current call stack is done
- runs before macrotasks like setTimeout


## 5. How would you write a retry logic using async/await and for loop?

```

async funciton retry(fn, retries = 3 ) {

    for ( let i = 0; i < retries; i ++ ) {
        try {
            return await fn() 
        } catch(err) {
            if( i === retries -1  ) {
                return Promise.reject(new Error('Failed all attempts'))
            }
        }
    }
}
```

## 🔁 Behavior of return await fn():
#### 🔹 If fn() resolves successfully:
- ``` await fn() ``` evaluates to a value
- ``` return ``` returns that value
#### 🔹 If fn() rejects (throws an error):
- ``` await ``` throws - the rejection becomes a real ``` throw ``` 
- Execution jumps into the nearest ```catch``` block
- X return is not reached - control flow breaks out


``` return Promise.reject() ``` 
- immediately reject without any additional logic
- at the end of the function
- explicit about returning a rejected promise

``` await Promise.reject() ```
- rejection to act like a thrown error
- error handling logic after it 
- consistent with other ``` await ``` calls in function

