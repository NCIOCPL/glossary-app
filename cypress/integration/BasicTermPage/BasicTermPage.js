import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Then('the pronunciation text does not appear on the page', () => {
  cy.get("div[data-testid='term-def-pronunciation']").should('not.exist');
});

Then("there should be a {string} attribute on the definition title element", (a) => {
  cy.get("h1[data-testid='term-def-title']").should('have.attr', a);
});