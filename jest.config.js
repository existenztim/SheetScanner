const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});
/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest',
  // Whether to use watchman for file crawling
  // watchman: true,
};

module.exports = createJestConfig(config);
