import { setupClerkTestingToken } from "@clerk/testing/cypress";
import { links } from "../../utils/links";

describe("Full user journey, from sign-in to checkout (non-admin user)", () => {
  beforeEach(() => {
    cy.session("userSession", () => {
      cy.visit("http://localhost:3000/");
      setupClerkTestingToken();

      cy.getByData("links-dropdown-button").click();
      cy.window().its("Clerk");
      cy.getByData("clerk-login-button").click();
      cy.get(".cl-modalBackdrop").should("exist");
      cy.get("#identifier-field").click().type(Cypress.env("test_email"));
      cy.get(".cl-formButtonPrimary").click();
      cy.get("#password-field").click().type(Cypress.env("test_password"));
      cy.get(".cl-formButtonPrimary").click();

      //user icon can be from different types of enabled oauth, such as from google, or generic email password etc, 'img.clerk' is a generic enough way to determine it's at least now rendering the unsigned in icon
      cy.get("[data-test='user-icon']", { timeout: 3500 })
        .should("have.attr", "src")
        .and("include", "img.clerk");
    });
    cy.visit("http://localhost:3000/");
  });

  context("Links dropdown component", () => {
    it("Should show correct links after sign in", () => {
      cy.getByData("links-dropdown-button").click();
      cy.getByData("links-dropdown-menu").should("exist");
      links.forEach((link) => {
        const assertion =
          link.label === "dashboard" ? "not.exist" : "have.text";
        cy.get(`[data-test="links-dropdown-item-${link.href}"]`).should(
          assertion,
          link.label
        );
      });
      cy.get("body").click();
      cy.getByData("links-dropdown-menu").should("not.exist");
    });
  });

  context("Home page should load featured products", () => {
    
  })
});
