import express, { Express } from 'express'
import morgan from 'morgan'
import multer from 'multer'

export default class Middlewares {
  constructor(private readonly app: Express) {
    this.app = app
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(morgan('combined'))
  }

  static singleFileUpload(formDataKey: string) {
    return multer().single(formDataKey)
  }
}
