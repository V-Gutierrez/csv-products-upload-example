import { Prisma } from '@prisma/client'
import PrismaClientInstance from '@Clients/Prisma/index'

class ProcessingLogsModel {
  async create(newLog?: Prisma.ProcessingLogsCreateInput) {
    try {
      const log = await PrismaClientInstance.processingLogs.create({
        data: newLog || {},
      })

      return log.id
    } catch (error) {
      return null
    }
  }

  async updateLog(ready: boolean, jobId: string) {
    try {
      const jobLog = await PrismaClientInstance.processingLogs.update({
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
      const jobLog = await PrismaClientInstance.processingLogs.findFirst({
        where: { id: jobId },
      })

      return jobLog
    } catch (error) {
      return null
    }
  }

  async markAsFailed(jobId: string) {
    try {
      await PrismaClientInstance.processingLogs.update({
        where: { id: jobId },
        data: { failure: true },
      })
    } catch (error) {
      throw new Error('Error in markAsFailed method')
    }
  }
}

export default new ProcessingLogsModel()
