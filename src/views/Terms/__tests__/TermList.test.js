import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { testIds } from '../../../constants';
import { TermList } from '../index';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store');

let client;
let location;
let termList;
let wrapper;

const query = 'A';
const queryFile = `${query}.json`;
const fixturePath = `/Terms/expand/Cancer.gov/Patient`;

// Used for search termlists
const ComponentWithLocation = ({ RenderComponent, query, type = 'search' }) => {
	location = useLocation();
	return <RenderComponent query={query} type={type} />;
};
ComponentWithLocation.propTypes = {
	RenderComponent: PropTypes.func,
	query: PropTypes.string,
	type: PropTypes.string,
};

describe('TermList component rendered with English', () => {
	const language = 'en';
	const searchBoxTitle = "Search NCI's Dictionary of Cancer Terms";

	termList = getFixture(`${fixturePath}/${language}/${queryFile}`);
	const termListCount = termList.meta.totalResults;

	client = {
		query: async () => ({
			error: false,
			status: 200,
			payload: termList,
		}),
	};

	beforeEach(async () => {
		const dictionaryName = 'Cancer.gov';
		const dictionaryTitle = 'NCI Dictionary of Cancer Terms';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
				dictionaryName,
				dictionaryTitle,
				language,
				searchBoxTitle,
				canonicalHost: 'https://cancer.gov',
			},
		]);

		await act(async () => {
			wrapper = render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<ClientContextProvider client={client}>
							<TermList query={query} />
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});
	});

	afterEach(() => {
		cleanup();
	});
	test(`"${termListCount} results found for: ${query}" should be present `, () => {
		const { getByText } = wrapper;
		expect(
			getByText(`${termListCount} results found for: ${query}`)
		).toBeInTheDocument();
	});

	describe(`Tests using "${query}" as query parameter for term`, () => {
		beforeEach(cleanup);
		afterEach(cleanup);
		const query = '5';

		test(`NoMatchingResults component is rendered for query "${query}" without results`, async () => {
			const client = {
				query: async () => ({
					error: false,
					status: 200,
					payload: {
						meta: {
							totalResults: 0,
							from: 0,
						},
						results: [],
						links: null,
					},
				}),
			};
			const dictionaryName = 'Cancer.gov';
			const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
			useStateValue.mockReturnValue([
				{
					appId: 'mockAppId',
					basePath: '/',
					dictionaryName,
					dictionaryTitle,
					language,
					searchBoxTitle,
					canonicalHost: 'https://cancer.gov',
				},
			]);

			await act(async () => {
				wrapper = render(
					<MockAnalyticsProvider>
						<MemoryRouter initialEntries={['/']}>
							<ClientContextProvider client={client}>
								<TermList query={query} />
							</ClientContextProvider>
						</MemoryRouter>
					</MockAnalyticsProvider>
				);
			});
			const { queryByTestId } = wrapper;
			expect(queryByTestId(testIds.NO_MATCHING_RESULTS)).toBeTruthy();
		});

		test('should check scroll position is at top of page', async () => {
			jest.spyOn(window, 'scrollTo');

			await act(async () => {
				render(
					<MockAnalyticsProvider>
						<MemoryRouter initialEntries={['/']}>
							<ClientContextProvider client={client}>
								<TermList query={query} />
							</ClientContextProvider>
						</MemoryRouter>
					</MockAnalyticsProvider>
				);
			});
			expect(window.scrollTo).toHaveBeenCalledTimes(1);
			expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
		});
	});

	describe(`Tests using lung cancer as query parameter for term`, () => {
		beforeEach(cleanup);
		afterEach(cleanup);
		const query = 'lung cancer';

		test(`Redirected to definition page with pretty URL name for query "${query}" with one term result`, async () => {
			const client = {
				query: async () => ({
					error: false,
					status: 200,
					payload: {
						meta: {
							totalResults: 1,
							from: 0,
						},
						results: [
							{
								termId: 445043,
								language: 'en',
								dictionary: 'Cancer.gov',
								audience: 'Patient',
								termName: 'lung cancer',
								firstLetter: 'l',
								prettyUrlName: 'lung-cancer',
								pronunciation: {
									key: '(lung KAN-ser)',
									audio:
										'https://nci-media.cancer.gov/pdq/media/audio/714622.mp3',
								},
								definition: {
									html:
										'Cancer that forms in tissues of the lung, usually in the cells lining air passages. The two main types are small cell lung cancer and non-small cell lung cancer. These types are diagnosed based on how the cells look under a microscope.',
									text:
										'Cancer that forms in tissues of the lung, usually in the cells lining air passages. The two main types are small cell lung cancer and non-small cell lung cancer. These types are diagnosed based on how the cells look under a microscope.',
								},
								otherLanguages: [],
								relatedResources: [],
								media: [],
							},
						],
						links: null,
					},
					loading: false,
				}),
			};

			const expectedLocationObject = {
				pathname: '/def/lung-cancer',
				search: '',
				hash: '',
				state: null,
				key: expect.any(String),
			};

			await act(async () => {
				wrapper = await render(
					<MockAnalyticsProvider>
						<MemoryRouter initialEntries={['/']}>
							<ClientContextProvider client={client}>
								<ComponentWithLocation RenderComponent={TermList} />
							</ClientContextProvider>
						</MemoryRouter>
					</MockAnalyticsProvider>
				);
			});
			expect(location).toMatchObject(expectedLocationObject);
		});

		test(`Redirected to definition page with term ID for query "${query}" with one term result`, async () => {
			const client = {
				query: async () => ({
					error: false,
					status: 200,
					payload: {
						meta: {
							totalResults: 1,
							from: 0,
						},
						results: [
							{
								termId: 445043,
								language: 'en',
								dictionary: 'Cancer.gov',
								audience: 'Patient',
								termName: 'lung cancer',
								firstLetter: 'l',
								prettyUrlName: null,
								pronunciation: {
									key: '(lung KAN-ser)',
									audio:
										'https://nci-media.cancer.gov/pdq/media/audio/714622.mp3',
								},
								definition: {
									html:
										'Cancer that forms in tissues of the lung, usually in the cells lining air passages. The two main types are small cell lung cancer and non-small cell lung cancer. These types are diagnosed based on how the cells look under a microscope.',
									text:
										'Cancer that forms in tissues of the lung, usually in the cells lining air passages. The two main types are small cell lung cancer and non-small cell lung cancer. These types are diagnosed based on how the cells look under a microscope.',
								},
								otherLanguages: [],
								relatedResources: [],
								media: [],
							},
						],
						links: null,
					},
					loading: false,
				}),
			};

			const expectedLocationObject = {
				pathname: '/def/445043',
				search: '',
				hash: '',
				state: null,
				key: expect.any(String),
			};

			await act(async () => {
				wrapper = await render(
					<MockAnalyticsProvider>
						<MemoryRouter initialEntries={['/']}>
							<ClientContextProvider client={client}>
								<ComponentWithLocation RenderComponent={TermList} />
							</ClientContextProvider>
						</MemoryRouter>
					</MockAnalyticsProvider>
				);
			});
			expect(location).toMatchObject(expectedLocationObject);
		});
	});
});
