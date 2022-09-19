import { CsvError, parse } from 'csv-parse'
import fs from 'fs'

class CSVReader {
  /**
   * It reads a file, parses it, and then calls a callback function with the parsed data
   * @param {string} filePath - The path to the file you want to read.
   * @param callback - (err: CsvError | undefined, data: any) => void
   */
  // eslint-disable-next-line no-unused-vars
  readFile(
    filePath: string,
    callback: (err: CsvError | undefined, data: any) => void,
  ): null | void {
    const fileData = fs.readFileSync(filePath)

    if (fileData) parse(fileData, { delimiter: ';' }, callback)
  }

  /**
   * It checks if the column schema and the csv header are the same length, and if they are, it checks
   * if the ordering of the columns is the same
   * @param {string[]} columnSchema - The column schema that you want to validate against.
   * @param {string[]} csvHeader - The header of the CSV file.
   * @returns A boolean value
   */
  validateSchema(columnSchema: string[], csvHeader: string[]) {
    if (columnSchema.length !== csvHeader.length) return false

    let isOrderingValid

    csvHeader.forEach((column, index) => {
      if (columnSchema[index] !== column) isOrderingValid = false
      else isOrderingValid = true
    })

    return isOrderingValid
  }
}

export default new CSVReader()
