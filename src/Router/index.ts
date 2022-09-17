import { ProductsRouter } from './../../.history/src/Router/Resources/Products/index_20220916214314'
import { Express } from 'express'
import Middlewares from '@Middlewares/index'

/* It's a class that creates a new instance of the Middlewares class and the other Router classes */
export default class Router {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)
    new ProductsRouter(this.app)
}

  /**
   * It returns the express instance
   * @returns The express instance
   */
  useExpressInstance() {
    return this.app
  }
}
