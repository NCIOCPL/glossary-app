/// <reference types="Cypress" />
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Then('there is no audio player or icon', () => {
	cy.get('div.pronunciation__audio').should('not.exist');
});

Given('there is an audio player with the url {string} before the phonetic spelling', (a) => {
	cy.get('div.pronunciation__audio').should('exist');
	cy.get('div.pronunciation__audio audio').should('have.attr', 'src').and('to.be.eq', a);
});

When('the user clicks the audio speaker icon', () => {
	cy.get('div.pronunciation button').as('playButton').click();
	cy.wait(500);
});

Then('the pronunciation for {string} should play', () => {
	const retries = 3;
	const selector = 'div.pronunciation__audio audio';
	const checkAudioPlayback = () => {
		cy.get("div.pronunciation button[class='btnAudio playing']").should('exist');
		cy.get(selector).should('have.prop', 'readyState', 4);
		cy.waitForAudioToStartPlaying(selector);
	};

	cy.wrap(checkAudioPlayback).should(() => {
		cy.retry(retries, checkAudioPlayback).then(() => {
			cy.log('Audio playback succeeded');
		});
	});
});

Then('a pause button appears in place of the speaker icon', () => {
	//verify that audio is playing by assering it is not paused and not finished
	cy.document().then((doc) => {
		let isPaused = doc.querySelector('div.pronunciation__audio audio').paused;
		let isFinished = doc.querySelector('div.pronunciation__audio audio').ended;
		expect(isPaused).to.be.false;
		expect(isFinished).to.be.false;
	});
});

When('user clicks pause', () => {
	cy.get('@playButton').click();
	cy.document().then((doc) => {
		let ranges = doc.querySelector('div.pronunciation__audio audio').played;
		let duration = doc.querySelector('div.pronunciation__audio audio').duration;
		//capture the time elapsed when audio track was paused
		for (var i = 0; i < ranges.length; i++) {
			cy.endPercent = ranges.end(i) / duration;
		}
	});
});

Then('the audio track pauses and the play icon appears', () => {
	cy.document().then((doc) => {
		let paused = doc.querySelector('div.pronunciation__audio audio').paused;
		expect(paused).to.be.true;
	});
});

When('user clicks play icon', () => {
	cy.get('@playButton').click();
});

Then('audio plays from where it was paused and the pause icon appears', () => {
	cy.document().then((doc) => {
		let ranges = doc.querySelector('div.pronunciation__audio audio').played;
		let duration = doc.querySelector('div.pronunciation__audio audio').duration;
		for (var i = 0; i < ranges.length; i++) {
			var endPercent = ranges.end(i) / duration;
		}
		// it is impossible to capture exact time with Cypress due to some time difference in execution
		//however 0.1 sec seems like aceptable difference to still assume that audio playing
		//from where it was paused
		var diff = endPercent - cy.endPercent;
		expect(diff).to.not.greaterThan(0.1);
	});
});

When('audio has finished playing, the button returns to the audio speaker icon', () => {
	cy.get('@playButton').should('not.have.class', 'btnAudio playing');
	cy.document().then((doc) => {
		let finished = doc.querySelector('div.pronunciation__audio audio').ended;
		expect(finished).to.be.true;
	});
});
