import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) { },
    baseUrl: "http://localhost:8080",
    fixturesFolder: false,
    supportFile: 'src/main/test/cypress/support/e2e.ts',
    specPattern: 'src/main/test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
