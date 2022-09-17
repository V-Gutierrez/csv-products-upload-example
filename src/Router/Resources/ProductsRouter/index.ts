import Middlewares from '@Middlewares/index'
import ProductsModel from '@Models/Products'
import ProccessingLogsModel from '@Models/ProcessingLogs/index'
import { Express } from 'express'

/* It's a router for the products resource */
export default class ProductsRouter {
  constructor(private readonly app: Express) {
    this.app = app
    this.getAll()
    this.uploadProducts()
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

  uploadProducts() {
    const route = '/resources/products'

    this.app.post(route, Middlewares.singleFileUpload('products_csv'), async (req, res) => {
      try {
        // const { file } = req
        const log = await ProccessingLogsModel.create()

        // Send file to queue

        res.status(202).json({ message: 'File successfully uploaded', jobId: log })
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while uploading file' })
      }
    })

    return route
  }
}
