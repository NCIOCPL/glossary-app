import { act, render } from '@testing-library/react';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';

import UseCustomQuerySample from '../samples/UseCustomQuery';
import { useStateValue } from '../../store/store';
import MockAnalyticsProvider from '../../tracking/mock-analytics-provider'
import { i18n } from '../../utils';
import ErrorBoundary from '../../views/ErrorBoundary';
import { setAudience, setDictionaryName, setLanguage } from '../../services/api/endpoints'

jest.mock('../../store/store');

let client;
let wrapper;
describe('', () => {
	beforeEach(() => {
		jest.spyOn(console, 'error');
		console.error.mockImplementation(() => {});
	});

	afterEach(() => {
		console.error.mockRestore();
	});

	test('useCustomQuery example should throw error - English message', async () => {
		const dictionaryName = 'Cancer.gov';
		const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
		const language = 'en';
		setDictionaryName(dictionaryName);
		setAudience('Patient');
		setLanguage(language);

		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: '/diccionario',
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
		client = {
			query: async () => ({
				error: true,
				status: 500,
				payload: {},
			}),
		};
		await act(async () => {
			wrapper = render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<ErrorBoundary>
							<UseCustomQuerySample />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});
		const { getByText } = wrapper;
		expect(getByText(i18n.errorPageText[language])).toBeInTheDocument();
	});

	test('useCustomQuery example should throw error - Spanish message', async () => {
		const dictionaryName = 'Cancer.gov';
		const dictionaryTitle = 'Diccionario de cáncer';
		const language = 'es';
		setDictionaryName(dictionaryName);
		setAudience('Patient');
		setLanguage(language);

		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: '/cancer-terms',
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
		client = {
			query: async () => ({
				error: true,
				status: 500,
				payload: {},
			}),
		};
		await act(async () => {
			wrapper = render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<ErrorBoundary>
							<UseCustomQuerySample />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});
		const { getByText } = wrapper;
		expect(getByText(i18n.errorPageText[language])).toBeInTheDocument();
	});

	test('useCustomQuery example should display content and not throw error', async () => {
		const contentMessage = 'Successful API call with content';
		const dictionaryName = 'Cancer.gov';
		const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
		const language = 'en';
		setDictionaryName(dictionaryName);
		setAudience('Patient');
		setLanguage(language);

		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: '/diccionario',
				languageToggleSelector: '#LangList1 a',
				appId: 'mockAppId',
				canonicalHost: 'https://example.org',
				basePath: '/',
				dictionaryEndpoint: '/',
				dictionaryName,
				dictionaryTitle,
				language,
			}
		]);

		client = {
			query: async () => ({
				error: false,
				status: 200,
				payload: { contentMessage },
			}),
		};
		await act(async () => {
			wrapper = render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<ErrorBoundary>
							<UseCustomQuerySample />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});
		const { getByText } = wrapper;
		expect(getByText(contentMessage)).toBeInTheDocument();
	});
});
