import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ClientContextProvider } from 'react-fetching-library';

import { testIds } from '../../../constants';
import Definition from '../Definition';
import ErrorBoundary from '../../ErrorBoundary';
import {
	setAudience,
	setDictionaryName,
	setLanguage,
} from '../../../services/api/endpoints';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('react-router');
jest.mock('../../../store/store.js');

let client;
let definition;
let wrapper;

const fixturePath = `/Terms/Cancer.gov/Patient`;
const hpvFile = '44386__hpv.json';
const metastaticFile = '44058__metastatic.json';

const unsupportedMediaFile = {
	termId: 1337,
	language: 'en',
	dictionary: 'Cancer.gov',
	audience: 'Patient',
	termName: 'Unsupported Media Test',
	firstLetter: 'h',
	prettyUrlName: 'hpv',
	pronunciation: null,
	definition: {
		html: 'A type of virus that can cause abnormal tissue growth (for example, warts) and other changes to cells. Infection for a long time with certain types of HPV can cause cervical cancer. HPV may also play a role in some other types of cancer, such as anal, vaginal, vulvar, penile, and oropharyngeal cancers.  Also called human papillomavirus.',
		text: 'A type of virus that can cause abnormal tissue growth (for example, warts) and other changes to cells. Infection for a long time with certain types of HPV can cause cervical cancer. HPV may also play a role in some other types of cancer, such as anal, vaginal, vulvar, penile, and oropharyngeal cancers.  Also called human papillomavirus.',
	},
	otherLanguages: [],
	relatedResources: [],
	media: [
		{
			Type: 'Zip File',
			Ref: 'CDR0000764135',
			Alt: 'Metastasis; drawing shows primary cancer that has spread from the colon to other parts of the body (the liver and the lung). An inset shows cancer cells spreading from the primary cancer, through the blood and lymph system, to another part of the body where a metastatic tumor has formed.',
			Caption:
				'Metastasis. In metastasis, cancer cells break away from where they first formed (primary cancer), travel through the blood or lymph system, and form new tumors (metastatic tumors) in other parts of the body. The metastatic tumor is the same type of cancer as the primary tumor. ',
		},
	],
};

describe('Definition component with English', () => {
	const idOrPurl = 'metastatic';
	const language = 'en';
	const searchBoxTitle = "Search NCI's Dictionary of Cancer Terms";

	definition = getFixture(`${fixturePath}/${language}/${metastaticFile}`);

	client = {
		query: async () => ({
			error: false,
			status: 200,
			payload: definition,
		}),
	};

	//create mock lang node
	const mockToggleElement = document.createElement('div');
	mockToggleElement.id = 'LangList1';
	mockToggleElement.innerHTML =
		'<a href="/" data-testid="mockLangToggle">Language</a>';
	document.body.appendChild(mockToggleElement);

	beforeEach(async () => {
		const dictionaryName = 'Cancer.gov';
		const dictionaryTitle = 'NCI Dictionary of Cancer Terms';

		useLocation.mockReturnValue({
			location: {},
		});
		useParams.mockReturnValue({
			idOrName: idOrPurl,
		});
		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: '/diccionario',
				languageToggleSelector: '#LangList1 a',
				appId: 'mockAppId',
				canonicalHost: 'https://example.org',
				basePath: '/',
				dictionaryName,
				dictionaryTitle,
				language,
				searchBoxTitle,
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

	test('Updates language toggle with link to spanish analog', () => {
		const { getByTestId } = wrapper;
		expect(getByTestId('mockLangToggle')).toHaveAttribute(
			'href',
			'/diccionario/def/metastasico'
		);
	});

	test('Match Term Name for Definition', () => {
		const { getByText } = wrapper;
		expect(getByText(idOrPurl)).toBeTruthy();
	});

	test('Ensure attribute "data-cdr-id" exists with correct value for Definition component', () => {
		const { getByTestId } = wrapper;
		expect(getByTestId(testIds.TERM_DEF_TITLE)).toHaveAttribute(
			'data-cdr-id',
			`${definition.termId}`
		);
	});

	test('Pronunciation audio and phonetic keys are outputted when provided', () => {
		const { container } = wrapper;
		expect(
			container.querySelector('.pronunciation__audio')
		).toBeInTheDocument();
		expect(container.querySelector('.pronunciation__key')).toBeInTheDocument();
	});

	test('SearchBox component is displayed with title', () => {
		const { getByText } = wrapper;
		expect(getByText(searchBoxTitle)).toBeInTheDocument();
	});

	// Media related tests
	test('Images specified in media are displayed', () => {
		const { container } = wrapper;
		expect(
			container.querySelectorAll('figure.image-left-medium').length
		).toEqual(1);
	});

	test('Video specified in media are displayed', () => {
		const { container } = wrapper;
		expect(container.querySelectorAll('figure.video').length).toEqual(1);
	});

	test('should check scroll position is at top of page', async () => {
		jest.spyOn(window, 'scrollTo');

		await act(async () => {
			wrapper = render(
				<ClientContextProvider client={client}>
					<Definition />
				</ClientContextProvider>
			);
		});
		expect(window.scrollTo).toHaveBeenCalledTimes(1);
		expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
	});

	describe('Unsupported media types', () => {
		beforeEach(cleanup);
		test('do not yield output', async () => {
			definition = unsupportedMediaFile;

			const client = {
				query: async () => ({
					error: false,
					status: 200,
					payload: definition,
				}),
			};

			useParams.mockReturnValue({
				idOrName: unsupportedMediaFile.prettyUrlName,
			});

			await act(async () => {
				wrapper = await render(
					<ClientContextProvider client={client}>
						<Definition />
					</ClientContextProvider>
				);
			});
			const { container } = wrapper;

			expect(container.querySelectorAll('figure.video').length).toEqual(0);
			expect(
				container.querySelectorAll('figure.image-left-medium').length
			).toEqual(0);
		});
	});

	describe('Displaying the information for the term "hpv"', () => {
		const idOrPurl = 'hpv';
		beforeEach(cleanup);
		afterEach(cleanup);
		test('Ensure pronunciation is not displayed for a definition without one', async () => {
			definition = getFixture(`${fixturePath}/${language}/${hpvFile}`);

			const client = {
				query: async () => ({
					error: false,
					status: 200,
					payload: definition,
				}),
			};

			useParams.mockReturnValue({
				idOrName: idOrPurl,
			});

			await act(async () => {
				wrapper = await render(
					<ClientContextProvider client={client}>
						<Definition />
					</ClientContextProvider>
				);
			});
			const { queryByTestId } = wrapper;
			expect(queryByTestId(testIds.TERM_DEF_PRONUNCIATION)).toBeNull();
		});

		test('Pronunciation data should not be present', () => {
			const { container } = wrapper;
			expect(
				container.querySelector('.pronunciation__audio')
			).not.toBeInTheDocument();
			expect(
				container.querySelector('.pronunciation__key')
			).not.toBeInTheDocument();
		});

		test('No media should be displayed when empty', () => {
			const { container } = wrapper;
			expect(container.querySelectorAll('figure.video').length).toEqual(0);
			expect(
				container.querySelectorAll('figure.image-left-medium').length
			).toEqual(0);
		});
	});

	describe('Display "Page Not Found" for pretty URLs without definitions', () => {
		beforeEach(() => {
			cleanup();
			// Since this test throws an error which gets logged to the console
			// Spy on console error and swap with mock implementation to prevent
			// logging since it's an expected effect.
			jest.spyOn(console, 'error');
			console.error.mockImplementation(() => {});
		});
		afterEach(() => {
			// Restore console error log in cleanup
			console.error.mockRestore();
			cleanup();
		});

		test('should display page not found for pretty URL that does not exist', async () => {
			const dictionaryName = 'Cancer.gov';
			const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
			const idOrName = 'chicken';
			const language = 'en';
			const windowLocation = {
				pathname: `/def/${idOrName}`,
			};
			setDictionaryName(dictionaryName);
			setAudience('Patient');
			setLanguage(language);
			Object.defineProperty(window, 'location', {
				value: windowLocation,
				writable: true,
			});

			useLocation.mockReturnValue({
				location: {},
			});
			useParams.mockReturnValue({
				idOrName,
			});
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

			const client = {
				query: async () => ({
					error: true,
					status: 404,
					loading: false,
					payload: {
						Message:
							"No match for dictionary 'Cancer.gov', audience 'Patient', language 'en', pretty URL name 'chicken'.",
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

			expect(screen.getByText('Page Not Found')).toBeInTheDocument();
		});
	});
});
