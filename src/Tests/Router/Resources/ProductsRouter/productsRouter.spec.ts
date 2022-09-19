import ProductsModel from '@Models/Products'
import ProcessingLogsModel from '@Models/ProcessingLogs'
import Router from '@Router/index'
import request from 'supertest'
import express from 'express'
import ProductsRouter from '@Router/Resources/ProductsRouter'
import { productSample } from '@Tests/Mocks'

const AppInstance = express()
const RouterInstance = new Router(AppInstance)

const ExpressInstance = RouterInstance.useExpressInstance()
const TestedRouterInstance = new ProductsRouter(ExpressInstance)

const { route: GET_ALL_ROUTE, method: GET_ALL_METHOD } = TestedRouterInstance.getAll()
const { route: UPLOAD_FILE_ROUTE, method: UPLOAD_FILE_METHOD } = TestedRouterInstance.uploadProducts()

describe('Product Resource Routes', () => {
  test(`responds to  ${GET_ALL_METHOD} ${GET_ALL_ROUTE} with all available products`, async () => {
    const ProductsModelMock = jest.fn()
    const expectedResponse = [productSample]

    jest
      .spyOn(ProductsModel, 'getAll')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue(expectedResponse)

    const response = await request(ExpressInstance).get(GET_ALL_ROUTE)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })

  test(`responds to  ${UPLOAD_FILE_METHOD} ${UPLOAD_FILE_ROUTE} with jobId and success feedback`, async () => {
    const ProcessingLogsModelMock = jest.fn()
    const expectedJobId = 'JOB_ID'
    const fakeFile = Buffer.alloc(1024 * 1024 * 10, '.')

    jest
      .spyOn(ProcessingLogsModel, 'create')
      .mockImplementation(ProcessingLogsModelMock)
      .mockResolvedValue(expectedJobId)

    const response = await request(ExpressInstance).post(UPLOAD_FILE_ROUTE).attach('products_csv', fakeFile, {
      filename: 'test.csv'
    })


    expect(response.statusCode).toBe(202)
    expect(response.body).toEqual({
      "message": "File successfully uploaded",
      "jobId": expectedJobId
    })
  })

  test(`responds to  ${UPLOAD_FILE_METHOD} ${UPLOAD_FILE_ROUTE} with error if no file is provided`, async () => {
    const ProcessingLogsModelMock = jest.fn()

    jest
      .spyOn(ProcessingLogsModel, 'create')
      .mockImplementation(ProcessingLogsModelMock)

    const response = await request(ExpressInstance).post(UPLOAD_FILE_ROUTE)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid request. Upload file is missing' })
  })
})
