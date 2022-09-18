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

  /**
   * It creates a route that returns all products from the database
   * @returns An object with the route and method
   */
  getAll() {
    const params = { route: '/resources/products', method: 'GET' }

    this.app.get(params.route, async (_req, res) => {
      try {
        const products = await ProductsModel.getAll()

        res.status(200).json(products)
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while getting all products' })
      }
    })

    return params
  }

  /**
   * It creates a new log entry in the database, then sends the file to a queue for processing
   * @returns An object with the route and method of the endpoint.
   */
  uploadProducts() {
    const params = { route: '/resources/products', method: 'POST' }

    this.app.post(params.route, Middlewares.singleFileUpload('products_csv'), async (req, res) => {
      try {
        // const { file } = req
        // const { 1: fileExtension } = file?.originalname.split('.') as string[]

        const log = await ProccessingLogsModel.create()

        // if(!file) res.status(400).json({ message: 'Invalid request. Upload file is missing'})
        // else if(fileExtension !== 'csv') res.status(400).json({ message: 'Invalid file type.'})
        // else {
        // Send file to queue the operation: READ, VALIDATE FORMAT, PARSE, AND WRITE IN DB
        // }


        res.status(202).json({ message: 'File successfully uploaded', jobId: log })
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while uploading file' })
      }
    })

    return params
  }
}
