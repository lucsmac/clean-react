import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) { },
    baseUrl: "http://localhost:8080",
    fixturesFolder: false,
    supportFile: false,
    fileServerFolder: '<rootDir>/src/main/test',
    specPattern: 'src/main/test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
