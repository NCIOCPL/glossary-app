/// <reference types="Cypress" />
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { searchMatchType, testIds } from '../../../src/constants';

When('user clicks on {string} button', (searchButton) => {
	cy.get(`#btnSearch[value='${searchButton}']`).click();
});

When('user selects {string} option', (startsWithOrContains) => {
  let locator;
  const queryType = startsWithOrContains.toLowerCase();
	if (( queryType === 'contains') || (queryType === 'contiene')) {
		locator = "label[for='contains']";
	} else {
		locator = "label[for='starts-with']";
	}
	cy.get(locator).click();
});

When('user types {string} in the search bar', (keyword) => {
	cy.get('#keywords').type(keyword);
});

Then(
	'search results page displays results title {string} {string}',
	(searchResultsTitle, keyword) => {
		cy.get('h4', { timeout: 20000 })
			.invoke('text')
			.should('include', searchResultsTitle.substring(1))
			.and('include', keyword);
	}
);

Then(
	'search bar contains a placeholder text {string}',
	(searchBarPlaceholder) => {
		cy.get('#keywords')
			.should('have.attr', 'placeholder')
			.and('be.eq', searchBarPlaceholder);
	}
);

Then('{string} option is selected', (startsWithOrContains) => {
	let radioButtonValue =
		startsWithOrContains === 'Contains'
			? searchMatchType.contains
			: searchMatchType.beginsWith;
	if (startsWithOrContains === 'Contiene') {
		radioButtonValue = searchMatchType.contains;
	} else if (startsWithOrContains === 'Empieza con') {
		radioButtonValue = searchMatchType.beginsWith;
	}
	const locator = `input[value='${radioButtonValue}']`;
	cy.get(locator).should('be.checked');
});

Then('search bar contains the {string} that user entered', (keyword) => {
	cy.get('#keywords').should('have.value', keyword);
});

Then('placeholder text disappears', () => {
	cy.get('#keywords').should('have.attr', 'placeholder').and('not.be.visible');
});

Then('the page displays {string}', (noMatchFoundMessage) => {
	const locator = `p[data-testid='${testIds.NO_MATCHING_RESULTS}']`;
	cy.get(locator, { timeout: 10000 })
		.invoke('text')
		.should('be.eq', noMatchFoundMessage);
});

Then('the URL contains {string}', (urlPart) => {
	cy.location('pathname').should('include', urlPart);
});

Then('the page contains meta tags with the following names', (dataTable) => {
	for (const { name, content } of dataTable.hashes()) {
		const locator = `meta[name='${name}']`;
		//find element, ensure it has attribute content
		//compare content's value with expected one
		cy.get(locator).should('have.attr', 'content').and('be.eq', content);
	}
});

Then('the user is redirected to {string}', (redirectUrl) => {
	cy.location('pathname').should('include', redirectUrl);
});

Then('the search bar on the page does not maintain the user’s term', () => {
	cy.get('#keywords').invoke('val').should('be.empty');
});
