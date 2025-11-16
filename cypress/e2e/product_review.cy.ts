describe("user can leave a review for the product", () => {
  beforeEach(() => {
    cy.loginWithClerk();
    cy.testLinks();
    cy.get(`[data-test="links-dropdown-item-/products"]`).click();
    cy.location("pathname").should("eq", "/products");
  });
  it("clicking to show review form", () => {
    
  });
});
