import { PrismaClient } from '@prisma/client'

const { processingLogs, products } = new PrismaClient()

export const ProcessingLogs = processingLogs
export const Products = products
