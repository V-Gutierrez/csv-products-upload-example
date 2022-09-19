import Router from '@Router/index'
import express from 'express'

/* The Server class is a class that creates an instance of the express framework and listens on a port. */
class Server {
  constructor(private app = express()) {
    const DEFAULT_LOCAL_PORT = 5000

    this.app.listen(
      process.env.PORT || DEFAULT_LOCAL_PORT,
      () => new Router(app),
    )
  }
}

new Server()
