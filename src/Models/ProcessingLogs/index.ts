import { Prisma } from '@prisma/client'
import PrismaClientInstance from '@Clients/Prisma/index'

class ProccessingLogsModel {
  async create(newLog?: Prisma.ProccessingLogsCreateInput) {
    try {
      const log = await PrismaClientInstance.proccessingLogs.create({ data: newLog || {} })

      return log.id
    } catch (error) {
      return null
    }
  }
}

export default new ProccessingLogsModel()
