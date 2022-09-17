import PrismaClientInstance from '@Clients/Prisma/'
import ProductsModel from '@Models/Products';

describe('Products Model tests', () => {
  const PrismaClientMock = jest.fn()
  const productSample = { category: 1, free_shipping: true, lm: 1, description: "This is my test product", name: "Furadeira Lavadeira", price: 123.42 }

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('should add products properly', async () => {

    const inputSample = [productSample, productSample]

    jest.spyOn(PrismaClientInstance.product, 'create')
      .mockImplementation(PrismaClientMock)

    await ProductsModel.bulkCreate([productSample, productSample])

    expect(PrismaClientMock).toBeCalledTimes(inputSample.length)
    expect(PrismaClientMock).toHaveBeenCalledWith({ data: productSample })
  });

  it('should return products properly', async () => {

    const responseSample = [productSample, productSample, productSample]

    jest.spyOn(PrismaClientInstance.product, 'findMany')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(responseSample)

    const response = await ProductsModel.getAll()

    expect(response).toEqual(responseSample)
  });

  it('should return empty array if anything goes wrong', async () => {

    jest.spyOn(PrismaClientInstance.product, 'findMany')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(null)

    const response = await ProductsModel.getAll()

    expect(response).toEqual([])
  });
})