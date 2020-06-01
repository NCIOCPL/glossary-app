/// <reference types="Cypress" />
import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('browser waits', () => {
	cy.wait(2000);
});

When('NCIDataLayer is being captured', () => {
	cy.window().then((win) => {
		while (win.NCIDataLayer.length > 0) {
			win.NCIDataLayer.pop();
		}
	});
});

Then(
	'there should be an NCIDataLayer PageLoad event with the name {string}',
	(eventName) => {
		cy.window().then((win) => {
			// Get the object off the window
			expect(win.NCIDataLayer).to.have.length(1);
			const eventData = win.NCIDataLayer[0];
			expect(eventData.type).to.eq('PageLoad');
			expect(eventData.event).to.eq(eventName);
		});
	}
);

/**
 * This is very specific to a load event. We are going to check
 * the evtdata.page object for this check.
 */
Then('the event has the following page details', (datatable) => {
	//get the number of row without headers
	const numberOfKeys = datatable.rawTable.slice().length - 1;
	cy.window().then((win) => {
		const eventData = win.NCIDataLayer[0].page;
		//clone the eventdata object into a new one(so we can delete additionalDetails key
		//without affecting original page event)
		const clone = JSON.parse(JSON.stringify(eventData));
		//perform assertions for all event keys
		for (const { key, value } of datatable.hashes()) {
			expect(eventData[key]).to.eq(value);
		}
		//Get the list of keys of the page object without additionalDetails.
		//Then check if the number of keys in the test are the same with the page object.
		delete clone.additionalDetails;
		const pageKeys = Object.entries(clone);
		expect(pageKeys.length).to.eq(numberOfKeys);
	});
});

/**
 * This is very specific to a load event. We are going to check
 * the evtdata.page.additionalDetails object for this check.
 */
Then(
	'the event has the following additional details for the page',
	(datatable) => {
		//get the number of row without headers
		const numberOfKeys = datatable.rawTable.slice().length - 1;
		cy.window().then((win) => {
			const eventData = win.NCIDataLayer[0].page.additionalDetails;
			for (const { key, value } of datatable.hashes()) {
				expect(eventData[key].toString()).to.eq(value);
			}
			//get all keys from the additionalDetails and
			//verify that number matcing expected
			const addDetailsKeys = Object.entries(eventData);
			expect(addDetailsKeys.length).to.eq(numberOfKeys);
		});
	}
);
