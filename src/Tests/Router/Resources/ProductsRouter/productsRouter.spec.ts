import Router  from '@Router/index'
import request from 'supertest';
import express from 'express';

const newRouterInstance = new Router(express())
const expressInstance = newRouterInstance.useExpressInstance()

describe('Product Resource Routes', function () {
  test('responds to /resources/products with products', async () => {
    const response = await request(expressInstance)
      .get('/resources/products');

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(JSON.stringify([]));
  });

});