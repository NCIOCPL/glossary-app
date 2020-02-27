
/// <reference types="Cypress" />
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Then('there is no audio player or icon',()=>{
cy.get('div.pronunciation__audio').should('not.exist');

});

Given('there is an audio player with the url {string} before the phonetic spelling', (a) => {
  cy.get('div.pronunciation__audio').should('exist');
  cy.get('div.pronunciation__audio audio').should('have.attr','src').and('to.be.eq',a);
});

When('the user clicks the audio speaker icon', () => {
  cy.get('div.pronunciation button').as('playButton').click();
 

});

When('user clicks pause', () => {
  cy.get('div.pronunciation button').click();
});

When('user clicks play icon', () => {
  cy.get('div.pronunciation button').click();
});

Then('when audio has finished playing, the button returns to the audio speaker icon', () => {
  cy.get('div.pronunciation button').should('have.class','btnAudio');
});

Then('the audio track pauses and the play icon appears', () => {
  cy.get('div.pronunciation button').should('have.class','btnAudio paused');
});

Then('the pronunciation for metastatic should play', () => {
  cy.get('div.pronunciation button').should('have.class','btnAudio playing');
});

Then('audio plays from where it was paused and the pause icon appears', () => {
  cy.get('div.pronunciation button').should('have.class','btnAudio playing');
});

Then('a pause button appears in place of the speaker icon', () => {
  cy.get('div.pronunciation button').should('have.class','btnAudio playing');
});
