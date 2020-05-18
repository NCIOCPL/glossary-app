/// <reference types="Cypress" />
import { Then } from 'cypress-cucumber-preprocessor/steps';


Then('there should be an NCIDataLayer Other event with the name {string} and linkname {string}', (eventName, linkname) => {
    cy.window().then((win) => {
        // Get the object off the window
        expect(win.NCIDataLayer).to.have.length(2);
        const eventData = win.NCIDataLayer[1];
        expect(eventData.type).to.eq('Other');
        expect(eventData.event).to.eq(eventName);
        expect(eventData.linkName).to.eq(linkname);
    });
});
Then('the event has the following data', datatable => {
    //get the number of row without headers
    const numberOfKeys = datatable.rawTable.slice().length - 1;
    cy.window().then((win) => {
        const eventData = win.NCIDataLayer[1].data;
        //clone the eventdata object into a new one(so we can delete additionalDetails key
        //without affecting original page event)
        const clone = JSON.parse(JSON.stringify(eventData));
        //perform assertions for all event keys
        for (const { key, value } of datatable.hashes()) {
            if (key === 'letter') {
                expect(eventData.letter.expandChar).to.eq(value)
            } else
                expect(eventData[key]).to.eq(value);
        }
        //Get the list of keys of the page object without additionalDetails. 
        //Then check if the number of keys in the test are the same with the page object.
        delete clone.additionalDetails
        const pageKeys = Object.entries(clone);
        expect(pageKeys.length).to.eq(numberOfKeys)
    });
});