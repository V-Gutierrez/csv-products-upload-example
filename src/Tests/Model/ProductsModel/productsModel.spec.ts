import { Products } from '@Clients/Prisma/'
import ProductsModel from '@Models/Products'
import { productSample, fromCSVProductSample } from '@Tests/Mocks'

describe('Products Model tests', () => {
  const PrismaClientMock = jest.fn()

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('should add products properly', async () => {
    const inputSample = [productSample, productSample]

    jest.spyOn(Products, 'createMany').mockImplementation(PrismaClientMock)

    await ProductsModel.bulkCreate(inputSample)

    expect(PrismaClientMock).toBeCalled()
    expect(PrismaClientMock).toHaveBeenCalledWith({ data: inputSample })
  })
  it('should not throw if products already exists or if Prisma throws', async () => {
    const inputSample = [productSample, productSample]

    jest
      .spyOn(Products, 'create')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue({ error: { code: 'P2002' } })

    try {
      await ProductsModel.bulkCreate(inputSample)
    } catch (error) {
      // should not be called
      expect(error).toBeDefined()
    }

    expect(PrismaClientMock).toBeCalled()
    expect.assertions(1)
  })

  it('should return products properly', async () => {
    const responseSample = [productSample, productSample, productSample]

    jest
      .spyOn(Products, 'findMany')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(responseSample)

    const response = await ProductsModel.getAll()

    expect(response).toEqual(responseSample)
  })

  it('should return empty array if anything goes wrong', async () => {
    jest
      .spyOn(Products, 'findMany')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(null)

    const response = await ProductsModel.getAll()

    expect(response).toEqual([])
  })

  it('should throw when CSV contains invalid numeric values', async () => {
    const csvHeaderSample = Object.keys(fromCSVProductSample)
    const inputSample = [
      csvHeaderSample,
      [{ ...fromCSVProductSample, price: 'INVALID_PRICE' }],
      [fromCSVProductSample],
      [fromCSVProductSample],
    ]

    const mockedBulkCreationFunction = jest.fn()

    jest
      .spyOn(ProductsModel, 'bulkCreate')
      .mockImplementation(mockedBulkCreationFunction)

    try {
      await ProductsModel.createInBulkWithCSV(inputSample as string[][])
    } catch (error) {
      expect(error).toBeDefined()
      expect(mockedBulkCreationFunction).not.toHaveBeenCalled()
    }

    expect.assertions(2)
  })

  it('should delete a product successfully', async () => {
    const id = 'FAKE_PRODUCT_ID'

    jest.spyOn(Products, 'delete').mockImplementation(PrismaClientMock)

    await ProductsModel.delete(id)

    expect(PrismaClientMock).toHaveBeenCalledWith({ where: { lm: id } })
  })
  it('should throw if anything goes wrong', async () => {
    const id = 'FAKE_PRODUCT_ID'

    jest
      .spyOn(Products, 'delete')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(() => {
        throw new Error('Failed to delete')
      })
    try {
      await ProductsModel.delete(id)
    } catch (error) {
      expect(error).toBeDefined()
    }

    expect.assertions(1)
  })
})
