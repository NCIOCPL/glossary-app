// Starting with Ubuntu 22.04, pa11y-ci requires us to tell it the Chrome binary's path
// Fortunately, GitHub Actions has an environment variable for that.
// The rest of this is so we don't break local development on Macs.
// According to the (current) docs, this can all go away once we upgrade pa11y-ci to 4.0 .
const defaultChromeLaunchConfig = {
	args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};
const chromeLaunchConfig = process.env.CHROME_BIN
	? { executablePath: process.env.CHROME_BIN, ...defaultChromeLaunchConfig }
	: defaultChromeLaunchConfig;


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
	"chromeLaunchConfig": chromeLaunchConfig
}
