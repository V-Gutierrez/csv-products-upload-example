import { Products } from '@Clients/Prisma/'
import ProductsModel from '@Models/Products'
import {
  productSample,
  fromCSVProductSample,
  PrismaWhereClause,
} from '@Tests/Mocks'

describe('Products Model tests', () => {
  const PrismaClientMock = jest.fn()

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('ProductsModel.bulkCreate ~ should add products properly', async () => {
    const inputSample = [productSample, productSample]

    jest.spyOn(Products, 'createMany').mockImplementation(PrismaClientMock)

    await ProductsModel.bulkCreate(inputSample)

    expect(PrismaClientMock).toBeCalled()
    expect(PrismaClientMock).toHaveBeenCalledWith({ data: inputSample })
  })
  it('ProductsModel.bulkCreate ~ should throw if Prisma throws or rejects', async () => {
    const inputSample = [productSample, productSample]

    jest
      .spyOn(Products, 'createMany')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue({ error: { code: 'P2002' } })

    try {
      await ProductsModel.bulkCreate(inputSample)
    } catch (error) {
      expect(error).toBeDefined()
    }

    expect(PrismaClientMock).toBeCalled()
    expect.assertions(2)
  })

  it('ProductsModel.getAll ~ should return products properly', async () => {
    const responseSample = [productSample, productSample, productSample]

    jest
      .spyOn(Products, 'findMany')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(responseSample)

    const response = await ProductsModel.getAll()

    expect(response).toEqual(responseSample)
  })

  it('ProductsModel.getAll ~ should return empty array if anything goes wrong', async () => {
    jest
      .spyOn(Products, 'findMany')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(null)

    const response = await ProductsModel.getAll()

    expect(response).toEqual([])
  })

  it('ProductsModel.createInBulkWithCSV ~~ should throw when CSV contains invalid numeric values', async () => {
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

  it('ProductsModel.delete ~ should delete a product successfully', async () => {
    const id = 'FAKE_PRODUCT_ID'

    jest.spyOn(Products, 'delete').mockImplementation(PrismaClientMock)

    await ProductsModel.delete(id)

    expect(PrismaClientMock).toHaveBeenCalledWith(PrismaWhereClause({ lm: id }))
  })
  it('ProductsModel.delete ~ should throw if anything goes wrong while deleting', async () => {
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
  it('ProductsModel.getOne ~ should successfully return a product ', async () => {
    const id = 'FAKE_PRODUCT_ID'

    jest
      .spyOn(Products, 'findFirst')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(productSample)

    const product = await ProductsModel.getOne(id)

    expect(product).not.toBeNull()
    expect(product).toEqual(product)
    expect(PrismaClientMock).toHaveBeenCalledWith(PrismaWhereClause({ lm: id }))
  })
  it('ProductsModel.getOne ~ should return null in error case ', async () => {
    const id = 'FAKE_PRODUCT_ID'

    jest
      .spyOn(Products, 'findFirst')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(() => {
        throw new Error('Failed to delete')
      })

    const products = await ProductsModel.getOne(id)

    expect(PrismaClientMock).toHaveBeenCalledWith(PrismaWhereClause({ lm: id }))
    expect(products).toBe(null)
  })
  it('ProductsModel.update ~ should update and return updated product ', async () => {
    const id = 'FAKE_EDITED_PRODUCT_ID'
    const updateData = { description: 'NEW_DESCRIPTION' }
    const expectedResponse = {
      ...productSample,
      description: updateData.description,
    }

    jest
      .spyOn(Products, 'update')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(expectedResponse)

    const product = await ProductsModel.update(id, updateData)

    expect(product).toBe(expectedResponse)
  })
  it('ProductsModel.update ~ should not update and return null in error case ', async () => {
    const id = 'FAKE_EDITED_PRODUCT_ID'
    const updateData = { description: 'NEW_DESCRIPTION' }

    jest.spyOn(Products, 'update').mockImplementation(
      PrismaClientMock.mockImplementation(() => {
        throw new Error('Error updating')
      }),
    )

    const product = await ProductsModel.update(id, updateData)

    expect(product).toBe(null)
  })
})
