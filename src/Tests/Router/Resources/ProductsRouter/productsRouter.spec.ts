import ProductsModel from '@Models/Products'
import Router from '@Router/index'
import request from 'supertest'
import express from 'express'
import ProductsRouter from '@Router/Resources/ProductsRouter'
import { productSample } from '@Tests/mocks'

const AppInstance = express()
const RouterInstance = new Router(AppInstance)

const ExpressInstance = RouterInstance.useExpressInstance()
const TestedRouterInstance = new ProductsRouter(ExpressInstance)

const GET_ALL_ROUTE = TestedRouterInstance.getAll()

describe('Product Resource Routes', () => {
  test(`responds to ${GET_ALL_ROUTE} with all available products`, async () => {
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
})
