module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  projects: ['<rootDir>/packages/**/jest.config.cjs'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)']
};
