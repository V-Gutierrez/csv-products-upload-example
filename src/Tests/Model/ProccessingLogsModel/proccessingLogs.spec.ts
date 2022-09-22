import ProcessingLogsModel from '@Models/ProcessingLogs'
import { ProcessingLogs } from '@Clients/Prisma/'
import { processingLogsInput } from '@Tests/Mocks'

describe('ProcessingLogs Model tests', () => {
  const PrismaClientMock = jest.fn()

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it("ProcessingLogsModel.create ~ should create a log and return it's id", async () => {
    const mockedLog = {
      id: 'fake_cuid',
      ready: false,
      createdAt: new Date(Date.now()),
      failure: false,
    }

    jest
      .spyOn(ProcessingLogs, 'create')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(mockedLog)

    const id = await ProcessingLogsModel.create()

    expect(id).toBe(mockedLog.id)
  })

  it('ProcessingLogsModel.create ~ should return null in error case', async () => {
    jest
      .spyOn(ProcessingLogs, 'create')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(null)

    const id = await ProcessingLogsModel.create()

    expect(id).toBe(null)
  })

  it('ProcessingLogsModel.updateLog ~ should successfully update a log', async () => {
    const { ready, jobId } = processingLogsInput

    jest.spyOn(ProcessingLogs, 'update').mockImplementation(PrismaClientMock)

    await ProcessingLogsModel.updateLog(ready, jobId)

    expect(PrismaClientMock).toHaveBeenCalledWith({
      data: { ready },
      where: { id: jobId },
    })
  })

  it('ProcessingLogsModel.updateLog ~ should return null if log update goes wrong', async () => {
    const { ready, jobId } = processingLogsInput

    jest
      .spyOn(ProcessingLogs, 'update')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(new Error('Mocked Error'))

    const updateResponse = await ProcessingLogsModel.updateLog(ready, jobId)

    expect(PrismaClientMock).toHaveBeenCalledWith({
      data: { ready },
      where: { id: jobId },
    })
    expect(updateResponse).toBe(null)
  })
  it('ProcessingLogsModel.getLog ~ should return null if search update goes wrong', async () => {
    const { jobId } = processingLogsInput

    jest
      .spyOn(ProcessingLogs, 'findFirst')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(new Error('Mocked Error'))

    const searchResponse = await ProcessingLogsModel.getLog(jobId)

    expect(PrismaClientMock).toHaveBeenCalled()
    expect(searchResponse).toBe(null)
  })
  it('ProcessingLogsModel.getLog ~ should return log in successful search', async () => {
    const { jobId } = processingLogsInput
    const expectedOutput = {
      ...processingLogsInput,
      id: jobId,
      ready: true,
      createdAt: new Date(Date.now()),
    }

    jest
      .spyOn(ProcessingLogs, 'findFirst')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(expectedOutput)

    const searchResponse = await ProcessingLogsModel.getLog(jobId)

    expect(PrismaClientMock).toHaveBeenCalled()
    expect(searchResponse).toBe(expectedOutput)
  })
  it('ProcessingLogsModel.markAsFailed ~ should update a log with failure status when needed', async () => {
    const { jobId } = processingLogsInput

    jest.spyOn(ProcessingLogs, 'update').mockImplementation(PrismaClientMock)

    await ProcessingLogsModel.markAsFailed(jobId)

    expect(PrismaClientMock).toHaveBeenCalled()
    expect(PrismaClientMock).toHaveBeenCalledWith({
      data: { failure: true },
      where: { id: jobId },
    })
  })
  it('ProcessingLogsModel.markAsFailed ~ should throw if something goes wrong while updating failure status', async () => {
    const { jobId } = processingLogsInput

    jest.spyOn(ProcessingLogs, 'update').mockImplementation(
      PrismaClientMock.mockImplementation(() => {
        throw new Error(`Job ${jobId}`)
      }),
    )

    try {
      await ProcessingLogsModel.markAsFailed(jobId)
    } catch (error) {
      expect(error).toBeDefined()
      expect(PrismaClientMock).toThrow()
    }

    expect.assertions(2)
  })
})
