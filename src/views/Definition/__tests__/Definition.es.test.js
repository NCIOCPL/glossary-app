import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { useLocation, useParams } from 'react-router';
import { ClientContextProvider } from 'react-fetching-library';

import Definition from '../Definition';
import { useStateValue } from '../../../store/store.js';
import fixtures from '../../../utils/fixtures';
import { setAudience, setDictionaryName, setLanguage } from '../../../services/api/endpoints';
import { MockAnalyticsProvider } from '../../../tracking';
import ErrorBoundary from '../../ErrorBoundary';

jest.mock('react-router');
jest.mock('../../../store/store.js');

let client;
let definition;
let wrapper;

const { getFixture } = fixtures;
const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
const fixturePath = `/Terms/${dictionaryName}/Patient`;
const metastaticFileES = '44058__metastasico.json';

const getClient = (definition) => {
	return {
		query: async () => ({
			error: false,
			status: 200,
			payload: definition,
		}),
	};
};

/*
 * Spanish Test
 * */
describe('Definition component with Spanish', () => {
	const idOrPurl = 'metastásico';
	const language = 'es';

	//create mock lang node
	const mockToggleElement = document.createElement('div');
	mockToggleElement.id = 'LangList1';
	mockToggleElement.innerHTML =
		'<a href="/" data-testid="mockLangToggle">Language</a>';
	document.body.appendChild(mockToggleElement);

	beforeEach(async () => {
		definition = getFixture(`${fixturePath}/${language}/${metastaticFileES}`);
		client = getClient(definition);

		useLocation.mockReturnValue({
			location: {},
		});
		useParams.mockReturnValue({
			idOrName: idOrPurl,
		});
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

		await act(async () => {
			wrapper = render(
				<ClientContextProvider client={client}>
					<Definition />
				</ClientContextProvider>
			);
		});
	});

	afterEach(() => {
		cleanup();
	});

	test('Match Term Name for Definition', () => {
		const { getByText } = wrapper;
		expect(getByText(idOrPurl)).toBeTruthy();
	});

	test('Updates language toggle with link to english analog', () => {
		const { getByTestId } = wrapper;
		expect(getByTestId('mockLangToggle')).toHaveAttribute(
			'href',
			'/cancer-terms/def/metastatic'
		);
	});

	describe( 'Display "Page Not Found" for pretty URLs without definitions',() => {

		beforeEach( () => {
			cleanup();
			// Since this test throws an error which gets logged to the console
			// Spy on console error and swap with mock implementation to prevent
			// logging since it's an expected effect.
			jest.spyOn(console, 'error');
			console.error.mockImplementation(() => {});
		});
		afterEach( () => {
			// Restore console error log in cleanup
			console.error.mockRestore();
			cleanup();
		});

		test('should display page not found for pretty URL that does not exist', async () => {
			const dictionaryName = 'Cancer.gov';
			const dictionaryTitle = 'Diccionario de cáncer';
			const idOrName = 'pollo';
			const language = 'es';
			const windowLocation = {
				pathname: `/def/${idOrName}`,
			};
			setDictionaryName(dictionaryName);
			setAudience('Patient');
			setLanguage(language);
			Object.defineProperty(window, 'location', { value: windowLocation, writable: true });

			useLocation.mockReturnValue({
				location: {},
			});
			useParams.mockReturnValue({
				idOrName,
			});
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

			await act(async () => {
				render(
					<MockAnalyticsProvider>
						<ClientContextProvider client={client}>
							<ErrorBoundary>
								<Definition />
							</ErrorBoundary>
						</ClientContextProvider>
					</MockAnalyticsProvider>
				);
			});

			expect(screen.getByText("No se encontró la página")).toBeInTheDocument();
		});

	});

});
