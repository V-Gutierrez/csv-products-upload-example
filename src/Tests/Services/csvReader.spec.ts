import CSVReader from '@Services/CSVReader'
import fs from 'fs'

describe('CSVReader Service', () => {
  it('should validate schemas', () => {
    const schema = ['data', 'movie', 'timestamp']

    const validation = CSVReader.validateSchema(schema, schema)

    expect(validation).toBe(true)
  })

  it('should not validate different schemas if lengths are different', () => {
    const schema = ['data', 'movie', 'timestamp']
    const otherSchema = ['data', 'movie']

    const validation = CSVReader.validateSchema(schema, otherSchema)

    expect(validation).toBe(false)
  })
  it('should not validate different schemas if the headers order are different', () => {
    const schema = ['data', 'movie', 'timestamp']
    const otherSchema = ['data', 'timestamp', 'movie']

    const validation = CSVReader.validateSchema(schema, otherSchema)

    expect(validation).toBe(false)
  })

  it('should read a csv file and call callback', () => {
    const filePath = 'MOCKED_PATH'
    const mockedCallback = jest.fn()
    const mockedFs = jest.fn()

    jest.spyOn(fs, 'readFileSync').mockImplementation(mockedFs)

    CSVReader.readFile(filePath, mockedCallback)

    expect(mockedFs).toBeCalled()
    expect(mockedFs).toHaveBeenCalledWith(filePath)
  })
  it('readFile method should equal undefined when there is no file', () => {
    const filePath = 'MOCKED_PATH'
    const mockedCallback = jest.fn()
    const mockedFs = jest.fn()

    jest.spyOn(fs, 'readFileSync').mockImplementation(mockedFs)

    const reader = CSVReader.readFile(filePath, mockedCallback)

    expect(mockedFs).toBeCalled()
    expect(mockedFs).toHaveBeenCalledWith(filePath)
    expect(reader).not.toBeDefined()
  })
})
