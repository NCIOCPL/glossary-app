import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter } from 'react-router';

import { NO_MATCHING_TEXT_EXPAND, testIds } from '../../../constants';
import Home from '../Home';
import { useStateValue } from '../../../store/store.js';
import { fixtures } from '../../../utils';

jest.mock('../../../store/store.js');

let wrapper;
const dispatch = jest.fn();
const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
const dictionaryIntroText =
	'<p>El diccionario de cáncer del NCI contiene <strong>{{term_count}}</strong> términos relacionados con el cáncer y la medicina.</p>' +
	'<p>Ofrecemos un widget que usted puede añadir a su sitio web para que sus usuarios puedan buscar términos de cáncer. <a href="/espanol/sindicacion/widgets">Obtenga el widget de términos de cáncer del Diccionario del NCI</a>.</p>';
const language = 'es';

const expandChar = 'A';
const queryFile = `${expandChar}.json`;
const { getFixture } = fixtures;
const fixturePath = `/Terms/expand/Cancer.gov/Patient`;
const termList = getFixture(`${fixturePath}/${language}/${queryFile}`);

const client = {
	query: async () => ({
		error: false,
		status: 200,
		payload: termList,
	}),
};

describe('Home component(Spanish)', () => {
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
		},
		dispatch,
	]);

	//create mock lang node
	const mockToggleElement = document.createElement('div');
	mockToggleElement.id = 'LangList1';
	mockToggleElement.innerHTML =
		'<a href="/" data-testid="mockLangToggle">Language</a>';
	document.body.appendChild(mockToggleElement);

	beforeEach(async () => {
		await act(async () => {
			wrapper = render(
				<MemoryRouter initialEntries={['/']}>
					<ClientContextProvider client={client}>
						<Home />
					</ClientContextProvider>
				</MemoryRouter>
			);
		});
	});

	afterEach(cleanup);

	test('Updates language toggle with link to english analog ', () => {
		const { getByTestId } = wrapper;
		expect(getByTestId('mockLangToggle')).toHaveAttribute(
			'href',
			'/cancer-terms'
		);
	});
});
