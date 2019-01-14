import { assert, expect } from "chai";

function getPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Hi')
        }, 1000);
    });
}

function* promiseGenerator() {
    for(;;){
        yield new Promise((res, rej) => {
            res(Math.random()*100);
        });
    }
}


beforeEach((d) => {
    console.log(`Waiting for the before each`);
    setTimeout(() => {
        console.log(`Resolved the beforeEach`);
        d()
    }, 200);
});

beforeEach('Await generator', async () => {
    const a = await promiseGenerator().next().value;
    console.log(`Got ${a}`);
    return a
});

beforeEach(() => {
    console.log('================')
})

it("should complete a 100% sure test with done called", (done: Function) => {
    assert.ok(true);
    done();
});

it("should complete an async test by returning a promise and NOT SPECIFYING A DONE FUNCTION", async () => {
   return getPromise().then(v => {
       console.log(`Got ${v} from promise`);
       expect(v).to.be.of.length.at.least(2, 'message from getPromise should be at least 2 of length');
       expect(v).not.to.be.of.length.at.least(4, 'message from getPromise should have a length smaller than 4');
   })
});

// If a parameter (done) is passed to `it`, we MUST call it and NOT RETURN a Promise
it("should complete the ", (done) => {
    getPromise().then(v => {
        console.log(`Got ${v} from promise`);
        done()
    })
 });
 
 it('should show something about an error', () => {
    return Promise.reject('Something went wrong')
 });

 it('should show something about an error b', () => {
    return Promise.reject('Something went wrong').catch(reason => assert.fail(reason))
 });

 it('a rejected promise will not fail', () => {
    Promise.reject('Simply to test a wrong value')
 });