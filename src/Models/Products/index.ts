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
    }
  }
}

export default new ProductsModel()