describe("after login shows the correct links and opens to the correct page (non-admin user!)", () => {
  beforeEach(() => {
    cy.loginWithClerk();
    cy.testLinks()
  });
  it("To home", () => {
    cy.get(`[data-test="links-dropdown-item-/"]`).click();
    cy.location("pathname").should("eq", "/");
  });
  it("To about", () => {
    cy.get(`[data-test="links-dropdown-item-/about"]`).click();
    cy.location("pathname").should("eq", "/about");
  });
  it("To products", () => {
    cy.get(`[data-test="links-dropdown-item-/products"]`).click();
    cy.location("pathname").should("eq", "/products");
  });
  it("To favourites", () => {
    cy.get(`[data-test="links-dropdown-item-/favourites"]`).click();
    cy.location("pathname").should("eq", "/favourites");
  });
  it("To reviews", () => {
    cy.get(`[data-test="links-dropdown-item-/reviews"]`).click();
    cy.location("pathname").should("eq", "/reviews");
  });
  it("To Cart", () => {
    cy.get(`[data-test="links-dropdown-item-/cart"]`).click();
    cy.location("pathname").should("eq", "/cart");
  });
  it("To orders", () => {
    cy.get(`[data-test="links-dropdown-item-/orders"]`).click();
    cy.location("pathname").should("eq", "/orders");
  });
});
