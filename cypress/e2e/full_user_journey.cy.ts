import { setupClerkTestingToken } from "@clerk/testing/cypress";

describe("Full user journey, from signin to checkout", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  context("Signing in", () => {
    it("user can sign in successfully using Clerk", () => {
      setupClerkTestingToken();
      cy.getByData("links-dropdown-button").click();
      cy.window().its('Clerk')
    //   cy.reload();
        cy.getByData("clerk-login-button").click();
        cy.get(".cl-modalBackdrop").should("exist");
        cy.get("#identifier-field").click().type(Cypress.env("test_email"))
    });
  });
});
