import express, { Express } from 'express'
import morgan from 'morgan'
import multer from 'multer'
import os from 'os'

export default class Middlewares {
  constructor(private readonly app: Express) {
    this.app = app
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(morgan('combined'))
  }

  /**
   * It returns a function that accepts a formDataKey and returns a function that accepts a request and
   * response object
   * @param {string} formDataKey - The key of the form data that you want to upload.
   * @returns A function that takes a formDataKey as an argument and returns a middleware function that
   * will handle a single file upload.
   */
  static singleFileUpload(formDataKey: string) {
    return multer({ dest: os.tmpdir() }).single(formDataKey)
  }
}
