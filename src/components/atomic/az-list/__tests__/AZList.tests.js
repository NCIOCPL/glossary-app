import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockAnalyticsProvider } from '../../../../tracking';

import AZList from '../AZList';
import { testIds } from '../../../../constants';
import { useStateValue } from '../../../../store/store';

jest.mock('../../../../store/store.js');

const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
useStateValue.mockReturnValue([
	{
		appId: 'mockAppId',
		basePath: '/',
		dictionaryName,
		dictionaryTitle,
		language: 'en',
	},
]);

const analyticsHandler = jest.fn((data) => {});

describe('AZList component', () => {
	test('AZList renders and contains 27 items', () => {
		const wrapper = render(
			<MockAnalyticsProvider analyticsHandler={analyticsHandler}>
				<MemoryRouter initialEntries={['/']}>
					<AZList />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		const { container, getByTestId } = wrapper;
		const listContainer = container.querySelector('ul');
		// Validate that list contains 27 items
		expect(listContainer.children.length).toBe(27);
		expect(getByTestId(testIds.AZ_LIST));
	});

	test('AZList expand analytics event', () => {
		const wrapper = render(
			<MockAnalyticsProvider analyticsHandler={analyticsHandler}>
				<MemoryRouter initialEntries={['/']}>
					<AZList />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		const { container } = wrapper;
		const listContainer = container.querySelector('ul');
		// Get the first link, click it and see what it gets.
		const link = listContainer.firstChild.firstChild;
		fireEvent.click(link);
		expect(analyticsHandler).toHaveBeenCalledTimes(1);
	});
});
