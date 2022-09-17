import PrismaClientInstance from '@Clients/Prisma/'
import ProductsModel from '@Models/Products';

describe('Products Model test', () => {
  const PrismaClientMock = jest.fn()
  const productSample = { category: 1, free_shipping: true, lm: 1, description: "This is my test product", name: "Furadeira Lavadeira", price: 123.42 }

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('should add products properly', () => {
    const inputSample = [productSample, productSample]
    
    jest.spyOn(PrismaClientInstance.product, 'create').mockImplementation(PrismaClientMock)

    ProductsModel.bulkCreate([productSample, productSample])

    expect(PrismaClientMock).toBeCalledTimes(inputSample.length)
    expect(PrismaClientMock).toHaveBeenCalledWith({ data: productSample })
  });
})