import type { JestConfigWithTsJest } from 'ts-jest';

const jestSpecConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.spec.json',
      },
    ],
  },
  testMatch: [
    '**/?(*.)+(spec).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  modulePaths: ['<rootDir>/src'],
};

export default jestSpecConfig;
