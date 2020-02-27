import { Then, When } from "cypress-cucumber-preprocessor/steps";

Then('heading {string} appears', searchBoxTitle => {
    cy.log('Heading:', searchBoxTitle);
    cy.get('h4').contains(searchBoxTitle);
});

Then('search options for {string} and {string} appears', () => {

});

Then('search box appears', () => {

});
Then('search button appears beside search box', () => {

});

Then('{string} appears with A-Z List of Links beside it', () => {

});

Then('user submits their search', () => {

});

Then('the system returns users to the search results page for the search term', () => {

});
