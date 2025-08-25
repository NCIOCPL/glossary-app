import { render, screen } from '@testing-library/react';
import React from 'react';
import { useLocation, useParams } from 'react-router';
import { ClientContextProvider } from 'react-fetching-library';

import Definition from '../Definition';
import { useStateValue } from '../../../store/store.jsx';
import { setAudience, setDictionaryName, setLanguage } from '../../../services/api/endpoints';
import { MockAnalyticsProvider } from '../../../tracking';
import ErrorBoundary from '../../ErrorBoundary';

jest.mock('react-router');
jest.mock('../../../store/store.jsx');

const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
const fixturePath = `/Terms/${dictionaryName}/Patient`;
const metastaticFileES = '44058__metastasico.json';

const getClient = (definition) => ({
	query: async () => ({
		error: false,
		status: 200,
		payload: definition,
	}),
});

describe('Definition component with Spanish', () => {
	const idOrPurl = 'metastásico';
	const language = 'es';

	const setupTest = () => {
		// Create mock lang node
		const mockToggleElement = document.createElement('div');
		mockToggleElement.id = 'LangList1';
		mockToggleElement.innerHTML = '<a href="/" data-testid="mockLangToggle">Language</a>';
		document.body.appendChild(mockToggleElement);

		const definition = getFixture(`${fixturePath}/${language}/${metastaticFileES}`);
		const client = getClient(definition);

		useLocation.mockReturnValue({ location: {} });
		useParams.mockReturnValue({ idOrName: idOrPurl });
		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: '/cancer-terms',
				languageToggleSelector: '#LangList1 a',
				appId: 'mockAppId',
				basePath: '/',
				canonicalHost: 'https://example.org',
				dictionaryName,
				dictionaryTitle,
				language,
			},
		]);

		return render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);
	};

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('Match Term Name for Definition', async () => {
		setupTest();
		expect(await screen.findByText(idOrPurl)).toBeInTheDocument();
	});

	it('Updates language toggle with link to english analog', async () => {
		setupTest();
		expect(await screen.findByTestId('mockLangToggle')).toHaveAttribute('href', '/cancer-terms/def/metastatic');
	});
	describe('Display "Page Not Found" for pretty URLs without definitions', () => {
		beforeEach(() => {
			jest.spyOn(console, 'error').mockImplementation(() => {});
		});

		afterEach(() => {
			console.error.mockRestore();
		});

		it('should display page not found for pretty URL that does not exist', async () => {
			const idOrName = 'pollo';
			const windowLocation = { pathname: `/def/${idOrName}` };

			setDictionaryName(dictionaryName);
			setAudience('Patient');
			setLanguage(language);
			Object.defineProperty(window, 'location', {
				value: windowLocation,
				writable: true,
			});

			useLocation.mockReturnValue({ location: {} });
			useParams.mockReturnValue({ idOrName });
			useStateValue.mockReturnValue([
				{
					altLanguageDictionaryBasePath: '/cancer-terms',
					languageToggleSelector: '#LangList1 a',
					appId: 'mockAppId',
					canonicalHost: 'https://example.org',
					basePath: '/',
					dictionaryEndpoint: '/',
					dictionaryName,
					dictionaryTitle: 'Diccionario de cáncer',
					language,
				},
			]);

			const client = {
				query: async () => ({
					error: true,
					status: 404,
					loading: false,
					payload: {
						Message: "No match for dictionary 'Cancer.gov', audience 'Patient', language 'es', pretty URL name 'pollo'.",
					},
				}),
			};

			render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<ErrorBoundary>
							<Definition />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
			expect(await screen.findByText('No se encontró la página')).toBeInTheDocument();
		});
	});
});
