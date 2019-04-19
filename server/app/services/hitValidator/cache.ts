import { ICacheElement, IDataToCache } from "./interfaces";

export class Cache<T> {

    private readonly ON_NOTFOUND_ERROR: string =
    "The element wanted has not been found in the cache. \nError message: ";

    private storage: ICacheElement<T>[];

    public constructor(private cacheSize: number) {
        this.storage = [];
    }

    public insert(entry: IDataToCache<T>): void {
        if (!this.contains(entry.dataUrl)) {
            const elementToInsert: ICacheElement<T> = {
                dataToCache: entry,
                obsolescenceDegree: 0,
            };
            this.storage[this.leastRecentlyUsedIndex()] = elementToInsert;
            this.updateLRUPolitic(elementToInsert);
        }
    }

    public contains(url: string): boolean {
        return this.storage.some((cachedElement: ICacheElement<T>): boolean => {
            return cachedElement.dataToCache.dataUrl === url;
        });
    }

    public get(url: string): T {

        try {
            const foundElement: ICacheElement<T> = this.storage.filter((element: ICacheElement<T>) => {
                return element.dataToCache.dataUrl === url;
            })[0];
            this.updateLRUPolitic(foundElement);

            return foundElement.dataToCache.data;
        } catch (error) {
            throw new TypeError(this.ON_NOTFOUND_ERROR + error.message);
        }
    }

    private updateLRUPolitic(elementRecentlyAccessed: ICacheElement<T>): void {
        this.storage.forEach((elementCached: ICacheElement<T>) => {
            if (elementCached !== elementRecentlyAccessed) {
                elementCached.obsolescenceDegree++;
            }
        });
    }

    private leastRecentlyUsedIndex(): number {
        if (this.storage.length < this.cacheSize) {
            return this.storage.length;
        }

        return this.findMaxObsolescenceIndex();
    }

    private findMaxObsolescenceIndex(): number {

        const allObsolescences: number[] = this.storage.map((element: ICacheElement<T>) => element.obsolescenceDegree);

        let maxFound:   number = 0;
        let indexOfMax: number = 0;

        allObsolescences.forEach((obsol: number, index: number) => {
            if (obsol > maxFound) {
                maxFound    = obsol;
                indexOfMax  = index;
            }
        });

        return indexOfMax;
    }
}
