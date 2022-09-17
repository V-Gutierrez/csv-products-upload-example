import { ProductsRouter } from './../../.history/src/Router/Resources/Products/index_20220916214314'
import { Express } from 'express'
import Middlewares from '@Middlewares/index'

export default class Router {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)
    new ProductsRouter(this.app)
}

  useExpressInstance() {
    return this.app
  }
}
