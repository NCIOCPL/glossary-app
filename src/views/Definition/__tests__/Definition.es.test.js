import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { useLocation, useParams } from 'react-router';
import { ClientContextProvider } from 'react-fetching-library';

import Definition from '../Definition';
import { useStateValue } from '../../../store/store.js';
import fixtures from '../../../utils/fixtures';

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
});
