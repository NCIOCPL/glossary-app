import { act, render } from '@testing-library/react';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';

import UseCustomQuerySample from '../samples/UseCustomQuery';
import { useStateValue } from '../../store/store';
import { i18n } from '../../utils';
import ErrorBoundary from '../../views/ErrorBoundary';

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
		const language = 'en';
		useStateValue.mockReturnValue([{ language }]);
		client = {
			query: async () => ({
				error: true,
				status: 500,
				payload: {},
			}),
		};
		await act(async () => {
			wrapper = render(
				<ClientContextProvider client={client}>
					<ErrorBoundary>
						<UseCustomQuerySample />
					</ErrorBoundary>
				</ClientContextProvider>
			);
		});
		const { getByText } = wrapper;
		expect(getByText(i18n.errorPageText[language])).toBeInTheDocument();
	});

	test('useCustomQuery example should throw error - Spanish message', async () => {
		const language = 'es';
		useStateValue.mockReturnValue([{ language }]);
		client = {
			query: async () => ({
				error: true,
				status: 500,
				payload: {},
			}),
		};
		await act(async () => {
			wrapper = render(
				<ClientContextProvider client={client}>
					<ErrorBoundary>
						<UseCustomQuerySample />
					</ErrorBoundary>
				</ClientContextProvider>
			);
		});
		const { getByText } = wrapper;
		expect(getByText(i18n.errorPageText[language])).toBeInTheDocument();
	});

	test('useCustomQuery example should display content and not throw error', async () => {
		const language = 'en';
		const contentMessage = 'Successful API call with content';
		useStateValue.mockReturnValue([{ language }]);

		client = {
			query: async () => ({
				error: false,
				status: 200,
				payload: { contentMessage },
			}),
		};
		await act(async () => {
			wrapper = render(
				<ClientContextProvider client={client}>
					<ErrorBoundary>
						<UseCustomQuerySample />
					</ErrorBoundary>
				</ClientContextProvider>
			);
		});
		const { getByText } = wrapper;
		expect(getByText(contentMessage)).toBeInTheDocument();
	});
});
