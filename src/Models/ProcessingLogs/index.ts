import { Prisma } from '@prisma/client'
import { ProcessingLogs } from '@Clients/Prisma'

class ProcessingLogsModel {
  /**
   * Create a new log entry in the database, and return the ID of the new entry.
   * @param [newLog] - Prisma.ProcessingLogsCreateInput - Object to create the log entry
   * @returns The ID of the newly created log.
   */
  async create(newLog?: Prisma.ProcessingLogsCreateInput) {
    try {
      const log = await ProcessingLogs.create({
        data: newLog || {},
      })

      return log.id
    } catch (error) {
      return null
    }
  }

  /**
   * @param {boolean} ready - boolean - this is a flag that tells the system that the job is ready and already processed
   * @param {string} jobId - The id of the job.
   * @returns The ProcessingLogs object
   */
  async updateLog(ready: boolean, jobId: string) {
    try {
      const jobLog = await ProcessingLogs.update({
        data: { ready },
        where: { id: jobId },
      })

      return jobLog
    } catch (error) {
      return null
    }
  }

  /**
   * It returns the first processing log with the given jobId.
   * @param {string} jobId - The id of the job you want to get the log for.
   * @returns The ProcessingLogs object
   */
  async getLog(jobId: string) {
    try {
      const jobLog = await ProcessingLogs.findFirst({
        where: { id: jobId },
      })

      return jobLog
    } catch (error) {
      return null
    }
  }

  /**
   * This function takes a jobId as a parameter, and then updates the database to mark the job as
   * failed.
   * @param {string} jobId - The id of the job that failed
   */
  async markAsFailed(jobId: string) {
    try {
      await ProcessingLogs.update({
        where: { id: jobId },
        data: { failure: true },
      })
    } catch (error) {
      throw new Error('Error in markAsFailed method')
    }
  }
}

export default new ProcessingLogsModel()
