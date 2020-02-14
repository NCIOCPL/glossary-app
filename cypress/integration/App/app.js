import { Given, Then } from "cypress-cucumber-preprocessor/steps";

Given("the user visits the app page", () => {
  cy.visit("/");
});

