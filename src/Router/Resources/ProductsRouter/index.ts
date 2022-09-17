import { Express } from 'express'

/* It's a router for the products resource */
export default class ProductsRouter {
  constructor(private readonly app: Express) {
    this.app = app
    this.getAll()
  }

  getAll() {
    const route = '/resources/products'

    this.app.get(route, (_req, res) => {
      try {
        res.status(200).json([])
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while getting all products' })
      }
    })

    return route
  }
}
