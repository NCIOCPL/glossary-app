/* eslint-disable testing-library/no-node-access */
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter } from 'react-router';
import { MockAnalyticsProvider } from '../../../tracking';

import { testIds } from '../../../constants';
import Home from '../Home';
import { useStateValue } from '../../../store/store.jsx';
import { i18n } from '../../../utils';

jest.mock('../../../store/store.jsx');

const dispatch = jest.fn();
const dictionaryEndpoint = 'http://localhost:3000/api';
const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
const dictionaryIntroText = `
  <p>The NCI Dictionary of Cancer Terms features <strong>{{term_count}}</strong> terms related to cancer and medicine.</p>
  <p>We offer a widget that you can add to your website to let users look up cancer-related terms. <a href="/syndication/widgets">Get NCI's Dictionary of Cancer Terms Widget</a></p>
`;

const language = 'en';

const expandChar = 'A';
const queryFile = `${expandChar}.json`;
const fixturePath = `/Terms/expand/Cancer.gov/Patient`;
const termList = getFixture(`${fixturePath}/${language}/${queryFile}`);
const termListCount = termList.meta.totalResults;

const client = {
	query: async () => ({
		error: false,
		status: 200,
		payload: termList,
	}),
};

describe('Home component(English)', () => {
	beforeEach(() => {
		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: '/diccionario',
				languageToggleSelector: '#LangList1 a',
				appId: 'mockAppId',
				basePath: '/',
				dictionaryEndpoint,
				dictionaryIntroText,
				dictionaryName,
				dictionaryTitle,
				language,
				canonicalHost: 'https://cancer.gov',
			},
			dispatch,
		]);

		const mockToggleElement = document.createElement('div');
		mockToggleElement.id = 'LangList1';
		mockToggleElement.innerHTML = '<a href="/" data-testid="mockLangToggle">Language</a>';
		document.body.appendChild(mockToggleElement);
	});

	afterEach(() => {
		document.body.removeChild(document.getElementById('LangList1'));
	});

	it('Match dictionary title name for Home', async () => {
		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/']}>
					<ClientContextProvider client={client}>
						<Home />
					</ClientContextProvider>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		await waitFor(() => {
			expect(screen.getByText(dictionaryTitle)).toBeInTheDocument();
		});
	});

	it('Results for expand char "A" are displayed on home page by default', async () => {
		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/']}>
					<ClientContextProvider client={client}>
						<Home />
					</ClientContextProvider>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		await waitFor(() => {
			expect(screen.getByText(`${termListCount} results found for: ${expandChar}`)).toBeInTheDocument();
		});

		// Since we have eslint-disable testing-library/no-node-access, we can safely use querySelector
		const dictionaryList = document.querySelector('.dictionary-list');
		const dtElements = dictionaryList.querySelectorAll('dt');
		expect(dtElements).toHaveLength(termListCount);
	});

	it('Updates language toggle with link to spanish analog', async () => {
		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/']}>
					<ClientContextProvider client={client}>
						<Home />
					</ClientContextProvider>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		await waitFor(() => {
			expect(screen.getByTestId('mockLangToggle')).toHaveAttribute('href', '/diccionario');
		});
	});

	describe('Load Home component using expand path with no params', () => {
		it('NoMatchingResults component is rendered for expand path with no params', async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/expand']}>
						<ClientContextProvider client={client}>
							<Home />
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
			await waitFor(() => {
				expect(screen.getByTestId(testIds.NO_MATCHING_RESULTS)).toHaveTextContent(i18n.noMatchingExpand[language]);
			});
		});
	});

	describe('Load Home component using search path with no params', () => {
		it('NoMatchingResults component is rendered with no matching search text for search path with no params', async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/search']}>
						<ClientContextProvider client={client}>
							<Home />
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
			await waitFor(() => {
				expect(screen.getByTestId(testIds.NO_MATCHING_RESULTS)).toHaveTextContent(i18n.noMatchingTextSearch[language]);
			});
		});
	});
});
