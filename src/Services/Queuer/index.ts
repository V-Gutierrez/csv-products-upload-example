import PQueue from 'p-queue'

class Queuer {
  queue: PQueue

  constructor() {
    this.queue = new PQueue({ concurrency: 1 })
  }

  async addToQueue<T>(queueItem: T) {
    return this.queue.add(() => queueItem)
  }
}

export default new Queuer()
