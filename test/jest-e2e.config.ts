import { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
};

export default config;
