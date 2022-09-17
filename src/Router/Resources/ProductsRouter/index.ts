import ProductsModel from '@Models/Products'
import { Express } from 'express'

/* It's a router for the products resource */
export default class ProductsRouter {
  constructor(private readonly app: Express) {
    this.app = app
    this.getAll()
  }

  getAll() {
    const route = '/resources/products'

    this.app.get(route, async (_req, res) => {
      try {
        const products = await ProductsModel.getAll()

        res.status(200).json(products)
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while getting all products' })
      }
    })

    return route
  }
}
