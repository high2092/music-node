export class CircularQueue<T> {
  private capacity: number;
  private queue: Array<T>;
  private head: number;
  private tail: number;
  private size: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.queue = new Array(capacity);
    this.head = 0;
    this.tail = -1;
    this.size = 0;
  }

  enqueue(item: T) {
    if (this.isFull()) {
      this.dequeue();
    }

    this.tail = (this.tail + 1) % this.capacity;
    this.queue[this.tail] = item;
    this.size++;
  }

  dequeue(): T {
    if (this.isEmpty()) {
      return null;
    }

    const removedItem = this.queue[this.head];
    this.queue[this.head] = null;
    this.head = (this.head + 1) % this.capacity;
    this.size--;

    return removedItem;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  getSize(): number {
    return this.size;
  }

  clear() {
    this.queue = new Array(this.capacity);
    this.head = 0;
    this.tail = -1;
    this.size = 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    for (let i = 0; i < this.size; i++) {
      result.push(this.queue[current]!);
      current = (current + 1) % this.capacity;
    }
    return result;
  }
}
