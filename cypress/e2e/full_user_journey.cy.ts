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
    const productName = "Band Shirt";
    const productBrand = "Mills - Koelpin";

    beforeEach(() => {
      cy.visit("/products?layout=list&search=band");
      cy.getByData("product-list-item").click();
      cy.location("pathname").should("match", supabaseId);
    });

    it("adds product to cart and navigates to cart page", () => {
      cy.getByData("add-to-cart-button").click().wait(1500);
      cy.url().should("include", "/cart");
      cy.getByData("cart-item").find("div").as("cols");

      cy.get("@cols")
        .eq(0)
        .find("img")
        .should("have.attr", "src")
        .and("include", "supabase");

      cy.get("@cols")
        .eq(1)
        .find("a")
        .should("have.attr", "href")
        .and("match", supabaseId);

      cy.get("@cols").eq(1).find("h3").contains(productName);
      cy.get("@cols").eq(1).find("h4").contains(productBrand);
    });

    it("selects product amount and shows toast", () => {
      cy.getByData("add-to-cart-button").click().wait(1500);
      cy.url().should("include", "/cart");

      cy.getByData("product-select").click();
      cy.getByData("product-select-item").eq(0).click().wait(3500);

      cy.getByData("toast").should("exist");
      cy.getByData("toast-description").should("exist");
    });

    it("displays correct subtotal format", () => {
      cy.getByData("add-to-cart-button").click().wait(1500);
      cy.url().should("include", "/cart");

      cy.getByData("product-select").click();
      cy.getByData("product-select-item").eq(0).click().wait(3500);

      cy.getByData("cart-row-amount")
        .eq(0)
        .invoke("text")
        .should("match", /^£\d+(\.\d{1,2})?$/);
    });

    it("calculates VAT correctly", () => {
      cy.getByData("add-to-cart-button").click().wait(1500);
      cy.url().should("include", "/cart");

      cy.getByData("product-select").click();
      cy.getByData("product-select-item").eq(0).click().wait(3500);

      cy.getByData("cart-row-amount")
        .eq(0)
        .invoke("text")
        .then((subtotalText) => {
          const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ""));

          cy.getByData("cart-row-amount")
            .eq(2)
            .invoke("text")
            .then((vatText) => {
              const vat = parseFloat(vatText.replace(/[^0-9.]/g, ""));
              const expectedVat = Math.ceil(vat);

              expect(vat).to.equal(expectedVat);
            });
        });
    });

    it("can place the order", () => {
      cy.getByData("add-to-cart-button").click().wait(1500);
      cy.url().should("include", "/cart");
      cy.getByData("Place-Order-button").click();
      cy.url().should("include", "/orders");
    });
  });
  context.only("displays users' orders after purchase", () => {
    it("loading orders", () => {
      cy.getByData("links-dropdown-button").click();
      cy.getByData("links-dropdown-menu");
      cy.get(`[data-test="links-dropdown-item-/orders"]`).click();
      cy.url().should("include", "/orders");
      cy.getByData("links-dropdown-button").click();
      cy.getByData("order-table-row")
        .should("have.length.greaterThan", 0)
        .as("rows");
      cy.getByData("total-orders")
        .invoke("text")
        .then((text) => {
          const total = parseInt(text.split(":")[1]);

          cy.get("@rows").then((rows) => {
            expect(rows.length - 1).to.equal(total);
          });
        });
    });
  });
});
