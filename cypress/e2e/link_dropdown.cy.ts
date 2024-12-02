import { setupClerkTestingToken } from "@clerk/testing/cypress";
import { links } from "../../utils/links";

describe("after login shows the correct links and opens to the correct page (non-admin user!)", () => {
  beforeEach(() => {
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
      cy.wait(3500);
    });
    cy.visit("/");
    cy.getByData("links-dropdown-button").click();
    cy.getByData("links-dropdown-menu").should("exist");
    links.forEach((link) => {
      const assertion = link.label === "dashboard" ? "not.exist" : "have.text";
      cy.get(`[data-test="links-dropdown-item-${link.href}"]`).should(
        assertion,
        link.label
      );
    });
  });
  it("To home", () => {
    cy.get(`[data-test="links-dropdown-item-/"]`).click()
    cy.location('pathname').should('eq', '/')
  });
  it("To about", () => {
    cy.get(`[data-test="links-dropdown-item-/about"]`).click()
    cy.location('pathname').should('eq', '/about')
  });
  it("To products", () => {
    cy.get(`[data-test="links-dropdown-item-/products"]`).click()
    cy.location('pathname').should('eq', '/products')
  });
  it("To favourites", () => {
    cy.get(`[data-test="links-dropdown-item-/favourites"]`).click()
    cy.location('pathname').should('eq', '/favourites')
  });
  it("To reviews", () => {
    cy.get(`[data-test="links-dropdown-item-/reviews"]`).click()
    cy.location('pathname').should('eq', '/reviews')
  });
  it("To Cart", () => {
    cy.get(`[data-test="links-dropdown-item-/cart"]`).click()
    cy.location('pathname').should('eq', '/cart')
  });
  it("To orders", () => {
    cy.get(`[data-test="links-dropdown-item-/orders"]`).click()
    cy.location('pathname').should('eq', '/orders')
  });
});
