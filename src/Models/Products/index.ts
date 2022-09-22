/* eslint-disable camelcase */
import { Prisma } from '@prisma/client'
import { Products } from '@Clients/Prisma/index'

class ProductsModel {
  /**
   * It takes an array of products, and creates them in the database
   * @param {Prisma.ProductsCreateInput[]} products - Prisma.ProductsCreateInput[]
   */
  async bulkCreate(products: Prisma.ProductsCreateInput[]) {
    try {
      await Products.createMany({
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
      const allProducts = await Products.findMany()

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

  /**
   * It deletes a product from the database
   * @param {string} productId - The product id to delete
   */
  async delete(productId: string) {
    try {
      await Products.delete({
        where: { lm: productId },
      })
    } catch (error) {
      throw new Error('delete error')
    }
  }

  /**
   * This function will return a product if it exists, otherwise it will return null.
   * @param {string} productId - string
   * @returns The product object
   */
  async getOne(productId: string) {
    try {
      const product = await Products.findFirst({ where: { lm: productId } })

      return product
    } catch (error) {
      return null
    }
  }

  /**
   * It updates a product in the database
   * @param {string} productId - The product id that we want to update.
   * @param data - Prisma.ProductsUpdateInput
   * @returns The product that was updated.
   */
  async update(productId: string, data: Prisma.ProductsUpdateInput) {
    try {
      const product = await Products.update({
        where: { lm: productId },
        data,
      })

      return product
    } catch (error) {
      return null
    }
  }
}

export default new ProductsModel()
