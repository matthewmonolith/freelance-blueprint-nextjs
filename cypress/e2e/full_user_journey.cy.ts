import { setupClerkTestingToken } from "@clerk/testing/cypress";
import { links } from "../../utils/links";

const supabaseId = new RegExp(
  "^/products/[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$"
); //supbase always an 8-4-4-4-12 UUID has

describe("Full user journey, from sign-in to checkout (non-admin user)", () => {
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

      //user icon can be from different types of enabled oauth, such as from google, or generic email password etc, 'img.clerk' is a generic enough way to determine it's at least now rendering the unsigned in icon
      cy.get("[data-test='user-icon']", { timeout: 3500 })
        .should("have.attr", "src")
        .and("include", "img.clerk");
    });
    cy.visit("/");
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
    it("loads the featured product grid", () => {
      cy.getByData("product-grid").within(() => {
        cy.getByData("product-grid-item").should("have.length.greaterThan", 0);
      });
    });

    it("renders the first product correctly", () => {
      cy.getByData("product-grid-item")
        .first()
        .within(() => {
          cy.get("a").should("have.attr", "href").and("match", supabaseId);
          cy.get("img").should("have.attr", "src").and("include", "supabase");
          cy.getByData("product-name").invoke("text").should("not.be.empty");
          cy.getByData("product-amount")
            .invoke("text")
            .should("match", /^£\d+(\.\d{1,2})?$/);
          cy.getByData("product-favourite-button").should("exist");
        });
    });
  });

  context("Product search", () => {
    beforeEach(() => {
      cy.getByData("product-search").as("search");
    });

    it("User types into a blank input and sees search results", () => {
      cy.get("@search").invoke("val").should("be.empty");
      cy.get("@search").click().type("band").wait(1500);
      cy.url().should("include", "/products?search=band");
      cy.getByData("product-container-heading").contains("1 product");
      cy.getByData("product-grid").within(() => {
        cy.getByData("product-grid-item").should("have.length.greaterThan", 0);
      });
    });

    it("User switches to list view", () => {
      cy.visit("/products?search=band");
      cy.getByData("product-container-button").click();
      cy.url().should("include", "/products?layout=list&search=band");
      cy.getByData("product-list").within(() => {
        cy.getByData("product-list-item").should("have.length.greaterThan", 0);
      });
    });

    it("User toggles favourite button", () => {
      cy.visit("/products?layout=list&search=band");
      cy.getByData("product-list").within(() => {
        cy.getByData("product-list-item")
          .first()
          .within(() => {
            cy.getByData("product-favourite-button").click();
          });
      });
      cy.getByData("toast");
      cy.getByData("toast-description");
    });
  });

  context("product added to the cart", () => {
    it("product page, add to cart", () => {
      cy.visit("/products?layout=list&search=band");
      cy.getByData("product-list-item").click();
      cy.location("pathname").should("match", supabaseId);
      cy.getByData('add-cart-button').click()
      cy.url().contains('/cart')
    });
  });
});
