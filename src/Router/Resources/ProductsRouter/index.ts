/* eslint-disable camelcase */
import Middlewares from '@Middlewares/index'
import ProductsModel from '@Models/Products'
import ProcessingLogsModel from '@Models/ProcessingLogs/index'
import { Express } from 'express'
import CSVReader from '@Services/CSVReader'
import Queuer from '@Services/Queuer'
import { Products as ProductType } from '@prisma/client'

/* It's a router for the products resource */
export default class ProductsRouter {
  constructor(private readonly app: Express) {
    this.app = app
    this.getAll()
    this.uploadProducts()
    this.delete()
    this.update()
  }

  /**
   * It creates a route that returns all products from the database
   * @returns The route and method of the endpoint
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
   * @returns The route and method of the endpoint
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
            res.status(400).json({ error: 'Invalid file type.' })
          else {
            const jobId = await ProcessingLogsModel.create()

            /* It's sending the file to a queue for processing. */
            await Queuer.addToQueue(
              CSVReader.readFile(file.path, async (err, data) => {
                try {
                  if (err) throw new Error('Failure reading CSV file')

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

                  if (!isCSVValid) throw new Error('Invalid CSV file format')

                  await ProductsModel.createInBulkWithCSV(data)
                  await ProcessingLogsModel.updateLog(true, jobId as string)
                } catch (error) {
                  await ProcessingLogsModel.markAsFailed(jobId as string)
                }
              }),
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

  /**
   * It deletes a product from the database
   * @returns The route and method of the endpoint
   */
  delete() {
    const params = { route: '/resources/products/:productId', method: 'DELETE' }

    this.app.delete(params.route, async (req, res) => {
      try {
        const { productId } = req.params

        const product = await ProductsModel.getOne(productId)

        if (!product) {
          res.status(404).json({
            error: 'Product not found',
          })
        } else {
          await ProductsModel.delete(productId)

          res.status(200).json({
            message: `Product ${productId} deleted successfully`,
          })
        }
      } catch (error) {
        res.status(500).json({ error: 'Error deleting product' })
      }
    })

    return params
  }

  /**
   * It updates a product in the database
   * @returns The route and method of the endpoint.
   */
  update() {
    const params = { route: '/resources/products/:productId', method: 'PATCH' }

    this.app.patch(params.route, async (req, res) => {
      try {
        const { productId } = req.params
        const { category, description, free_shipping, name, price } =
          req.body as ProductType

        const newProductData = {
          category,
          description,
          free_shipping,
          name,
          price,
        }

        const noRequestBodyIsSent =
          Object.values(newProductData).every((value) => value === undefined) ||
          !req.body
        const product = await ProductsModel.getOne(productId)

        if (!product) {
          res.status(404).json({ message: 'Product not found' })
        } else if (noRequestBodyIsSent) {
          res.sendStatus(204)
        } else {
          const updatedProduct = await ProductsModel.update(
            productId,
            newProductData,
          )

          res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
          })
        }
      } catch (error) {
        res.status(500).json({ error: 'Error editing product' })
      }
    })

    return params
  }
}
