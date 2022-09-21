import { Express } from 'express'
import Middlewares from '@Middlewares/index'
import ProductsRouter from '@Router/Resources/ProductsRouter'
import StatusRouter from '@Router/Status/StatusRouter'

/* It's a class that creates a new instance of the Middlewares class and the other Router classes */
export default class Router {
  constructor(private readonly app: Express) {
    this.app = app

    new Middlewares(this.app)
    new ProductsRouter(this.app)
    new StatusRouter(this.app)
  }

  /**
   * It returns the express instance
   * @returns The express instance
   */
  useExpressInstance() {
    return this.app
  }
}
