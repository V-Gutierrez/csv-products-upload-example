import ProductsModel from '@Models/Products'
import ProcessingLogsModel from '@Models/ProcessingLogs'
import Router from '@Router/index'
import request from 'supertest'
import express from 'express'
import ProductsRouter from '@Router/Resources/ProductsRouter'
import { ProcessingLogs } from '@Clients/Prisma'
import { fakeFile, processingLog, productSample } from '@Tests/Mocks'

const AppInstance = express()
const RouterInstance = new Router(AppInstance)

const ExpressInstance = RouterInstance.useExpressInstance()
const TestedRouterInstance = new ProductsRouter(ExpressInstance)

const { route: GET_ALL_ROUTE, method: GET_ALL_METHOD } =
  TestedRouterInstance.getAll()

const { route: UPLOAD_FILE_ROUTE, method: UPLOAD_FILE_METHOD } =
  TestedRouterInstance.uploadProducts()

const { route: DELETE_PRODUCT_ROUTE, method: DELETE_PRODUCT_METHOD } =
  TestedRouterInstance.delete()

const { route: UPDATE_ROUTE, method: UPDATE_METHOD } =
  TestedRouterInstance.update()

describe('Product Resource Routes', () => {
  const ProductsModelMock = jest.fn()
  const ProcessingLogsModelMock = jest.fn()
  const PrismaClientMock = jest.fn()

  beforeAll(() => {
    jest.clearAllMocks()
  })

  test(`responds to  ${GET_ALL_METHOD} ${GET_ALL_ROUTE} with all available products`, async () => {
    const expectedResponse = [productSample]

    jest
      .spyOn(ProductsModel, 'getAll')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue(expectedResponse)

    const response = await request(ExpressInstance).get(GET_ALL_ROUTE)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
  test(`responds to  ${GET_ALL_METHOD} ${GET_ALL_ROUTE} with 500 if there is an internal error`, async () => {
    jest.spyOn(ProductsModel, 'getAll').mockImplementation(
      ProductsModelMock.mockImplementation(() => {
        throw new Error('ProductsModel Error')
      }),
    )

    const response = await request(ExpressInstance).get(GET_ALL_ROUTE)

    expect(response.statusCode).toBe(500)
  })

  test(`responds to  ${UPLOAD_FILE_METHOD} ${UPLOAD_FILE_ROUTE} with jobId and success feedback`, async () => {
    const expectedJobId = 'JOB_ID'

    jest
      .spyOn(ProcessingLogsModel, 'create')
      .mockImplementation(ProcessingLogsModelMock)
      .mockResolvedValue(expectedJobId)

    jest
      .spyOn(ProcessingLogs, 'update')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(processingLog)

    const response = await request(ExpressInstance)
      .post(UPLOAD_FILE_ROUTE)
      .attach('products_csv', fakeFile, {
        filename: 'test.csv',
      })

    expect(response.statusCode).toBe(202)
    expect(response.body).toEqual({
      message: 'File successfully uploaded',
      jobId: expectedJobId,
    })
  })

  test(`responds to  ${UPLOAD_FILE_METHOD} ${UPLOAD_FILE_ROUTE} with error if no file is provided`, async () => {
    jest
      .spyOn(ProcessingLogsModel, 'create')
      .mockImplementation(ProcessingLogsModelMock)

    const response = await request(ExpressInstance).post(UPLOAD_FILE_ROUTE)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: 'Invalid request. Upload file is missing',
    })
  })

  test(`responds to  ${DELETE_PRODUCT_METHOD} ${DELETE_PRODUCT_ROUTE} with success if delete is successful`, async () => {
    const routeWithParams = DELETE_PRODUCT_ROUTE.replace(
      ':productId',
      'FAKE_PRODUCT_ID',
    )

    jest
      .spyOn(ProductsModel, 'getOne')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue(productSample)

    jest
      .spyOn(ProductsModel, 'delete')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue()

    const response = await request(ExpressInstance).delete(routeWithParams)

    expect(response.statusCode).toBe(200)
  })
  test(`responds to  ${DELETE_PRODUCT_METHOD} ${DELETE_PRODUCT_ROUTE} with 500 if there is a server side problem`, async () => {
    const routeWithParams = DELETE_PRODUCT_ROUTE.replace(
      ':productId',
      'FAKE_PRODUCT_ID',
    )

    jest.spyOn(ProductsModel, 'delete').mockImplementation(
      ProductsModelMock.mockImplementation(() => {
        throw new Error('Server Error')
      }),
    )

    const response = await request(ExpressInstance).delete(routeWithParams)

    expect(response.statusCode).toBe(500)
    expect(response.body).toBeDefined()
  })
  test(`responds to  ${DELETE_PRODUCT_METHOD} ${DELETE_PRODUCT_ROUTE} with 404 if there is no products`, async () => {
    const routeWithParams = DELETE_PRODUCT_ROUTE.replace(
      ':productId',
      'FAKE_PRODUCT_ID',
    )

    jest
      .spyOn(ProductsModel, 'getOne')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue(null)

    jest
      .spyOn(ProductsModel, 'delete')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue()

    const response = await request(ExpressInstance).delete(routeWithParams)

    expect(response.statusCode).toBe(404)
    expect(response.body).toBeDefined()
  })
  test(`responds to  ${UPDATE_ROUTE} ${UPDATE_METHOD} with 404 if there is no product`, async () => {
    const routeWithParams = DELETE_PRODUCT_ROUTE.replace(
      ':productId',
      'FAKE_PRODUCT_ID',
    )

    jest
      .spyOn(ProductsModel, 'getOne')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue(null)

    const response = await request(ExpressInstance).put(routeWithParams)

    expect(response.statusCode).toBe(404)
    expect(response.body).toBeDefined()
  })
  test(`responds to  ${UPDATE_ROUTE} ${UPDATE_METHOD} with 204 if no request body is sent`, async () => {
    const routeWithParams = DELETE_PRODUCT_ROUTE.replace(
      ':productId',
      'FAKE_PRODUCT_ID',
    )

    jest
      .spyOn(ProductsModel, 'getOne')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue(productSample)

    const response = await request(ExpressInstance).put(routeWithParams)

    expect(response.statusCode).toBe(204)
  })
  test(`responds to  ${UPDATE_ROUTE} ${UPDATE_METHOD} with 201 if the resource was updated`, async () => {
    const routeWithParams = DELETE_PRODUCT_ROUTE.replace(
      ':productId',
      'FAKE_PRODUCT_ID',
    )

    const requestBody = {
      description: 'My new description',
    }

    jest
      .spyOn(ProductsModel, 'getOne')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue(productSample)

    jest
      .spyOn(ProductsModel, 'update')
      .mockImplementation(ProductsModelMock)
      .mockResolvedValue({
        ...productSample,
        description: requestBody.description,
      })

    const response = await request(ExpressInstance)
      .put(routeWithParams)
      .send(requestBody)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body).toHaveProperty('product')
  })
  test(`responds to  ${UPDATE_ROUTE} ${UPDATE_METHOD} with 500 there is an error`, async () => {
    const routeWithParams = DELETE_PRODUCT_ROUTE.replace(
      ':productId',
      'FAKE_PRODUCT_ID',
    )

    const requestBody = {
      description: 'My new description',
    }

    jest.spyOn(ProductsModel, 'getOne').mockImplementation(
      ProductsModelMock.mockImplementation(() => {
        throw new Error('Server Error')
      }),
    )

    const response = await request(ExpressInstance)
      .put(routeWithParams)
      .send(requestBody)

    expect(response.statusCode).toBe(500)
    expect(response.body).toBeDefined()
  })
})
