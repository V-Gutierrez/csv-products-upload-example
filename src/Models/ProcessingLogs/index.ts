import { Prisma } from '@prisma/client'
import PrismaClientInstance from '@Clients/Prisma/index'

class ProccessingLogsModel {
  async create(newLog?: Prisma.ProccessingLogsCreateInput) {
    try {
      const log = await PrismaClientInstance.proccessingLogs.create({
        data: newLog || {},
      })

      return log.id
    } catch (error) {
      return null
    }
  }

  async updateLog(ready: boolean, jobId: string) {
    try {
      const jobLog = await PrismaClientInstance.proccessingLogs.update({
        data: { ready },
        where: { id: jobId },
      })

      return jobLog
    } catch (error) {
      return null
    }
  }

  async getLog(jobId: string) {
    try {
      const jobLog = await PrismaClientInstance.proccessingLogs.findFirst({
        where: { id: jobId },
      })

      return jobLog
    } catch (error) {
      return null
    }
  }

  async markAsFailed(jobId: string) {
    try {
      await PrismaClientInstance.proccessingLogs.update({
        where: { id: jobId },
        data: { failure: true }
      })
    } catch (error) {
      throw new Error('Error in markAsFailed method')
    }

  }
}

export default new ProccessingLogsModel()
