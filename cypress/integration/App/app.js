import { Given, Then } from "cypress-cucumber-preprocessor/steps";

Given("the user visits the app page", () => {
  cy.visit("http://localhost:3000/");
});

Then("page title is {string}", title => {
  cy.get("h1").should("contain", title);
});
