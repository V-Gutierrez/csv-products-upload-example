import PrismaClientInstance from '@Clients/Prisma/'
import ProductsModel from '@Models/Products'
import { productSample, fromCSVProductSample } from '@Tests/mocks'

describe('Products Model tests', () => {
  const PrismaClientMock = jest.fn()

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('should add products properly', async () => {
    const inputSample = [productSample, productSample]

    jest.spyOn(PrismaClientInstance.product, 'upsert').mockImplementation(PrismaClientMock)

    await ProductsModel.bulkCreate([productSample, productSample])

    expect(PrismaClientMock).toBeCalledTimes(inputSample.length)
    expect(PrismaClientMock).toHaveBeenCalledWith({ create: productSample, update: productSample, where: { lm: productSample.lm } })
  })

  it('should return products properly', async () => {
    const responseSample = [productSample, productSample, productSample]

    jest
      .spyOn(PrismaClientInstance.product, 'findMany')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(responseSample)

    const response = await ProductsModel.getAll()

    expect(response).toEqual(responseSample)
  })

  it('should return empty array if anything goes wrong', async () => {
    jest
      .spyOn(PrismaClientInstance.product, 'findMany')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(null)

    const response = await ProductsModel.getAll()

    expect(response).toEqual([])
  })

  it('should throw when CSV contains invalid numeric values', async () => {
    const csvHeaderSample = Object.keys(fromCSVProductSample)
    const inputSample = [csvHeaderSample, [{ ...fromCSVProductSample, price: "INVALID_PRICE" }], [fromCSVProductSample], [fromCSVProductSample]]
    const mockedBulkCreationFunction = jest.fn()

    jest.spyOn(ProductsModel, 'bulkCreate').mockImplementation(mockedBulkCreationFunction)

    try {
      await ProductsModel.createInBulkWithCSV(inputSample as string[][])
    } catch (error) {
      expect(error).toBeDefined()
      expect(mockedBulkCreationFunction).not.toHaveBeenCalled()
    }

    expect.assertions(2)
  })
})
