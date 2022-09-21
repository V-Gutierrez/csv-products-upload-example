import PrismaClientInstance from '@Clients/Prisma'
import request from 'supertest'
import express from 'express'
import StatusRouter from '@Router/Status/StatusRouter'
import Router from '@Router/index'
import { processingLogsInput } from '@Tests/Mocks'

const AppInstance = express()
const RouterInstance = new Router(AppInstance)
const ExpressInstance = RouterInstance.useExpressInstance()
const TestedRouterInstance = new StatusRouter(ExpressInstance)

const { route: GET_JOB_STATUS_ROUTE, method: GET_JOB_STATUS_METHOD } =
  TestedRouterInstance.getJobStatus()

describe('Status Router', () => {
  const PrismaClientMock = jest.fn()

  const { jobId } = processingLogsInput
  const routeWithParams = GET_JOB_STATUS_ROUTE.replace(':jobId', jobId)

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it(`responds ${GET_JOB_STATUS_METHOD} ${GET_JOB_STATUS_ROUTE} a job when a job id is provided`, async () => {
    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'findFirst')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue({
        id: jobId,
        failure: false,
        createdAt: new Date(Date.now()),
        ready: true,
      })

    const response = await request(ExpressInstance).get(routeWithParams)

    expect(response.statusCode).toBe(200)
  })
  it(`responds ${GET_JOB_STATUS_METHOD} ${GET_JOB_STATUS_ROUTE} 404 when a job id is provided but there is not any matching log`, async () => {
    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'findFirst')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(null)

    const response = await request(ExpressInstance).get(routeWithParams)

    expect(response.statusCode).toBe(404)
  })
})
