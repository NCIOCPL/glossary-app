import { render, screen } from '@testing-library/react';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ClientContextProvider } from 'react-fetching-library';

import { testIds } from '../../../constants';
import Definition from '../Definition';
import ErrorBoundary from '../../ErrorBoundary';
import { setAudience, setDictionaryName, setLanguage } from '../../../services/api/endpoints';
import { useStateValue } from '../../../store/store.jsx';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('react-router');
jest.mock('../../../store/store.jsx');

let client;
let definition;

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
			Caption: 'Metastasis. In metastasis, cancer cells break away from where they first formed (primary cancer), travel through the blood or lymph system, and form new tumors (metastatic tumors) in other parts of the body. The metastatic tumor is the same type of cancer as the primary tumor. ',
		},
	],
};

describe('Definition component with English', () => {
	const idOrPurl = 'metastatic';
	const language = 'en';
	const searchBoxTitle = "Search NCI's Dictionary of Cancer Terms";

	beforeAll(() => {
		definition = getFixture(`${fixturePath}/${language}/${metastaticFile}`);

		client = {
			query: async () => ({
				error: false,
				status: 200,
				payload: definition,
			}),
		};

		const mockToggleElement = document.createElement('div');
		mockToggleElement.id = 'LangList1';
		mockToggleElement.innerHTML = '<a href="/" data-testid="mockLangToggle">Language</a>';
		document.body.appendChild(mockToggleElement);
	});

	beforeEach(() => {
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
	});

	it('Updates language toggle with link to spanish analog', async () => {
		render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);

		await expect(screen.findByTestId('mockLangToggle')).resolves.toHaveAttribute('href', '/diccionario/def/metastasico');
	});

	it('Match Term Name for Definition', async () => {
		render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);

		await expect(screen.findByText(idOrPurl)).resolves.toBeInTheDocument();
	});

	it('Ensure attribute "data-cdr-id" exists with correct value for Definition component', async () => {
		render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);

		const termTitle = await screen.findByTestId(testIds.TERM_DEF_TITLE);
		expect(termTitle).toHaveAttribute('data-cdr-id', `${definition.termId}`);
	});

	it('Pronunciation audio and phonetic keys are outputted when provided', async () => {
		render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);

		await expect(screen.findByTestId(testIds.TERM_DEF_TITLE)).resolves.toBeInTheDocument();

		// eslint-disable-next-line testing-library/no-node-access
		expect(document.querySelector('.pronunciation__audio')).toBeInTheDocument();
		// eslint-disable-next-line testing-library/no-node-access
		expect(document.querySelector('.pronunciation__key')).toBeInTheDocument();
	});

	it('SearchBox component is displayed with title', async () => {
		render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);

		await expect(screen.findByRole('heading', { name: searchBoxTitle })).resolves.toBeInTheDocument();
	});

	it('Images specified in media are displayed', async () => {
		render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);

		await expect(screen.findByTestId(testIds.TERM_DEF_TITLE)).resolves.toBeInTheDocument();
		const figures = screen.getAllByRole('figure');
		expect(figures.filter((fig) => fig.classList.contains('image-left-medium'))).toHaveLength(1);
	});

	it('Video specified in media are displayed', async () => {
		render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);

		await expect(screen.findByTestId(testIds.TERM_DEF_TITLE)).resolves.toBeInTheDocument();
		const figures = screen.getAllByRole('figure');
		expect(figures.filter((fig) => fig.classList.contains('video'))).toHaveLength(1);
	});

	it('should check scroll position is at top of page', async () => {
		const scrollToSpy = jest.spyOn(window, 'scrollTo');

		render(
			<ClientContextProvider client={client}>
				<Definition />
			</ClientContextProvider>
		);

		await expect(screen.findByTestId(testIds.TERM_DEF_TITLE)).resolves.toBeInTheDocument();
		expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
		scrollToSpy.mockRestore();
	});

	describe('Unsupported media types', () => {
		it('do not yield output', async () => {
			definition = unsupportedMediaFile;

			const testClient = {
				query: async () => ({
					error: false,
					status: 200,
					payload: definition,
				}),
			};

			useParams.mockReturnValue({
				idOrName: unsupportedMediaFile.prettyUrlName,
			});

			render(
				<ClientContextProvider client={testClient}>
					<Definition />
				</ClientContextProvider>
			);

			await expect(screen.findByTestId(testIds.TERM_DEF_TITLE)).resolves.toBeInTheDocument();
			const figures = screen.queryAllByRole('figure');
			expect(figures.filter((fig) => fig.classList.contains('video'))).toHaveLength(0);
			expect(figures.filter((fig) => fig.classList.contains('image-left-medium'))).toHaveLength(0);
		});
	});

	describe('Displaying the information for the term "hpv"', () => {
		it('Ensure pronunciation is not displayed for a definition without one', async () => {
			definition = getFixture(`${fixturePath}/${language}/${hpvFile}`);

			const testClient = {
				query: async () => ({
					error: false,
					status: 200,
					payload: definition,
				}),
			};

			useParams.mockReturnValue({
				idOrName: 'hpv',
			});

			render(
				<ClientContextProvider client={testClient}>
					<Definition />
				</ClientContextProvider>
			);

			await expect(screen.findByTestId(testIds.TERM_DEF_TITLE)).resolves.toBeInTheDocument();
			expect(screen.queryByTestId(testIds.TERM_DEF_PRONUNCIATION)).not.toBeInTheDocument();
			expect(screen.queryByRole('region', { name: /pronunciation/i })).not.toBeInTheDocument();
			expect(screen.queryByText(/pronunciation key/i)).not.toBeInTheDocument();
			expect(screen.queryByRole('figure')).not.toBeInTheDocument();
		});
	});

	describe('Display "Page Not Found" for pretty URLs without definitions', () => {
		beforeEach(() => {
			jest.spyOn(console, 'error');
			console.error.mockImplementation(() => {});
		});

		afterEach(() => {
			console.error.mockRestore();
		});

		it('should display page not found for pretty URL that does not exist', async () => {
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

			useLocation.mockReturnValue({ location: {} });
			useParams.mockReturnValue({ idOrName });
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

			const testClient = {
				query: async () => ({
					error: true,
					status: 404,
					loading: false,
					payload: {
						Message: "No match for dictionary 'Cancer.gov', audience 'Patient', language 'en', pretty URL name 'chicken'.",
					},
				}),
			};

			render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={testClient}>
						<ErrorBoundary>
							<Definition />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);

			await expect(screen.findByText('Page Not Found')).resolves.toBeInTheDocument();
		});
	});
});
