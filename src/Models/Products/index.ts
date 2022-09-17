import { Prisma } from '@prisma/client'
import PrismaClientInstance from '@Clients/Prisma/index'

class ProductsModel {
  async bulkCreate(products: Prisma.ProductCreateInput[]) {
    try {
      const bulkCreation = products.map(async (item) => PrismaClientInstance.product.create({
        data: item
      }))

      await Promise.all(bulkCreation)
    } catch (error) {
      console.error(error)
      // TODO: improve error logging
    }
  }

  async getAll() {
    try {
      const allProducts = await PrismaClientInstance.product.findMany()

      return allProducts
    } catch (error) {
      console.error(error)
      // TODO: improve error logging
      return []
    }
  }
}

export default new ProductsModel()