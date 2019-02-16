import * as chai from "chai";
import * as spies from "chai-spies";
import { Cache, ICacheElement } from "../cache";

// tslint:disable:no-magic-numbers no-any

let cache: Cache;

const urls: string[] = ["a", "b", "c", "d", "e"];

const buffers: Buffer[] = [
    Buffer.from([0, 1, 2]),
    Buffer.from([12, 13, 24]),
    Buffer.from([34, 56, 54]),
    Buffer.from([45, 1, 78]),
    Buffer.from([4, 123, 232]),
];

const elements: ICacheElement[] = [
    { imageUrl: urls[0], buffer: buffers[0]},
    { imageUrl: urls[1], buffer: buffers[1]},
    { imageUrl: urls[2], buffer: buffers[2]},
    { imageUrl: urls[3], buffer: buffers[3]},
    { imageUrl: urls[4], buffer: buffers[4]},
];

describe("Cache tests", () => {

    beforeEach(() => {
        cache = new Cache(3);
        chai.use(spies);
    });

    it("should create an object of type Cache", (done: Function) => {

        chai.expect(new Cache(3)).instanceOf(Cache);
        done();
    });

    it("should be able to store an object of type ICachedElement", (done: Function) => {

        const spy: any = chai.spy.on(cache, "updateInsertionIndex");
        cache.insert(elements[0]);

        chai.expect(spy).to.have.been.called();
        done();
    });

    it("should be inserting elements without loss until cache size is reached", (done: Function) => {

        cache = new Cache(2);
        cache.insert(elements[0]);
        cache.insert(elements[1]);

        const element0isCached: boolean = cache.contains(elements[0].imageUrl);
        const element1isCached: boolean = cache.contains(elements[1].imageUrl);

        chai.expect(element0isCached && element1isCached).to.equal(true);
        done();
    });

    it("should be overwriting an element once cache size is reached", (done: Function) => {

        cache = new Cache(2);
        cache.insert(elements[0]);
        cache.insert(elements[1]);
        cache.insert(elements[2]);

        const element0isCached: boolean = cache.contains(elements[0].imageUrl);
        chai.expect(element0isCached).to.equal(false);
        done();
    });

    it("should not be inserting element that is already cached", (done: Function) => {

        cache = new Cache(2);
        cache.insert(elements[0]);
        cache.insert(elements[1]);
        cache.insert(elements[0]);
        cache.insert(elements[0]);

        const element1isCached: boolean = cache.contains(elements[1].imageUrl);

        chai.expect(element1isCached).to.equal(true);
        done();
    });

});
