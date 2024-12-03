import { links } from "../../utils/links";

export const testLinks = () => {
  cy.getByData("links-dropdown-button").click();
  cy.getByData("links-dropdown-menu").should("exist");
  links.forEach((link) => {
    const assertion = link.label === "dashboard" ? "not.exist" : "have.text";
    cy.get(`[data-test="links-dropdown-item-${link.href}"]`).should(
      assertion,
      link.label
    );
  });
};
