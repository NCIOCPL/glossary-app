import { Given, Then } from "cypress-cucumber-preprocessor/steps";

Then("page title is {string}", title => {
  cy.get('h1').should('contain', title);
});

Then("the page title is {string}", title => {
  cy.get('h1').should('contain', title);
});

Given("the user visits the home page", () => {
  cy.visit("/");
});

Given('the user is viewing the definition with the pretty url {string}', (a) => {
  cy.visit("/def/"+a);
});

Then('the definition text {string} appears on the page', (a) => {
 cy.get("div[data-testid='term-def-description']").should(($div) => {
  expect($div).to.have.lengthOf(1);
  const el = $div.get(0);
  expect(el.innerText).to.be.equal(a);
})
});

Given('{string} is set to {string}', (key, param) => {
  cy.on('window:before:load', (win) => {
    win.INT_TEST_APP_PARAMS[key] = param;
})
});

Then('the pronunciation text {string} appears on the page', (a) => {
  cy.get("div[data-testid='term-def-pronunciation']").should('have.text', a);
});

Then('there is no pronunciation text on the page', () => {
 cy.get("div[data-testid='term-def-pronunciation']").should('be.empty');
});