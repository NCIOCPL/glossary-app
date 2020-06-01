import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user visits the app page', () => {
	cy.visit('/');
});
