import { render, screen, waitFor } from '@testing-library/react';
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

	beforeEach(() => {
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
	});

	it(`"${termListCount} results found for: ${query}" should be present`, async () => {
		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/']}>
					<ClientContextProvider client={client}>
						<TermList query={query} />
					</ClientContextProvider>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		await waitFor(() => {
			expect(screen.getByText(`${termListCount} results found for: ${query}`)).toBeInTheDocument();
		});
	});

	describe(`Tests using "5" as query parameter for term`, () => {
		const query = '5';

		it(`NoMatchingResults component is rendered for query "${query}" without results`, async () => {
			const clientWithoutResults = {
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

			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<ClientContextProvider client={clientWithoutResults}>
							<TermList query={query} />
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
			await waitFor(() => {
				expect(screen.getByTestId(testIds.NO_MATCHING_RESULTS)).toBeInTheDocument();
			});
		});

		it('should check scroll position is at top of page', async () => {
			const scrollToSpy = jest.spyOn(window, 'scrollTo');

			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<ClientContextProvider client={client}>
							<TermList query={query} />
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);

			await waitFor(() => {
				expect(scrollToSpy).toHaveBeenCalledTimes(1);
			});
			expect(scrollToSpy).toHaveBeenLastCalledWith(0, 0);

			scrollToSpy.mockRestore();
		});
	});

	describe(`Tests using lung cancer as query parameter for term`, () => {
		const query = 'lung cancer';

		it(`Redirected to definition page with pretty URL name for query "${query}" with one term result`, async () => {
			const clientWithOneResult = {
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
									audio: 'https://nci-media.cancer.gov/pdq/media/audio/714622.mp3',
								},
								definition: {
									html: 'Cancer that forms in tissues of the lung, usually in the cells lining air passages. The two main types are small cell lung cancer and non-small cell lung cancer. These types are diagnosed based on how the cells look under a microscope.',
									text: 'Cancer that forms in tissues of the lung, usually in the cells lining air passages. The two main types are small cell lung cancer and non-small cell lung cancer. These types are diagnosed based on how the cells look under a microscope.',
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

			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<ClientContextProvider client={clientWithOneResult}>
							<ComponentWithLocation
								RenderComponent={(props) => {
									location = useLocation();
									return <TermList {...props} />;
								}}
								query={query}
							/>
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);

			await waitFor(() => {
				expect(location).toMatchObject({
					pathname: '/def/lung-cancer',
					search: '',
					hash: '',
					state: null,
					key: expect.any(String),
				});
			});
		});

		it(`Redirected to definition page with term ID for query "${query}" with one term result without pretty URL`, async () => {
			const clientWithOneResultNoUrl = {
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
									audio: 'https://nci-media.cancer.gov/pdq/media/audio/714622.mp3',
								},
								definition: {
									html: 'Cancer that forms in tissues of the lung, usually in the cells lining air passages. The two main types are small cell lung cancer and non-small cell lung cancer. These types are diagnosed based on how the cells look under a microscope.',
									text: 'Cancer that forms in tissues of the lung, usually in the cells lining air passages. The two main types are small cell lung cancer and non-small cell lung cancer. These types are diagnosed based on how the cells look under a microscope.',
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

			let location;
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<ClientContextProvider client={clientWithOneResultNoUrl}>
							<ComponentWithLocation
								RenderComponent={(props) => {
									location = useLocation();
									return <TermList {...props} />;
								}}
								query={query}
							/>
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
			await waitFor(() => {
				expect(location).toMatchObject({
					pathname: '/def/445043',
					search: '',
					hash: '',
					state: null,
					key: expect.any(String),
				});
			});
		});
	});
});
