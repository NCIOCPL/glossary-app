import { render, waitFor } from '@testing-library/react';
import PropTypes from 'prop-types';
import React from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { ClientContextProvider } from 'react-fetching-library';
import Definition from '../Definition';
import ErrorBoundary from '../../ErrorBoundary';
import { useStateValue } from '../../../store/store.jsx';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store');

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		idOrName: '46722',
	}),
}));

let location;

function ComponentWithLocation({ RenderComponent }) {
	location = useLocation();
	return <RenderComponent />;
}

ComponentWithLocation.propTypes = {
	RenderComponent: PropTypes.func,
};

describe('Definition component', () => {
	it('Ensure page is redirected to the definition page with a pretty URL name', async () => {
		const dictionaryName = 'Cancer.gov';
		const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
		const language = 'en';
		const searchBoxTitle = "Search NCI's Dictionary of Cancer Terms";

		const client = {
			query: async () => ({
				error: false,
				status: 200,
				payload: {
					termId: 46722,
					language: 'en',
					dictionary: 'Cancer.gov',
					audience: 'Patient',
					termName: 'A33',
					firstLetter: 'a',
					prettyUrlName: 'a33',
					pronunciation: null,
					definition: {
						html: 'A type of monoclonal antibody used in cancer detection or therapy. Monoclonal antibodies are laboratory-produced substances that can locate and bind to cancer cells.',
						text: 'A type of monoclonal antibody used in cancer detection or therapy. Monoclonal antibodies are laboratory-produced substances that can locate and bind to cancer cells.',
					},
					otherLanguages: [],
					relatedResources: [],
					media: [],
				},
				loading: false,
			}),
		};

		useStateValue.mockReturnValue([
			{
				altLanguageDictionaryBasePath: '/diccionario',
				languageToggleSelector: '#LangList1 a',
				appId: 'mockAppId',
				canonicalHost: 'https://example.org',
				baseHost: 'http://localhost:3000',
				basePath: '/',
				dictionaryName,
				dictionaryTitle,
				language,
				searchBoxTitle,
			},
		]);

		render(
			<MockAnalyticsProvider>
				<ClientContextProvider client={client}>
					<ErrorBoundary>
						<MemoryRouter initialEntries={['/']}>
							<ComponentWithLocation RenderComponent={Definition} />
						</MemoryRouter>
					</ErrorBoundary>
				</ClientContextProvider>
			</MockAnalyticsProvider>
		);

		const expectedLocationObject = {
			pathname: '/def/a33',
			search: '?redirect=true',
			hash: '',
			state: null,
			key: expect.any(String),
		};
		await waitFor(() => {
			expect(location).toMatchObject(expectedLocationObject);
		});
	});
});
