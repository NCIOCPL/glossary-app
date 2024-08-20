import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockAnalyticsProvider } from '../../../../tracking';

import AZList from '../AZList';
import { testIds } from '../../../../constants';
import { useStateValue } from '../../../../store/store';

jest.mock('../../../../store/store.jsx');

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

const analyticsHandler = jest.fn(() => {});

describe('AZList component', () => {
	it('AZList renders and contains 27 items', () => {
		render(
			<MockAnalyticsProvider analyticsHandler={analyticsHandler}>
				<MemoryRouter initialEntries={['/']}>
					<AZList />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(27);
		expect(screen.getByTestId(testIds.AZ_LIST)).toBeInTheDocument();
	});

	it('AZList expand analytics event', () => {
		render(
			<MockAnalyticsProvider analyticsHandler={analyticsHandler}>
				<MemoryRouter initialEntries={['/']}>
					<AZList />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		const firstLink = screen.getAllByRole('link')[0];
		fireEvent.click(firstLink);
		expect(analyticsHandler).toHaveBeenCalledTimes(1);
	});
});
