import ProccessingLogs from '@Models/ProcessingLogs'
import PrismaClientInstance from '@Clients/Prisma/'
import { processingLogsInput } from '@Tests/Mocks'

describe('ProcessingLogs Model tests', () => {
  const PrismaClientMock = jest.fn()

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('should create a log', async () => {
    const mockedLog = {
      id: 'fake_cuid',
      ready: false,
      createdAt: new Date(Date.now()),
      failure: false
    }

    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'create')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(mockedLog)

    const id = await ProccessingLogs.create()

    expect(id).toBe(mockedLog.id)
  })

  it('should return null in error case', async () => {
    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'create')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(null)

    const id = await ProccessingLogs.create()

    expect(id).toBe(null)
  })

  it('should successfully update a log', async () => {
    const { ready, jobId } = processingLogsInput

    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'update')
      .mockImplementation(PrismaClientMock)

    await ProccessingLogs.updateLog(ready, jobId)

    expect(PrismaClientMock).toHaveBeenCalledWith({
      data: { ready },
      where: { id: jobId },
    })
  })

  it('should return null if log update goes wrong', async () => {
    const { ready, jobId } = processingLogsInput

    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'update')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(new Error('Mocked Error'))

    const updateResponse = await ProccessingLogs.updateLog(ready, jobId)

    expect(PrismaClientMock).toHaveBeenCalledWith({
      data: { ready },
      where: { id: jobId },
    })
    expect(updateResponse).toBe(null)
  })
  it('should return null if search update goes wrong', async () => {
    const { jobId } = processingLogsInput

    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'findFirst')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(new Error('Mocked Error'))

    const searchResponse = await ProccessingLogs.getLog(jobId)

    expect(PrismaClientMock).toHaveBeenCalled()
    expect(searchResponse).toBe(null)
  })
  it('should return log in successful search', async () => {
    const { jobId } = processingLogsInput
    const expectedOutput = {
      ...processingLogsInput,
      id: jobId,
      ready: true,
      createdAt: new Date(Date.now()),
    }

    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'findFirst')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(expectedOutput)

    const searchResponse = await ProccessingLogs.getLog(jobId)

    expect(PrismaClientMock).toHaveBeenCalled()
    expect(searchResponse).toBe(expectedOutput)
  })
  it('should update a log with failure status when needed', async () => {
    const { jobId } = processingLogsInput

    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'update')
      .mockImplementation(PrismaClientMock)

    await ProccessingLogs.markAsFailed(jobId)

    expect(PrismaClientMock).toHaveBeenCalled()
    expect(PrismaClientMock).toHaveBeenCalledWith({ data: { failure: true }, where: { id: jobId } })
  })
  it('should throw if something goes wrong while updating failure status', async () => {
    const { jobId } = processingLogsInput

    jest
      .spyOn(PrismaClientInstance.proccessingLogs, 'update')
      .mockImplementation(PrismaClientMock.mockImplementation(() => {
        throw new Error(`Job ${jobId}`)
      }))

    try {
      await ProccessingLogs.markAsFailed(jobId)
    } catch (error) {
      expect(error).toBeDefined()
      expect(PrismaClientMock).toThrow()
    }

    expect.assertions(2)
  })
})
