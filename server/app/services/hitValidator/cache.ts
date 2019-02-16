export interface ICacheElement {
    imageUrl:   string;
    buffer:     Buffer;
}
export class Cache {

    private storage: ICacheElement[];
    private insertionIndex: number;

    public constructor(private cacheSize: number) {
        this.storage = [];
        this.insertionIndex = 0;
    }

    public insert(entry: ICacheElement): void {
        if (!this.contains(entry.imageUrl)) {
            this.storage[this.insertionIndex] = entry;
            this.updateInsertionIndex();
        }
    }

    public contains(imageUrl: string): boolean {
        return this.storage.some((cachedElement: ICacheElement): boolean => {
            return cachedElement.imageUrl === imageUrl;
        });
    }


    private updateInsertionIndex(): void {
        this.insertionIndex = ++this.insertionIndex % this.cacheSize;
    }
}
