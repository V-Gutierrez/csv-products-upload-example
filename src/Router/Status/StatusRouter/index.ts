import ProccessingLogsModel from '@Models/ProcessingLogs/index'
import { Express } from 'express'

export default class StatusRouter {
  constructor(private readonly app: Express) {
    this.app = app
    this.getJobStatus()
  }

  /**
   * It's a GET request that returns the status of a job
   * @returns The route and method of the endpoint
   */
  getJobStatus() {
    const params = { route: '/status/:jobId', method: 'GET' }

    this.app.get(params.route, async (req, res) => {
      try {
        const { jobId } = req.params

        const jobStatus = await ProccessingLogsModel.getLog(jobId)

        if (!jobStatus) res.status(404).json({ error: 'Job not found' })
        else res.status(200).json(jobStatus)
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while getting all products' })
      }
    })

    return params
  }
}
