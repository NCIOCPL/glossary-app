'use strict';

/******
 * Finds a Chrome executable for pa11y to drive.
 *
 * pa11y talks to Chrome through puppeteer, which by default expects a copy in
 * ~/.cache/puppeteer that puppeteer's own postinstall put there. That cache sits
 * outside the workspace, so a CI run restoring node_modules from a cache never
 * repopulates it, and a partially extracted copy makes puppeteer refuse to
 * repair itself.
 *
 * None of that matters when a browser is already on the machine: the runner
 * images ship Chrome and point CHROME_BIN at it, and developer Macs have Chrome
 * installed. This resolves the first usable browser, so the download is a
 * fallback rather than a prerequisite.
 *
 * .pa11yci.js and scripts/ensure-browsers.js share this so the browser that gets
 * checked is the browser that gets launched.
 */

const fs = require('fs');

/* Puppeteer's own copy is preferred when present: it is the build puppeteer was
 * released against. Everything after it is a browser already on the machine. */
function candidates() {
	const found = [process.env.CHROME_BIN, process.env.PUPPETEER_EXECUTABLE_PATH];

	try {
		found.push(require('puppeteer').executablePath());
	} catch (error) {
		/* puppeteer cannot resolve a path on an unsupported platform. */
	}

	return found.concat([
		'/usr/bin/google-chrome',
		'/usr/bin/google-chrome-stable',
		'/usr/bin/chromium-browser',
		'/usr/bin/chromium',
		'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		'/Applications/Chromium.app/Contents/MacOS/Chromium',
	]);
}

/* The path of a Chrome that exists on disk, or null if none does. */
function resolveChrome() {
	return (
		candidates().find((candidate) => candidate && fs.existsSync(candidate)) ||
		null
	);
}

module.exports = { resolveChrome };
