import { ProductsRouter } from './Resources/Products/index'
import { Express } from 'express'
import Middlewares from '@Middlewares/index'

export default class Router {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)

    new ProductsRouter(this.app)
  }
}
