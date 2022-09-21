import PQueue from 'p-queue'

class Queuer {
  private readonly queue: PQueue

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
