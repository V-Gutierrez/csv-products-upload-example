import { Express } from 'express'
import Middlewares from '@Middlewares/index'
import ProductsRouter from '@Router/Resources/ProductsRouter'
import JobsRouter from '@Router/Resources/StatusRouter'

/* It's a class that creates a new instance of the Middlewares class and the other Router classes */
export default class Router {
  constructor(private readonly app: Express) {
    this.app = app

    new Middlewares(this.app)
    new ProductsRouter(this.app)
    new JobsRouter(this.app)
  }

  /**
   * It returns the express instance
   * @returns The express instance
   */
  useExpressInstance() {
    return this.app
  }
}
