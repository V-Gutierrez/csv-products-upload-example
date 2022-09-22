// eslint-disable-next-line import/prefer-default-export
export const productSample = {
  category: '0001',
  free_shipping: true,
  lm: '0001',
  description: 'This is my test product',
  name: 'Furadeira Lavadeira',
  price: 123.42,
}

export const fromCSVProductSample = {
  category: '0002',
  free_shipping: 1,
  lm: '0001',
  description: 'This is my test product',
  name: 'Furadeira Lavadeira',
  price: 123.42,
}

export const processingLogsInput = {
  ready: true,
  jobId: 'FAKE_JOB_ID',
  failure: false,
}

export const processingLog = {
  ready: true,
  jobId: 'FAKE_JOB_ID',
  failure: false,
  id: 'fake_cuid',
  createdAt: new Date(Date.now()),
}

export const fakeFile = Buffer.alloc(1024 * 1024 * 10, '.')

/**
 * It takes a constraint object and returns a Prisma where clause object
 * @param {T} constraint - T - This is the constraint that you want to apply to the where clause.
 * @returns A function that takes a constraint and returns an object with a where property.
 * @description This function provides a context for who is reading the code
 */
// eslint-disable-next-line func-names
export const PrismaWhereClause = function <T>(constraint: T) {
  return { where: constraint }
}

/**
 * > This function takes in a data object and a where constraint object and returns a Prisma update
 * where clause object
 * @param {T} data - The data you want to update.
 * @param {K} whereConstraint - This is the where clause that you want to use to update the data.
 * @returns A function that takes two arguments, data and whereConstraint, and returns an object with
 * two properties, where and data.
 */
// eslint-disable-next-line func-names
export const PrismaUpdateWhereClause = function <T, K>(data: T, whereConstraint: K) {
  return { where: whereConstraint, data }
}