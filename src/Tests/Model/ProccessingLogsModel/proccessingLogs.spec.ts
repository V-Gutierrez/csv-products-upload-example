import ProccessingLogs from '@Models/ProcessingLogs'
import PrismaClientInstance from '@Clients/Prisma/'


describe('ProcessingLogs Model tests', () => {
  const PrismaClientMock = jest.fn()

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('should create a log', async () => {
    const mockedLog = { id: 'fake_cuid', ready: false, createdAt: new Date(Date.now()) }

    jest.spyOn(PrismaClientInstance.proccessingLogs, 'create')
      .mockImplementation(PrismaClientMock)
      .mockResolvedValue(mockedLog)

    const id = await ProccessingLogs.create()

    expect(id).toBe(mockedLog.id)
  });
  it('should create null in error case', async () => {

    jest.spyOn(PrismaClientInstance.proccessingLogs, 'create')
      .mockImplementation(PrismaClientMock)
      .mockRejectedValue(null)

    const id = await ProccessingLogs.create()

    expect(id).toBe(null)
  });
})