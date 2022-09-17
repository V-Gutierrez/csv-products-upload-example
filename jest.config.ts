/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

/* eslint-disable */

import 'tsconfig-paths/register'

import jestModuleNameMapper from 'jest-module-name-mapper'

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: jestModuleNameMapper(),
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}