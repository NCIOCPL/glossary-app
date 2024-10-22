/* eslint-disable */
// To reconcile with shared Search component
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter, useLocation } from 'react-router-dom';

import autoSuggestionsEnglish from './autoSuggestions';
import { searchMatchType, testIds } from '../../../../constants';
import Search from '../Search';
import { useStateValue } from '../../../../store/store';
import { i18n } from '../../../../utils';

import { MockAnalyticsProvider } from '../../../../tracking';
const analyticsHandler = jest.fn(() => {});

jest.mock('../../../../store/store.jsx');
let client;
let wrapper;
const { beginsWith, contains } = searchMatchType;
const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';

describe('<Search /> English', () => {
	let location;
	const language = 'en';

	function SearchWithLocation({ RenderComponent }) {
		location = useLocation();
		return <RenderComponent />;
	}

	SearchWithLocation.propTypes = {
		RenderComponent: PropTypes.func,
	};

	beforeEach(async () => {
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
				dictionaryName,
				dictionaryTitle,
				language,
			},
		]);

		client = {
			query: async () => ({
				error: false,
				status: 200,
				payload: autoSuggestionsEnglish,
			}),
		};

		await act(async () => {
			wrapper = await render(
				<MockAnalyticsProvider analyticsHandler={analyticsHandler}>
					<MemoryRouter initialEntries={['/']}>
						<ClientContextProvider client={client}>
							<SearchWithLocation RenderComponent={Search} />
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});
	});

	afterEach(() => {
		cleanup();
	});

	test('Search component renders', () => {
		const { getByTestId } = wrapper;
		expect(getByTestId(testIds.SEARCH_CONTAINER)).toBeInTheDocument();
	});

	test('Check both Starts with and Contains radio buttons are present', () => {
		const { getByDisplayValue } = wrapper;
		expect(getByDisplayValue(searchMatchType.beginsWith)).toBeInTheDocument();
		expect(getByDisplayValue(searchMatchType.contains)).toBeInTheDocument();
	});

	test('Starts with radio is checked by default', () => {
		const { getByDisplayValue } = wrapper;
		const startsWithRadio = getByDisplayValue(searchMatchType.beginsWith);
		expect(startsWithRadio.defaultChecked).toBe(true);
	});

	test('Ensure correct location is set on router when Search button is clicked without search box text input', () => {
		const { getByText } = wrapper;
		// Expected router location object when "Starts with" radio button is checked by default
		const expectedLocationObject = {
			pathname: '/search/',
			search: '',
			hash: '',
			state: null,
			key: expect.any(String),
		};
		const searchButton = getByText('Search');
		fireEvent.click(searchButton);
		expect(location).toMatchObject(expectedLocationObject);
	});

	test('Ensure location is set on router when Search button is clicked with text input', async () => {
		const { getByPlaceholderText, getByText } = wrapper;
		const searchText = 'meta';
		// Expected router location object when "Starts with" radio button is checked by default
		// and text input entered is "meta"
		const expectedLocationObject = {
			pathname: `/search/${searchText}/`,
			search: `?searchMode=${beginsWith}`,
			hash: '',
			state: null,
			key: expect.any(String),
		};
		const textInput = getByPlaceholderText('Enter keywords or phrases');
		const searchButton = getByText('Search');
		await act(async () => {
			fireEvent.change(textInput, { target: { value: searchText } });
		});
		fireEvent.click(searchButton);
		expect(location).toMatchObject(expectedLocationObject);
	});

	test('Ensure location is set on router when Search button is clicked with "Contains" radio button checked and text input entered', async () => {
		const { getByDisplayValue, getByPlaceholderText, getByText } = wrapper;
		const searchText = 'cancer';
		// Expected router location object when "Contains" radio button is checked
		// and the text input entered is "cancer"
		const expectedLocationObject = {
			pathname: `/search/${searchText}/`,
			search: `?searchMode=${contains}`,
			hash: '',
			state: null,
			key: expect.any(String),
		};
		const containsRadio = getByDisplayValue(searchMatchType.contains);
		fireEvent.click(containsRadio);
		const textInput = getByPlaceholderText('Enter keywords or phrases');
		await act(async () => {
			fireEvent.change(textInput, { target: { value: searchText } });
		});
		const searchButton = getByText('Search');
		fireEvent.click(searchButton);
		expect(location).toMatchObject(expectedLocationObject);
	});

	test('Submitting search triggers provided analytics event', async () => {
		const { getByPlaceholderText, getByText } = wrapper;
		const searchText = 'metastatic';
		const textInput = getByPlaceholderText('Enter keywords or phrases');
		await act(async () => {
			fireEvent.change(textInput, { target: { value: searchText } });
		});
		const searchButton = getByText('Search');
		fireEvent.click(searchButton);
		expect(analyticsHandler).toHaveBeenCalled();
	});

	describe('Autocomplete', () => {
		beforeEach(() => {
			cleanup();
		});
		afterEach(() => {
			cleanup();
		});

		test('should take search input, select highlighted option, execute search, and confirm expected location', async () => {
			const searchText = 'meta';

			client = {
				query: async () => ({
					error: false,
					status: 200,
					payload: autoSuggestionsEnglish,
				}),
			};

			await act(async () => {
				wrapper = await render(
					<MockAnalyticsProvider>
						<MemoryRouter initialEntries={['/']}>
							<ClientContextProvider client={client}>
								<SearchWithLocation RenderComponent={Search} />
							</ClientContextProvider>
						</MemoryRouter>
					</MockAnalyticsProvider>
				);
			});

			const { container } = wrapper;
			const input = screen.getByRole('combobox');

			// Focus to get autosuggest options
			input.focus();
			await act(async () => {
				fireEvent.change(document.activeElement, { target: { value: 'ap' } });
			});
			expect(
				container.querySelector(
					`div[data-testid='${testIds.AUTO_SUGGEST_OPTIONS}']`
				).textContent
			).toBe(i18n.autoSuggestThreeOrMoreChars[language]);
			await act(async () => {
				fireEvent.change(document.activeElement, {
					target: { value: searchText },
				});
			});
			fireEvent.focus(input);
			const menuOptions = screen.getAllByRole('option');
			// Expect menu options count displayed in autosuggest to match data count
			expect(menuOptions.length).toEqual(6);

			// Down key and Enter key to select first item highlighted in options list (meta-analysis)
			fireEvent(
				input,
				new KeyboardEvent('keydown', {
					key: 'ArrowDown',
					keyCode: 13,
					which: 13,
					bubbles: true,
				})
			);

			fireEvent(
				input,
				new KeyboardEvent('keydown', {
					key: 'Enter',
					keyCode: 13,
					which: 13,
					bubbles: true,
				})
			);

			const searchButton = screen.getByText('Search');
			await act(async () => {
				fireEvent.click(searchButton);
			});
			const expectedLocationObject = {
				pathname: `/search/meta-analysis/`,
				search: `?searchMode=${beginsWith}`,
				hash: '',
				state: null,
				key: expect.any(String),
			};
			expect(location).toMatchObject(expectedLocationObject);
		});
	});
});
