module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    "__tests__/Playwright/",
    "__tests__/helper/",
    "__tests__/helper/builder/",
    "__tests__/sample_data/"
  ],
  coveragePathIgnorePatterns: ["__tests__/helper/", "__tests__/helper/builder/", "src/commands/"],
  coverageDirectory: "./coverage/Jest/",
  silent: true
};
