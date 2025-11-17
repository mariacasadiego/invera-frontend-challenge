const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx}',
    'hooks/**/*.{js,jsx}',
    'services/**/*.{js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)