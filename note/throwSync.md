#JavaScript Error Handling: Synchronous vs Asynchronous

🔁 What Synchronous Throws Mean
A synchronous throw happens immediately when the function is invoked, not after a Promise is returned.
Synchronous Function Example
javascriptfunction badFn() {
    throw new Error('Boom!'); // throw right now
}

badFn()
Key Point: The error is thrown before it ever returns a Promise - inside another function like retry(), without try/catch, the program will crash.
Asynchronous Function Example
javascriptasync function badAsyncFn() {
    throw new Error('Boom!')
}

badAsyncFn() // returns a Promise that rejects
Key Point: The error is wrapped in a Promise, and can be handled using .catch()
🚨 The Problem with Retry Logic
Most retry logic looks like:
javascriptfn()
    .then(resolve)
    .catch(retryOrFail)
Issue: If fn() throws synchronously, then:

.then(...) is never even attached — fn() throws before that line finishes
You get an unhandled exception unless you're ready for it

Broken Retry Example
javascriptfunction retry(fn) {
    return new Promise((resolve, reject) => {
        fn().then(resolve).catch(reject) 
    })
}

retry(() => {
    throw new Error('sync fail') // this crashes 
})
✅ Solutions for Mixed Sync/Async Handling
Solution 1: Using Promise Constructor (Non-async context)
javascriptreturn new Promise((resolve, reject) => {
    try {
        const result = fn(); // This might throw (sync)
        Promise.resolve(result) // This safely wraps both values and promises
            .then(resolve)
            .catch(reject);
    } catch (err) {
        reject(err); // This handles a sync throw
    }
})
Use when:

Not inside an async function
Need to manually bridge sync and async behavior

Solution 2: Using async/await
javascripttry {
    const result = await fn()
    resolve(result) 
} catch(err) {
    return reject(err)
}
Use when: Inside an async function
🔹 Error Handling Mechanisms
try/catch

Catches synchronous errors only
Only works within the current call stack
If error is thrown inside a Promise, try/catch won't catch it unless used with await

javascripttry {
    fn(); // if fn throws synchronously 
} catch(err) {
    // catches synchronous errors only 
}
.then().catch()

Handles asynchronous errors via Promises
Works after a Promise is created
Captures rejection after the fact, not at the time of execution

javascriptfn()
    .then(res => /* handle success */)
    .catch(err => {
        // catches promise rejection
    })
🔄 Async Function Equivalency
javascriptasync function badAsyncFn() {
    throw new Error('Boom!')
}

// Same as:
function badAsyncFn() {
    return Promise.reject(new Error('Boom!'))
}
Remember:

async functions always return a Promise
throw inside an async function becomes a rejected Promise

📝 Practice Questions
Question 1: Identify the Problem
javascriptfunction processData(fn) {
    return fn()
        .then(data => data.toUpperCase())
        .catch(err => console.log('Error:', err.message));
}

// What happens if this is called?
processData(() => {
    throw new Error('Sync error');
});
Answer: [Fill in your answer]
Question 2: Fix the Code
javascript// Fix this retry function to handle both sync and async errors
function retry(fn, maxAttempts = 3) {
    // Your implementation here
}
Your Solution: [Write your corrected code]
Question 3: True or False

 try/catch can catch errors from Promises without await
 async functions automatically convert thrown errors to rejected Promises
 Promise.resolve() can safely wrap both values and Promises
 Synchronous throws in callback functions can crash retry logic

Answers: [Fill in T/F and explanations]
🎯 Key Takeaways
Quick Reference

Sync errors: Use try/catch
Async errors: Use .catch() or try/catch with await
Mixed scenarios: Wrap in Promise constructor with try/catch

Common Patterns to Remember

[Pattern Name]: [Description]
[Pattern Name]: [Description]
[Pattern Name]: [Description]

🧠 Memory Aids
Acronym: [Create your own]

[Letter]: [Meaning]
[Letter]: [Meaning]
[Letter]: [Meaning]

Mental Model
[Describe how you visualize sync vs async error flow]
📚 Further Study
Related Topics to Explore

 Error boundaries in React
 Node.js unhandled rejection handling
 Promise.allSettled() vs Promise.all() error behavior
 Custom error classes and error handling strategies

Code Challenges

[Challenge Title]: [Brief description]
[Challenge Title]: [Brief description]
[Challenge Title]: [Brief description]

Real-World Applications

Scenario 1: [Where you might encounter this]
Scenario 2: [Where you might encounter this]
Scenario 3: [Where you might encounter this]
