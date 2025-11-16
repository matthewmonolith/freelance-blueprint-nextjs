import { clerkSetup } from "@clerk/testing/cypress";
import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // on('before:spec', () => {
      //   return SSRLocalhostMocker.init(3000);
      // });
      // on('after:spec', () => {
      //   return SSRLocalhostMocker.close();
      // });
      // on('task', {
      //   mockBackendRequest: SSRLocalhostMocker.getMockBackendRequest(),
      //   clearAllbackendMockRequests: SSRLocalhostMocker.getClearAllMocks(),
      // });
      return clerkSetup({ config });
    },
    env: {
      test_email: process.env.CYPRESS_TEST_EMAIL,
      test_password: process.env.CYPRESS_TEST_PASSWORD,
    },
    baseUrl: "http://localhost:3000",
  },
});
