import { Express } from 'express'

export class ProductsRouter {
  constructor(private readonly app: Express) {
    this.getAll()
  }

  getAll() {
    this.app.get('/resources/products', (req, res) => {
      try {
        res.status(200).json([])
      } catch (error) {
        res.status(500).json({error: "An error occurred while getting all products"})
      }
    })
  }

}
