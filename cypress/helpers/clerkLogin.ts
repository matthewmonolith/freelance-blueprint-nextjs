import { setupClerkTestingToken } from "@clerk/testing/cypress";

export const loginWithClerk = () => {
  cy.session("userSession", () => {
    cy.visit("/");
    setupClerkTestingToken();

    cy.getByData("links-dropdown-button").click();
    cy.window().its("Clerk");
    cy.getByData("clerk-login-button").click();
    cy.get(".cl-modalBackdrop").should("exist");
    cy.get("#identifier-field").click().type(Cypress.env("test_email"));
    cy.get(".cl-formButtonPrimary").click();
    cy.get("#password-field").click().type(Cypress.env("test_password"));
    cy.get(".cl-formButtonPrimary").click();

    cy.get("[data-test='user-icon']", { timeout: 3500 })
      .should("have.attr", "src")
      .and("include", "img.clerk");
  });

  cy.visit("/");
};
