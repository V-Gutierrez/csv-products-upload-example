import PQueue from 'p-queue'

class Queuer {
  private readonly queue: PQueue

  /**
   * The constructor function is a special function that is called when an object is created from a
   * class
   * @param {PQueue} queueInstance - The instance of the queue that you want to use.
   */
  constructor(queueInstance: PQueue) {
    this.queue = queueInstance
  }

  /**
   * It takes a generic type T, and returns a promise that resolves to the same type T
   * @param {T} queueItem - T - This is the item that you want to add to the queue.
   * @returns A promise that resolves when the queueItem is done.
   */
  async addToQueue<T>(queueItem: T) {
    return this.queue.add(() => queueItem)
  }
}

export default new Queuer(new PQueue({ concurrency: 1 }))
