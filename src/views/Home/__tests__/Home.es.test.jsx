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
const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
const dictionaryIntroText = '<p>El diccionario de cáncer del NCI contiene <strong>{{term_count}}</strong> términos relacionados con el cáncer y la medicina.</p>' + '<p>Ofrecemos un widget que usted puede añadir a su sitio web para que sus usuarios puedan buscar términos de cáncer. <a href="/espanol/sindicacion/widgets">Obtenga el widget de términos de cáncer del Diccionario del NCI</a>.</p>';
const language = 'es';

const expandChar = 'A';
const queryFile = `${expandChar}.json`;
const fixturePath = `/Terms/expand/Cancer.gov/Patient`;
const termList = getFixture(`${fixturePath}/${language}/${queryFile}`);

const client = {
	query: async () => ({
		error: false,
		status: 200,
		payload: termList,
	}),
};

const MockLangToggle = () => (
	<div id="LangList1">
		<a href="/" data-testid="mockLangToggle">
			Language
		</a>
	</div>
);

const renderWithProviders = (ui, { route = '/' } = {}) => {
	return render(
		<MockAnalyticsProvider>
			<MemoryRouter initialEntries={[route]}>
				<ClientContextProvider client={client}>
					<MockLangToggle />
					{ui}
				</ClientContextProvider>
			</MemoryRouter>
		</MockAnalyticsProvider>
	);
};

describe('Home component(Spanish)', () => {
	beforeEach(() => {
		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: '/cancer-terms',
				languageToggleSelector: '#LangList1 a',
				appId: 'mockAppId',
				basePath: '/',
				dictionaryIntroText,
				dictionaryName,
				dictionaryTitle,
				language: 'es',
				canonicalHost: 'https://cancer.gov',
			},
			dispatch,
		]);
	});

	it('Updates language toggle with link to english analog', async () => {
		renderWithProviders(<Home />);
		await waitFor(() => {
			expect(screen.getByTestId('mockLangToggle')).toHaveAttribute('href', '/cancer-terms');
		});
	});
});

describe('Load Spanish Home component using expand path with no params', () => {
	it('NoMatchingResults component is rendered for ampliar path with no params', async () => {
		renderWithProviders(<Home />, { route: '/ampliar' });
		await waitFor(() => {
			expect(screen.getByTestId(testIds.NO_MATCHING_RESULTS)).toHaveTextContent(i18n.noMatchingExpand[language]);
		});
	});
});

describe('Load Spanish Home component using search path with no params', () => {
	it('NoMatchingResults component is rendered with no matching search text for buscar path with no params', async () => {
		renderWithProviders(<Home />, { route: '/buscar' });
		await waitFor(() => {
			expect(screen.getByTestId(testIds.NO_MATCHING_RESULTS)).toHaveTextContent(i18n.noMatchingTextSearch[language]);
		});
	});
});
