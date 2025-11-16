import { loginWithClerk } from "../helpers/clerkLogin";
import { testLinks } from "../helpers/testLinks";
// import 'cypress-ssr-localhost-mocker/commands';

declare global {
  namespace Cypress {
    interface Chainable {
      loginWithClerk: typeof loginWithClerk;
      getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>;
      testLinks: typeof testLinks;
    }
  }
}

Cypress.Commands.add("getByData", (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add("loginWithClerk", loginWithClerk);

Cypress.Commands.add("testLinks", testLinks);
