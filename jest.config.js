module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    transformIgnorePatterns: ['node_modules/(?!axios)'],
  };
  