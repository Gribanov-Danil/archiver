export class PriorityQueue<T> {
    public size: number
    public storage: Map<number, T[]>
    constructor() {
        this.size = 0
        this.storage = new Map()
    }

    public Enqueue(priority: number, item: T) {
        if (!this.storage.has(priority)) {
            this.storage.set(priority, [])
        }
        this.storage.get(priority)?.push(item)
        this.size++
    }

    public Dequeue(): T | undefined  {
        if (this.size === 0) {
            throw new Error('Priority queue is empty')
        }
        const array = Array.from(this.storage.values()).sort();
        for (const item of array) {
            if (item.length > 0) {
                return item.shift()
            }
        }

        throw new Error('Queue error')

    }
}
