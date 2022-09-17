import Router  from '@Router/index'
import request from 'supertest';
import express from 'express';
import { ProductsRouter } from '@Router/Resources/ProductsRouter';

const AppInstance = express()
const RouterInstance = new Router(AppInstance)

const ExpressInstance = RouterInstance.useExpressInstance()
const TestedRouterInstance = new ProductsRouter(ExpressInstance)

const GET_ALL_ROUTE = TestedRouterInstance.getAll()

describe('Product Resource Routes', () => {

  test(`responds to ${GET_ALL_ROUTE} with all available products`, async () => {
    const response = await request(ExpressInstance).get(GET_ALL_ROUTE);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  })

})