import { render, screen } from '@testing-library/react';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';

import UseCustomQuerySample from '../samples/UseCustomQuery';
import { useStateValue } from '../../store/store';
import MockAnalyticsProvider from '../../tracking/mock-analytics-provider';
import { i18n } from '../../utils';
import ErrorBoundary from '../../views/ErrorBoundary';
import { setAudience, setDictionaryName, setLanguage } from '../../services/api/endpoints';

jest.mock('../../store/store');

describe('UseCustomQuery component', () => {
	beforeEach(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		console.error.mockRestore();
	});

	const renderComponent = (client, language, dictionaryTitle) => {
		const dictionaryName = 'Cancer.gov';
		setDictionaryName(dictionaryName);
		setAudience('Patient');
		setLanguage(language);

		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: language === 'en' ? '/diccionario' : '/cancer-terms',
				languageToggleSelector: '#LangList1 a',
				appId: 'mockAppId',
				canonicalHost: 'https://example.org',
				basePath: '/',
				dictionaryEndpoint: '/',
				dictionaryName,
				dictionaryTitle,
				language,
			},
		]);

		render(
			<MockAnalyticsProvider>
				<ClientContextProvider client={client}>
					<ErrorBoundary>
						<UseCustomQuerySample />
					</ErrorBoundary>
				</ClientContextProvider>
			</MockAnalyticsProvider>
		);
	};

	it('useCustomQuery example should throw error - English message', async () => {
		const language = 'en';
		const client = {
			query: async () => ({
				error: true,
				status: 500,
				payload: {},
			}),
		};

		renderComponent(client, language, 'NCI Dictionary of Cancer Terms');

		expect(await screen.findByText(i18n.errorPageText[language])).toBeInTheDocument();
	});

	it('useCustomQuery example should throw error - Spanish message', async () => {
		const language = 'es';
		const client = {
			query: async () => ({
				error: true,
				status: 500,
				payload: {},
			}),
		};

		renderComponent(client, language, 'Diccionario de cáncer');

		expect(await screen.findByText(i18n.errorPageText[language])).toBeInTheDocument();
	});

	it('useCustomQuery example should display content and not throw error', async () => {
		const contentMessage = 'Successful API call with content';
		const language = 'en';
		const client = {
			query: async () => ({
				error: false,
				status: 200,
				payload: { contentMessage },
			}),
		};

		renderComponent(client, language, 'NCI Dictionary of Cancer Terms');

		expect(await screen.findByText(contentMessage)).toBeInTheDocument();
	});
});
