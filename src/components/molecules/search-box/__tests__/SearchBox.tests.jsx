import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockAnalyticsProvider } from '../../../../tracking';

import { testIds } from '../../../../constants';
import { SearchBox } from '../../../index';
import { useStateValue } from '../../../../store/store';

jest.mock('../../../../store/store.jsx');

const renderSearchBox = () => {
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

	return render(
		<MockAnalyticsProvider>
			<MemoryRouter initialEntries={['/']}>
				<SearchBox />
			</MemoryRouter>
		</MockAnalyticsProvider>
	);
};

describe('SearchBox component', () => {
	it('Renders with child components [ Search | AZList ]', () => {
		renderSearchBox();

		// Search component should be rendered
		expect(screen.getByTestId(testIds.SEARCH_CONTAINER)).toBeInTheDocument();
		// AZList component should be rendered
		expect(screen.getByTestId(testIds.AZ_LIST)).toBeInTheDocument();
	});
});
