import { act, cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, useLocation } from 'react-router';
import { MockAnalyticsProvider } from '../../../tracking';

import { testIds } from '../../../constants';
import { Term } from '../index';
import { useStateValue } from '../../../store/store';

jest.mock('../../../store/store');

const analyticsHandler = jest.fn(() => {});

let wrapper;

describe('Term component rendered with English', () => {
	let location;
	const language = 'en';
	const searchBoxTitle = "Search NCI's Dictionary of Cancer Terms";

	// Set up two mock terms
	const testTerms = [
		[
			'pretty URL name',
			{
				termId: 46722,
				language: 'en',
				dictionary: 'Cancer.gov',
				audience: 'Patient',
				termName: 'A33',
				firstLetter: 'a',
				prettyUrlName: 'a33',
				pronunciation: null,
				definition: {
					html:
						'A type of monoclonal antibody used in cancer detection or therapy. Monoclonal antibodies are laboratory-produced substances that can locate and bind to cancer cells.',
					text:
						'A type of monoclonal antibody used in cancer detection or therapy. Monoclonal antibodies are laboratory-produced substances that can locate and bind to cancer cells.',
				},
				relatedResources: [],
				media: [],
			},
			{
				pathname: `/def/a33`,
				search: '',
				hash: '',
				state: null,
				key: expect.any(String),
			},
		],
		[
			'term ID only',
			{
				termId: 658765,
				language: 'en',
				dictionary: 'Cancer.gov',
				audience: 'Patient',
				termName: 'A6',
				firstLetter: 'a',
				prettyUrlName: null,
				pronunciation: null,
				definition: {
					html:
						'A substance being studied in the treatment of cancer. A6 is a small piece of a protein called urokinase (an enzyme that dissolves blood clots or prevents them from forming). It is a type of antiangiogenesis agent and a type of antimetastatic agent. Also called urokinase plasminogen activator (uPA)-derived peptide A6.',
					text:
						'A substance being studied in the treatment of cancer. A6 is a small piece of a protein called urokinase (an enzyme that dissolves blood clots or prevents them from forming). It is a type of antiangiogenesis agent and a type of antimetastatic agent. Also called urokinase plasminogen activator (uPA)-derived peptide A6.',
				},
				relatedResources: [],
				media: [],
			},
			{
				pathname: `/def/658765`,
				search: '',
				hash: '',
				state: null,
				key: expect.any(String),
			},
		],
	];

	function TermWithLocation({ term }) {
		location = useLocation();
		return <Term payload={term} />;
	}
	TermWithLocation.propTypes = {
		term: PropTypes.object,
	};

	afterEach(() => {
		cleanup();
	});

	test.each(testTerms)(
		'Check term title exists as link, click on link and confirm correct location when term has %s',
		async (termType, termObject, expectedLocationObject) => {
			const dictionaryName = 'Cancer.gov';
			const dictionaryTitle = 'NCI Dictionary of Cancer Terms';

			useStateValue.mockReturnValue([
				{
					appId: 'mockAppId',
					basePath: '/',
					dictionaryName,
					dictionaryTitle,
					language,
					searchBoxTitle,
				},
			]);

			await act(async () => {
				wrapper = render(
					<MockAnalyticsProvider>
						<MemoryRouter initialEntries={['/']}>
							<TermWithLocation term={termObject} />
						</MemoryRouter>
					</MockAnalyticsProvider>
				);
			});

			const { getByRole } = wrapper;
			// Get term title link
			const termTitleLink = getByRole('link');
			// Expect term title link text to match term name
			expect(termTitleLink.textContent).toBe(termObject.termName);
			// Click on term title link
			fireEvent.click(termTitleLink);
			// Expect to navigate to definition page for term
			expect(location).toMatchObject(expectedLocationObject);
		}
	);

	// Add term description test
	test.each(testTerms)(
		'Term description is displayed for term with %s',
		async (termType, termObject) => {
			const dictionaryName = 'Cancer.gov';
			const dictionaryTitle = 'NCI Dictionary of Cancer Terms';

			useStateValue.mockReturnValue([
				{
					appId: 'mockAppId',
					basePath: '/',
					dictionaryName,
					dictionaryTitle,
					language,
					searchBoxTitle,
				},
			]);

			await act(async () => {
				wrapper = render(
					<MockAnalyticsProvider>
						<MemoryRouter initialEntries={['/']}>
							<TermWithLocation term={termObject} />
						</MemoryRouter>
					</MockAnalyticsProvider>
				);
			});

			const { getByTestId } = wrapper;
			expect(getByTestId(testIds.TERM_ITEM_DESCRIPTION)).toBeInTheDocument();
		}
	);

	test.each(testTerms)(
		'Term result click analytics event',
		async (termType, termObject) => {
			const dictionaryName = 'Cancer.gov';
			const dictionaryTitle = 'NCI Dictionary of Cancer Terms';

			useStateValue.mockReturnValue([
				{
					appId: 'mockAppId',
					basePath: '/',
					dictionaryName,
					dictionaryTitle,
					language,
					searchBoxTitle,
				},
			]);

			await act(async () => {
				wrapper = render(
					<MockAnalyticsProvider analyticsHandler={analyticsHandler}>
						<MemoryRouter initialEntries={['/']}>
							<TermWithLocation term={termObject} />
						</MemoryRouter>
					</MockAnalyticsProvider>
				);
			});

			const { container } = wrapper;
			const termLink = container.querySelector('a');

			fireEvent.click(termLink);
			expect(analyticsHandler).toHaveBeenCalled();
		}
	);
});
