/* eslint-disable camelcase */
import { Prisma } from '@prisma/client'
import PrismaClientInstance from '@Clients/Prisma/index'

class ProductsModel {
  async bulkCreate(products: Prisma.ProductCreateInput[]) {
    try {
      await PrismaClientInstance.product.createMany({
        data: products,
      })
    } catch (error) {
      throw new Error('bulkCreate error')
    }
  }

  async getAll() {
    try {
      const allProducts = await PrismaClientInstance.product.findMany()

      return allProducts
    } catch (error) {
      return []
    }
  }

  async createInBulkWithCSV(parsedCSV: string[][]) {
    try {
      // Ignore headers by slicing from index 1
      const parsedData = parsedCSV.slice(1).map((item) => {
        const {
          0: lm,
          1: name,
          2: free_shipping,
          3: description,
          4: price,
          5: category,
        } = item

        if (Number.isNaN(Number(price))) {
          throw new Error(
            'Invalid numeric value for price, please provide a valid one.',
          )
        }

        return {
          lm,
          name,
          free_shipping: free_shipping !== '0',
          description,
          price: Number(price),
          category,
        }
      })

      await this.bulkCreate(
        parsedData as unknown as Prisma.ProductCreateInput[],
      )
    } catch (error) {
      throw new Error('createInBulkWithCSV error')
    }
  }
}

export default new ProductsModel()
