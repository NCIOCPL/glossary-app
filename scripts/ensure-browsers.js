'use strict';

/******
 * Confirms the browser binaries the pa11y and cypress suites need are available
 * before the test chain runs.
 *
 * These binaries live in caches outside the workspace (~/.cache/puppeteer and
 * ~/Library/Caches/Cypress or ~/.cache/Cypress), so a CI run that restores
 * node_modules from a cache never re-runs the dependency postinstall steps that
 * would populate them, and the suites then fail on a missing browser.
 *
 * Chrome is resolved rather than installed: scripts/resolve-chrome.js finds the
 * browser already on the machine, which is the same one .pa11yci.js hands to
 * pa11y. Downloading one is only attempted when there is nothing to find.
 */

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { resolveChrome } = require('./resolve-chrome');

const binary = (name) =>
	path.join(__dirname, '..', 'node_modules', '.bin', name);

const run = (name, args) =>
	execFileSync(binary(name), args, { stdio: 'inherit' });

const succeeds = (name, args) => {
	try {
		run(name, args);
		return true;
	} catch (error) {
		return false;
	}
};

const cacheDir = () =>
	process.env.PUPPETEER_CACHE_DIR ||
	path.join(os.homedir(), '.cache', 'puppeteer');

/* Re-runs puppeteer's postinstall. npm is invoked through the executable that
 * launched this script so the child cannot pick up a different npm than the one
 * running the test chain. */
function rebuildPuppeteer() {
	const npmPath = process.env.npm_execpath;
	const usingNpmScript = Boolean(npmPath) && npmPath.endsWith('.js');
	const command = usingNpmScript ? process.execPath : 'npm';
	const args = usingNpmScript ? [npmPath] : [];

	return spawnSync(command, [...args, 'rebuild', 'puppeteer'], {
		encoding: 'utf8',
	});
}

function ensureChrome() {
	console.log('Ensuring Chrome is available for puppeteer/pa11y...');

	const existing = resolveChrome();
	if (existing) {
		console.log(`  using ${existing}`);
		return;
	}

	/* Nothing on the machine, so fall back to puppeteer's download. Whatever is
	 * in the cache is unusable, and puppeteer will not repair a partially
	 * extracted copy - it reports the folder exists but the executable is
	 * missing - so clear the cache before reinstalling. */
	console.log('  no browser found; downloading one with puppeteer...');
	const root = cacheDir();
	if (fs.existsSync(root)) {
		fs.readdirSync(root).forEach((entry) => {
			fs.rmSync(path.join(root, entry), { recursive: true, force: true });
		});
	}

	const result = rebuildPuppeteer();
	if (result.stdout) {
		console.log(result.stdout.trim());
	}
	if (result.stderr) {
		console.log(result.stderr.trim());
	}

	const installed = resolveChrome();
	if (!installed) {
		throw new Error(
			`No Chrome executable could be found or installed (npm rebuild exited ` +
				`${result.status}). Set CHROME_BIN to a Chrome binary, or install ` +
				'Chrome. pa11y cannot run without it.'
		);
	}
	console.log(`  using ${installed}`);
}

function ensureCypress() {
	console.log('Ensuring the Cypress binary is installed...');
	if (!succeeds('cypress', ['verify'])) {
		console.log('  Cypress binary missing or unusable. Reinstalling...');
		run('cypress', ['install', '--force']);
		run('cypress', ['verify']);
	}
}

try {
	ensureChrome();
	ensureCypress();
	console.log('Browser binaries are ready.');
} catch (error) {
	console.error(error.message || error);
	process.exit(1);
}
