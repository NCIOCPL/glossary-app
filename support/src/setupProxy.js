/// <reference path="../../node_modules/@types/express/index.d.ts"/>

const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Async wrapper for readFile
 */
const readFileAsync = util.promisify(fs.readFile);

/**
 * Async wrapper for readDir
 */
const readDirAsync = util.promisify(fs.readdir);

/**
 * getAutoSuggestResults - Middleware for getting results for auto suggest.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const getAutoSuggestResults = async (req, res, next) => {
	const {
		params: { audience, dictionary, language, query },
		query: { matchType },
	} = req;
	const resNoResults = [];
	const mockDir = path.join(
		__dirname,
		'..',
		'mock-data',
		'Autosuggest',
		dictionary,
		audience,
		language,
		matchType
	);

	try {
		const mockFile = path.join(mockDir, `${query}.json`);
		await fs.promises
			.access(mockFile)
			.then(() => {
				res.sendFile(mockFile);
			})
			.catch((err) => {
				// API return an empty array for no results
				console.error(err);
				if (err.code === 'ENOENT') {
					console.log(
						'Create file with payload in path specified above to return a response with results. ' +
							'\n' +
							'Returning response with no results for request.',
						resNoResults
					);
				}
				res.send(resNoResults);
			});
	} catch (err) {
		console.error(err);
		res.send(resNoResults);
	}
};

/**
 * getResultsByQueryType - Middleware for getting expand or search results by query.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const getResultsByQueryType = async (req, res, next) => {
	const {
		params: { audience, dictionary, language, query, queryType },
		query: { matchType },
	} = req;

	const mockDir =
		queryType === 'search'
			? path.join(
					__dirname,
					'..',
					'mock-data',
					'Terms',
					queryType,
					dictionary,
					audience,
					language,
					matchType
			  )
			: path.join(
					__dirname,
					'..',
					'mock-data',
					'Terms',
					queryType,
					dictionary,
					audience,
					language
			  );

	try {
		const mockFile = path.join(mockDir, `${query}.json`);
		await fs.promises
			.access(mockFile)
			.then(() => {
				res.sendFile(mockFile);
			})
			.catch((err) => {
				// const mockResponse = mockNoResultsAPI( err );
				res.send(mockNoResultsAPI(err));
			});
	} catch (err) {
		console.error(err);
		res.send(mockNoResultsAPI(err));
	}
};

/* getTermTotalCount - Middleware for getting a Term total count.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */

const getTermTotalCount = async (req, res, next) => {
	const { audience, dictionary, language } = req.params;
	const mockDir = path.join(
		__dirname,
		'..',
		'mock-data',
		'Terms',
		'count',
		dictionary,
		audience,
		language
	);

	const mockFile = path.join(mockDir, `count.json`);
	try {
		res.sendFile(mockFile);
	} catch (err) {
		console.error(err);
		res.status(404).end();
	}
};

/**
 * Middleware for getting a Term object by ID or Pretty Url Name field.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const getTermByIdOrPrettyUrl = async (req, res, next) => {
	const { dictionary, audience, language, id_or_purl } = req.params;

	const searchDir = path.join(
		__dirname,
		'..',
		'mock-data',
		'Terms',
		dictionary,
		audience,
		language
	);

	try {
		const mocks = (await readDirAsync(searchDir)).reduce(
			(filemap, mockfile) => {
				const [term_id, purl] = mockfile.replace('.json', '').split('__');
				filemap[term_id] = path.join(searchDir, mockfile);
				if (purl && purl !== 'null') {
					// Some terms may not have a prettyurl name
					// I probably would name the file 12344__null.json
					filemap[purl] = path.join(searchDir, mockfile);
				}
				return filemap;
			},
			{}
		);

		if (mocks[id_or_purl]) {
			res.sendFile(mocks[id_or_purl]);
		} else {
			res.status(404).end();
		}
	} catch (err) {
		console.error(err);
		res.status(404).end();
	}
};

const mockNoResultsAPI = (err) => {
	const resObject = {
		meta: {
			totalResults: 0,
			from: 0,
		},
		results: [],
		links: null,
	};
	if (err && err.code === 'ENOENT') {
		console.error(err);
		console.log(
			'Create file with payload in path specified above to return a response with results. ' +
				'\n' +
				'Returning response with no results for request.',
			resObject
		);
	}
	return resObject;
};

/**
 * Middleware setup for "setupProxy"
 * @param {Express.Application} app
 */
const middleware = (app) => {
	app.use(
		'/api/Autosuggest/:dictionary/:audience/:language/:query',
		getAutoSuggestResults
	);

	app.use(
		'/api/Terms/:dictionary/:audience/:language/:id_or_purl',
		getTermByIdOrPrettyUrl
	);

	app.use(
		'/api/Terms/:queryType/:dictionary/:audience/:language/:query',
		getResultsByQueryType
	);

	app.use(
		'/api/Terms/count/:dictionary/:audience/:language',
		getTermTotalCount
	);

	app.use('/api/*', (req, res, next) => {
		console.error('Api path not implemented');
		res.status(404).end();
	});
};

module.exports = middleware;
