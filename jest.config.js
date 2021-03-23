module.exports = {
  preset: 'ts-jest',
  verbose: true,
  roots: [
    '<rootDir>/src',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      // IDEAL COVERAGE
      branches: 90,
      functions: 90,
      lines: 90,
      statements: -10,
      // CURRENT COVERAGE
      // branches: 0,
      // functions: 0,
      // lines: 0,
      // statements: -10000,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  coverageReporters: [
    'text',
    'text-summary',
    'html',
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        module: 'commonjs',
        jsx: 'react',
      },
    },
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['<rootDir>/src/setupEnzyme.ts'],
};
