'use strict';

const fs = require('fs');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';

module.exports = function (proxy, allowedHost) {
	const isCI = process.env.CI === 'true';
	
	// Base client configuration
	const clientConfig = {
		logging: 'none',
		overlay: false,
		progress: false,
	};
	
	// Only add webSocketURL if not in CI
	if (!isCI) {
		clientConfig.webSocketURL = 'auto://0.0.0.0:0/ws';
	}
	
	const config = {
		// This should be updated with a list of allowed hosts
		allowedHosts: ['localhost', allowedHost],
		// Enable gzip compression of generated files.
		compress: true,
		client: isCI ? false : clientConfig,
		hot: isCI ? false : true,
		liveReload: isCI ? false : true,
		devMiddleware: {
			publicPath: paths.publicUrlOrPath.slice(0, -1),
		},
		static: {
			directory: paths.appPublic,
			publicPath: paths.publicUrlOrPath.slice(0, -1),
			watch: {
				ignored: ignoredFiles(paths.appSrc),
			},
		},
		server: (() => {
			const httpsConfig = getHttpsConfig();
			if (httpsConfig === true) {
				return 'https';
			} else if (httpsConfig === false) {
				return 'http';
			} else if (httpsConfig && typeof httpsConfig === 'object') {
				return {
					type: 'https',
					options: httpsConfig,
				};
			}
			return 'http'; // default fallback
		})(),
		host,
		historyApiFallback: {
			// Paths with dots should still use the history fallback.
			// See https://github.com/facebook/create-react-app/issues/387.
			disableDotRule: true,
			index: paths.publicUrlOrPath,
		},
		// `proxy` is run between `before` and `after` `webpack-dev-server` hooks
		proxy,
		// Disable WebSocket server in CI to prevent Pa11y connection issues
		webSocketServer: isCI ? false : 'ws',
		setupMiddlewares: (middlewares, devServer) => {
			// Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
			// middlewares before `redirectServedPath` otherwise will not have any effect
			// This lets us fetch source contents from webpack for the error overlay
			middlewares.unshift({
				name: 'eval-source-map-middleware',
				middleware: evalSourceMapMiddleware(devServer)
			});
			
			// This lets us open files from the runtime error overlay.
			middlewares.unshift({
				name: 'error-overlay-middleware',
				middleware: errorOverlayMiddleware()
			});

			if (fs.existsSync(paths.proxySetup)) {
				// This registers user provided middleware for proxy reasons
				require(paths.proxySetup)(devServer.app);
			}

			// This service worker file is effectively a 'no-op' that will reset any
			// previous service worker registered for the same host:port combination.
			// We do this in development to avoid hitting the production cache if
			// it used the same host and port.
			// https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
			middlewares.push({
				name: 'no-op-service-worker',
				middleware: noopServiceWorkerMiddleware(paths.publicUrlOrPath)
			});

			return middlewares;
		},
	};

	// Filter out any properties that might be added by react-dev-utils that are not valid for webpack-dev-server
	const validKeys = ['allowedHosts', 'bonjour', 'client', 'compress', 'devMiddleware', 'headers', 'historyApiFallback', 'host', 'hot', 'ipc', 'liveReload', 'onListening', 'open', 'port', 'proxy', 'server', 'app', 'setupExitSignals', 'setupMiddlewares', 'static', 'watchFiles', 'webSocketServer'];

	const filteredConfig = {};
	validKeys.forEach((key) => {
		if (config[key] !== undefined) {
			filteredConfig[key] = config[key];
		}
	});

	return filteredConfig;
};
