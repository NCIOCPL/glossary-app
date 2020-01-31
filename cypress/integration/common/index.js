import { Given, Then } from "cypress-cucumber-preprocessor/steps";

Then("page title is {string}", a => {
  cy.title().should("include", a);
});

Given("the user visits the home page", () => {
  cy.visit("http://localhost:3000/");
});
