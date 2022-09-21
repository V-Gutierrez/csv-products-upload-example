/* eslint-disable camelcase */
import { Prisma } from '@prisma/client'
import PrismaClientInstance from '@Clients/Prisma/index'

class ProductsModel {
  /**
   * It takes an array of products, and creates them in the database
   * @param {Prisma.ProductsCreateInput[]} products - Prisma.ProductsCreateInput[]
   */
  async bulkCreate(products: Prisma.ProductsCreateInput[]) {
    try {
      await PrismaClientInstance.products.createMany({
        data: products,
      })
    } catch (error) {
      throw new Error('bulkCreate error')
    }
  }

  /**
   * It returns all products from the database
   * @returns An array of all products
   */
  async getAll() {
    try {
      const allProducts = await PrismaClientInstance.products.findMany()

      return allProducts
    } catch (error) {
      return []
    }
  }

  /**
   * It takes a parsed CSV contents and creates a new product for each row
   * @param {string[][]} parsedCSV - string[][]
   */
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
        parsedData as unknown as Prisma.ProductsCreateInput[],
      )
    } catch (error) {
      throw new Error('createInBulkWithCSV error')
    }
  }

  async delete(productId: string) {
    try {
      await PrismaClientInstance.products.delete({
        where: { lm: productId },
      })
    } catch (error) {
      throw new Error('delete error')
    }
  }
}

export default new ProductsModel()
