// pa11y-ci launches Chrome through puppeteer, which looks for its own download
// in a cache outside the workspace. Rather than depend on that cache being
// populated, point pa11y at whichever browser is actually on the machine - the
// one CHROME_BIN names on CI, or a locally installed Chrome. Falling through to
// undefined leaves puppeteer to resolve the browser itself.
const { resolveChrome } = require('./scripts/resolve-chrome');

const chromeLaunchConfig = {
	args: [
		'--no-sandbox', 
		'--disable-setuid-sandbox', 
		'--disable-dev-shm-usage',
		'--disable-web-security',
		'--disable-features=IsolateOrigins',
		'--disable-site-isolation-trials',
		'--disable-blink-features=AutomationControlled',
		'--disable-gpu',
		'--disable-software-rasterizer'
	],
	ignoreHTTPSErrors: true,
	executablePath: resolveChrome() || undefined,
};

module.exports = {
  urls: [
    "http://localhost:3000",
    "http://localhost:3000?cfg=1",
    "http://localhost:3000?cfg=2",
    "http://localhost:3000?cfg=3",
    "http://localhost:3000/expand/A",
    "http://localhost:3000/expand/A?cfg=1",
    "http://localhost:3000/expand/K?cfg=2",
    "http://localhost:3000/expand/Y?cfg=3",
    "http://localhost:3000/def/a33",
    "http://localhost:3000/def/a33?cfg=1",
    "http://localhost:3000/def/metastatic",
    "http://localhost:3000/def/metastasico?cfg=1",
    "http://localhost:3000/def/acrochordon?cfg=2",
    "http://localhost:3000/def/acrochordon?cfg=3",
    "http://localhost:3000/def/antioncogen?cfg=3"
  ],
	// pa11y-ci only forwards options to pa11y from `defaults`; a chromeLaunchConfig
	// at the top level of this file is read by nothing.
	"defaults": {
		"chromeLaunchConfig": chromeLaunchConfig,
		"timeout": 60000,
		"wait": 2000,
		"viewport": {
			"width": 1280,
			"height": 1024
		}
	}
}
