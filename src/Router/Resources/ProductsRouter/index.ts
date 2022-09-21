import Middlewares from '@Middlewares/index'
import ProductsModel from '@Models/Products'
import ProccessingLogsModel from '@Models/ProcessingLogs/index'
import { Express } from 'express'
import CSVReader from '@Services/CSVReader'
import Queuer from '@Services/Queuer'

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
        res
          .status(500)
          .json({ error: 'An error occurred while getting all products' })
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

    this.app.post(
      params.route,
      Middlewares.singleFileUpload('products_csv'),
      async (req, res) => {
        try {
          const { file } = req
          const { 1: fileExtension } =
            (file?.originalname.split('.') as string[]) ?? {}

          if (!file?.filename)
            res
              .status(400)
              .json({ error: 'Invalid request. Upload file is missing' })
          else if (fileExtension !== 'csv')
            res
              .status(400)
              .json({ error: 'Invalid file type.' })
          else {
            const jobId = await ProccessingLogsModel.create()

            await Queuer.addToQueue(
              CSVReader.readFile(file.path, async (_, data) => {
                try {
                  const isCSVValid = CSVReader.validateSchema(
                    [
                      'lm',
                      'name',
                      'free_shipping',
                      'description',
                      'price',
                      'category',
                    ],
                    data[0],
                  )

                  if (!isCSVValid) throw new Error("Invalid CSV file format")

                  await ProductsModel.createInBulkWithCSV(data)
                  await ProccessingLogsModel.updateLog(true, jobId as string)
                } catch (error) {
                  ProccessingLogsModel.markAsFailed(jobId as string)
                }
              }
              ),
            )

            res
              .status(202)
              .json({ message: 'File successfully uploaded', jobId })
          }
        } catch (error) {
          res
            .status(500)
            .json({ error: 'An error occurred while uploading file' })
        }
      },
    )

    return params
  }
}
