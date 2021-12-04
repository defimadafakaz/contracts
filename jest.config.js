module.exports = {
    preset: 'ts-jest',
    roots: ['test'],
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.(spec|comp|it|e2e).ts'],
    moduleDirectories: ['node_modules'],
};
