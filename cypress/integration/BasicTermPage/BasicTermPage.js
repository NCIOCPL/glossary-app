import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import { testIds } from '../../../src/constants';

Then('the pronunciation text does not appear on the page', () => {
	cy.get(`div[data-testid='${testIds.TERM_DEF_PRONUNCIATION}']`).should(
		'not.exist'
	);
});

Then(
	'there should be a {string} attribute on the definition title element',
	(a) => {
		cy.get(`h1[data-testid='${testIds.TERM_DEF_TITLE}']`).should(
			'have.attr',
			a
		);
	}
);
