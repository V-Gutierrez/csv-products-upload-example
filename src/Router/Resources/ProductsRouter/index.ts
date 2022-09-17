import { Express } from 'express'

/* It's a router for the products resource */
export class ProductsRouter {
  constructor(private readonly app: Express) {
    this.getAll()
  }

  /**
   * It returns a function that takes a request and a response object, and then tries to return a
   * status of 200 with a products array, or a status of 500 with an error message if an error occurs
   * @returns An array of products
   */
  getAll() {
    return this.app.get('/resources/products', (req, res) => {
      try {
        res.status(200).json([])
      } catch (error) {
        res.status(500).json({error: "An error occurred while getting all products"})
      }
    })
  }

}
