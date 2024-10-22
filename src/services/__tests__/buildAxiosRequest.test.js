import axios from 'axios';
import nock from 'nock';

import { buildAxiosRequest } from '../api/buildAxiosRequest';

describe('buildAxiosRequest', () => {
	const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
	const host = 'localhost';
	const port = '3000';
	const baseURL = `${protocol}://${host}:${port}/api`;
	let options = {
		headers: { 'content-type': 'application/json; charset=utf-8' },
		signal: {
			onabort: jest.fn(),
		},
	};
	const axiosInstance = axios.create({
		timeout: 10000,
	});

	beforeAll(() => {
		nock.disableNetConnect();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	it('200 response for a valid axios request', async () => {
		const endpoint = `/Terms/expand/Cancer.gov/Patient/en/A`;
		const query = '?size=10000';
		const init = `${baseURL}${endpoint}${query}`;
		const scope = nock(baseURL)
			.get(`${endpoint}${query}`)
			.reply(200, getFixture(`${endpoint}.json`));

		const actual = await buildAxiosRequest(axiosInstance)(init, options);
		expect(actual.status).toBe(200);
		scope.done();
	});

	it('200 response for a valid axios request with no headers', async () => {
		const endpoint = `/Terms/expand/Cancer.gov/Patient/en/A`;
		const query = '?size=10000';
		const init = `${baseURL}${endpoint}${query}`;
		delete options.headers;
		const scope = nock(baseURL)
			.get(`${endpoint}${query}`)
			.reply(200, getFixture(`${endpoint}.json`));

		const actual = await buildAxiosRequest(axiosInstance)(init, options);
		expect(actual.status).toBe(200);
		scope.done();
	});

	it('200 response on an expand axios request for a character with no results', async () => {
		const endpoint = `/Terms/expand/Cancer.gov/Patient/en/undefined`;
		const query = '?size=10000';
		const init = `${baseURL}${endpoint}${query}`;
		const expectedResponseBody = {
			meta: {
				totalResults: 0,
				from: 0,
			},
			results: [],
			links: null,
		};
		const scope = nock(baseURL).get(`${endpoint}${query}`).reply(200, expectedResponseBody);

		const actual = await buildAxiosRequest(axiosInstance)(init, options);
		expect(actual.status).toBe(200);
		expect(JSON.parse(actual._bodyText)).toMatchObject(expectedResponseBody);
		scope.done();
	});

	it('404 response for an invalid axios request', async () => {
		const endpoint = `/Terms/undefined/`;
		const init = `${baseURL}${endpoint}`;
		const scope = nock(baseURL).get(endpoint).reply(404);

		const actual = await buildAxiosRequest(axiosInstance)(init, options);
		expect(actual.status).toBe(404);
		scope.done();
	});
});
