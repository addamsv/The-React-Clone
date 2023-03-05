process.env.JEST_PUPPETEER_CONFIG = require.resolve(
  "./jest-puppeteer.config.js"
);

module.exports = {
  preset: "jest-puppeteer",
  globals: {
    SERVER_URL: "http://localhost:3000",
  },
  testRegex: "./*\\.puppeteer-test\\.tsx$",
};

console.log(
  "RUNNING E2E INTEGRATION TESTS - MAKE SURE PORT 3000 IS NOT IN USAGE"
);
