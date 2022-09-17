import Router  from '@Router/index'
import request from 'supertest';
import express from 'express';


const newRouterInstance = new Router(express())
const expressInstance = newRouterInstance.useExpressInstance()

describe('Product Resource Routes', function () {
test('responds to /resources/products with products', async () => {
    const res = await request(expressInstance)
      .get('/resources/products');

    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(JSON.stringify([]));
  });

});